import type { APIRoute } from "astro";

const METADATA_URL =
  "https://pub-29493441e7d647038e2f777e7cac5cce.r2.dev/version.json";

export const GET: APIRoute = async () => {
  try {
    const upstream = await fetch(METADATA_URL, {
      headers: { Accept: "application/json" },
    });

    if (!upstream.ok) {
      return new Response(
        JSON.stringify({
          error: "Failed to fetch Linux version metadata",
          status: upstream.status,
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const body = await upstream.text();
    return new Response(body, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          upstream.headers.get("Cache-Control") ?? "public, max-age=300",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch Linux version metadata",
        message: error instanceof Error ? error.message : "unknown error",
      }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  }
};
