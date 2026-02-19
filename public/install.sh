#!/usr/bin/env sh
set -eu

# Downloads DearSQL and installs it into ~/.local/.
# Usage: curl -fsSL https://dearsql.dev/install.sh | sh

MANIFEST_URL="https://dearsql.dev/api/version.json"
ICON_URL="https://dearsql.dev/appicon.png"
APP_ID="io.gitlab.dunkbing.dearsql"

main() {
    platform="$(uname -s)"
    arch="$(uname -m)"

    if [ "$platform" != "Linux" ]; then
        echo "This installer only supports Linux."
        exit 1
    fi

    case "$arch" in
        x86_64)  arch="x86_64" ;;
        aarch64) arch="aarch64" ;;
        *)
            echo "Unsupported architecture: $arch"
            exit 1
            ;;
    esac

    platform_key="linux-$arch"

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
    manifest=$(fetch "$MANIFEST_URL") || { echo "Failed to fetch version manifest."; exit 1; }

    # Parse JSON with pure shell (no python3/jq dependency)
    version=$(echo "$manifest" | tr -d '[:space:]' | sed 's/.*"version":"\([^"]*\)".*/\1/')
    url=$(echo "$manifest" | tr -d '\n' | sed "s/.*\"$platform_key\":{[^}]*\"url\":\"\\([^\"]*\\)\".*/\\1/")
    sha256=$(echo "$manifest" | tr -d '\n' | sed "s/.*\"$platform_key\":{[^}]*\"sha256\":\"\\([^\"]*\\)\".*/\\1/")

    if [ -z "$version" ] || [ -z "$url" ]; then
        echo "Failed to parse version manifest."
        exit 1
    fi

    echo "Installing DearSQL v${version} for ${platform_key}..."

    tmpfile=$(mktemp)
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

    # Install binary
    install_dir="$HOME/.local/bin"
    mkdir -p "$install_dir"
    mv "$tmpfile" "$install_dir/dearsql"
    trap - EXIT
    chmod +x "$install_dir/dearsql"

    # Install icon
    icon_dir="$HOME/.local/share/icons/hicolor/256x256/apps"
    mkdir -p "$icon_dir"
    fetch "$ICON_URL" > "$icon_dir/${APP_ID}.png" 2>/dev/null || true

    # Create desktop entry
    desktop_dir="$HOME/.local/share/applications"
    mkdir -p "$desktop_dir"
    cat > "$desktop_dir/${APP_ID}.desktop" << EOF
[Desktop Entry]
Name=DearSQL
Comment=SQL Database Client
Exec=$install_dir/dearsql
Icon=$icon_dir/${APP_ID}.png
Terminal=false
Type=Application
StartupWMClass=${APP_ID}
Categories=Development;Database;IDE;
EOF

    command -v update-desktop-database >/dev/null 2>&1 && update-desktop-database "$desktop_dir" 2>/dev/null || true

    echo "DearSQL v${version} installed to ${install_dir}/dearsql"

    # Check PATH
    if [ "$(command -v dearsql)" = "$install_dir/dearsql" ]; then
        echo "Run with 'dearsql'"
    else
        echo "To run DearSQL from your terminal, you must add ~/.local/bin to your PATH"
        echo "Run:"
        case "${SHELL:-}" in
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
    fi
}

main "$@"
