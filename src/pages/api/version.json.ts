import type { APIRoute } from "astro";

const GITHUB_REPO = "dunkbing/dearsql";
const LATEST_RELEASE_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
const VERSION_ASSET_NAME = "version.json";

type GitHubAsset = {
  name: string;
  browser_download_url: string;
};

type GitHubRelease = {
  body?: string | null;
  assets?: GitHubAsset[];
};

const errorResponse = (message: string, status = 502) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });

export const GET: APIRoute = async () => {
  try {
    const releaseRes = await fetch(LATEST_RELEASE_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "dearsql-website",
      },
    });

    if (!releaseRes.ok) {
      return errorResponse(
        `Failed to fetch latest GitHub release (${releaseRes.status})`,
      );
    }

    const release = (await releaseRes.json()) as GitHubRelease;
    const versionAsset = release.assets?.find(
      (asset) => asset.name === VERSION_ASSET_NAME,
    );

    if (!versionAsset) {
      return errorResponse("version.json asset not found in latest release");
    }

    const metadataRes = await fetch(versionAsset.browser_download_url, {
      headers: { Accept: "application/json" },
    });

    if (!metadataRes.ok) {
      return errorResponse(
        `Failed to fetch version.json asset (${metadataRes.status})`,
      );
    }

    const metadata = await metadataRes.json();
    metadata.release_notes = release.body ?? "";

    return new Response(JSON.stringify(metadata), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "unknown error",
    );
  }
};
