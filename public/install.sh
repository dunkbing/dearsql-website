#!/usr/bin/env sh
set -eu

# Downloads DearSQL and puts the `dearsql` command in ~/.local/bin.
# Linux (x86_64, aarch64): the AppImage itself. macOS (Apple silicon):
# DearSQL.app in /Applications (or ~/Applications) and a link to it.
# Non-interactive, safe to re-run to update. DEARSQL_TARGET replaces that copy
# instead (the AppImage, or the .app bundle): `dearsql upgrade` sets it.
# Usage: curl -fsSL https://dearsql.dev/install.sh | sh

MANIFEST_URL="https://dearsql.dev/api/version.json"
RELEASE_BASE="https://github.com/dunkbing/dearsql/releases/download"
ICON_URL="https://dearsql.dev/appicon.png"
APP_ID="io.gitlab.dunkbing.dearsql"
TEAM_ID="2SY55TFJ22"
BIN_DIR="$HOME/.local/bin"

main() {
    if command -v curl >/dev/null 2>&1; then
        fetch() { command curl -fsSL "$@"; }
        download() { command curl -fSL --progress-bar -o "$1" "$2"; }
    elif command -v wget >/dev/null 2>&1; then
        fetch() { command wget -qO- "$@"; }
        download() { command wget -O "$1" "$2"; }
    else
        echo "Could not find 'curl' or 'wget' in your path."
        exit 1
    fi

    echo "Fetching latest version info..."
    manifest=$(fetch "$MANIFEST_URL" | tr -d '[:space:]') || { echo "Failed to fetch version manifest."; exit 1; }
    # Parse JSON with pure shell (no python3/jq dependency)
    version=$(printf '%s' "$manifest" | sed 's/.*"version":"\([^"]*\)".*/\1/')
    case "$version" in
        [0-9]*) ;;
        *) echo "Failed to parse version manifest."; exit 1 ;;
    esac

    case "$(uname -s)" in
        Linux) install_linux ;;
        Darwin) install_macos ;;
        *)
            echo "This installer supports Linux and macOS. On Windows, download the installer from https://dearsql.dev"
            exit 1
            ;;
    esac

    # an upgrade runs the command it replaced
    [ -n "${DEARSQL_TARGET:-}" ] || path_hint
}

install_linux() {
    case "$(uname -m)" in
        x86_64)  arch="x86_64" ;;
        aarch64|arm64) arch="aarch64" ;;
        *)
            echo "Unsupported architecture: $(uname -m)"
            exit 1
            ;;
    esac
    platform_key="appimage-$arch"

    url=$(printf '%s' "$manifest" | sed "s/.*\"$platform_key\":{[^}]*\"url\":\"\\([^\"]*\\)\".*/\\1/")
    sha256=$(printf '%s' "$manifest" | sed "s/.*\"$platform_key\":{[^}]*\"sha256\":\"\\([^\"]*\\)\".*/\\1/")

    # sed leaves the manifest untouched when this arch has no entry
    case "$url" in
        http*) ;;
        *)
            echo "No DearSQL build for ${platform_key} in v${version} yet."
            exit 1
            ;;
    esac
    case "$sha256" in
        *[!0-9a-f]*) sha256="" ;;
    esac

    echo "Installing DearSQL v${version} for ${platform_key}..."

    target="${DEARSQL_TARGET:-$BIN_DIR/dearsql}"
    mkdir -p "$(dirname "$target")"
    # same directory, so the move is a rename: a running AppImage can't be overwritten
    tmpfile=$(mktemp "$(dirname "$target")/.dearsql.XXXXXX")
    trap 'rm -f "$tmpfile"' EXIT

    download "$tmpfile" "$url" || { echo "Failed to download binary."; exit 1; }

    # Verify checksum if provided
    if [ -n "$sha256" ]; then
        actual_sha256=$(sha256sum "$tmpfile" | cut -d' ' -f1)
        if [ "$actual_sha256" != "$sha256" ]; then
            echo "Checksum verification failed!"
            echo "  Expected: $sha256"
            echo "  Got:      $actual_sha256"
            exit 1
        fi
        echo "Checksum verified."
    fi

    chmod 755 "$tmpfile"
    mv "$tmpfile" "$target"
    trap - EXIT

    # Install icon
    icon_dir="$HOME/.local/share/icons/hicolor/256x256/apps"
    mkdir -p "$icon_dir"
    fetch "$ICON_URL" > "$icon_dir/${APP_ID}.png" 2>/dev/null || true

    # Create desktop entry
    desktop_dir="$HOME/.local/share/applications"
    mkdir -p "$desktop_dir"
    printf '%s\n' \
        "[Desktop Entry]" \
        "Name=DearSQL" \
        "Comment=SQL Database Client" \
        "Exec=\"$target\"" \
        "Icon=$icon_dir/${APP_ID}.png" \
        "Terminal=false" \
        "Type=Application" \
        "StartupWMClass=${APP_ID}" \
        "Categories=Development;Database;IDE;" \
        > "$desktop_dir/${APP_ID}.desktop"

    (command -v update-desktop-database >/dev/null 2>&1 && update-desktop-database "$desktop_dir" 2>/dev/null) || true

    echo "DearSQL v${version} installed to ${target}"
}

install_macos() {
    if [ "$(uname -m)" != "arm64" ]; then
        echo "DearSQL for macOS needs an Apple silicon Mac (arm64)."
        exit 1
    fi
    # no checksum in the manifest for the dmg, so the signature is checked instead
    url="$RELEASE_BASE/v${version}/DearSQL.dmg"
    echo "Installing DearSQL v${version} for macOS..."

    workdir=$(mktemp -d)
    mountpoint="$workdir/mnt"
    trap 'hdiutil detach -quiet "$mountpoint" 2>/dev/null || true; rm -rf "$workdir"' EXIT

    download "$workdir/DearSQL.dmg" "$url" || { echo "Failed to download DearSQL.dmg."; exit 1; }
    mkdir -p "$mountpoint"
    hdiutil attach -quiet -nobrowse -readonly -mountpoint "$mountpoint" "$workdir/DearSQL.dmg" \
        || { echo "Failed to open DearSQL.dmg."; exit 1; }

    app="$mountpoint/DearSQL.app"
    if ! codesign --verify --deep --strict "$app" 2>/dev/null ||
        ! codesign -dv "$app" 2>&1 | grep -q "TeamIdentifier=$TEAM_ID"; then
        echo "Signature check failed: DearSQL.app is not signed by DearSQL's developer."
        exit 1
    fi
    echo "Signature verified."

    if [ -n "${DEARSQL_TARGET:-}" ]; then
        dest="$DEARSQL_TARGET"
    elif [ -w /Applications ]; then
        dest="/Applications/DearSQL.app"
    else
        mkdir -p "$HOME/Applications"
        dest="$HOME/Applications/DearSQL.app"
    fi
    # copy first, so a failed copy leaves the old app in place
    rm -rf "$dest.new"
    ditto "$app" "$dest.new" || { echo "Could not write to $(dirname "$dest")."; exit 1; }
    rm -rf "$dest"
    mv "$dest.new" "$dest"
    echo "DearSQL v${version} installed to ${dest}"

    # an upgrade keeps whatever link the user already has
    if [ -z "${DEARSQL_TARGET:-}" ]; then
        mkdir -p "$BIN_DIR"
        ln -sf "$dest/Contents/MacOS/DearSQL" "$BIN_DIR/dearsql"
        echo "Linked ${BIN_DIR}/dearsql"
    fi
}

path_hint() {
    if command -v dearsql >/dev/null 2>&1; then
        echo "Run with 'dearsql' (or 'dearsql --help')"
        return
    fi
    echo "To run DearSQL from your terminal, you must add ~/.local/bin to your PATH"
    echo "Run:"
    case "${SHELL:-$(ps -p $$ -o comm= 2>/dev/null)}" in
        *zsh)
            echo "   echo 'export PATH=\$HOME/.local/bin:\$PATH' >> ~/.zshrc"
            echo "   source ~/.zshrc"
            ;;
        *fish)
            echo "   fish_add_path -U $HOME/.local/bin"
            ;;
        *)
            echo "   echo 'export PATH=\$HOME/.local/bin:\$PATH' >> ~/.bashrc"
            echo "   source ~/.bashrc"
            ;;
    esac
}

main "$@"
