import type { APIRoute } from "astro";

const VERSION = "0.1.7";
const R2_BASE = "https://pub-29493441e7d647038e2f777e7cac5cce.r2.dev";

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      version: VERSION,
      release_notes: "",
      downloads: {
        "linux-x86_64": {
          url: `${R2_BASE}/dearsql-${VERSION}-linux-x86_64`,
          sha256: "",
        },
        "linux-aarch64": {
          url: `${R2_BASE}/dearsql-${VERSION}-linux-aarch64`,
          sha256: "",
        },
      },
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    }
  );
};
