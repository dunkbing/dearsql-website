import type { APIRoute } from "astro";

const SENTRY_HOST = "o1146325.ingest.us.sentry.io";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.text();
  const header = body.split("\n")[0];

  let dsn: string | undefined;
  try {
    dsn = JSON.parse(header)?.dsn;
  } catch {
    return new Response("Invalid envelope", { status: 400 });
  }

  if (!dsn?.includes(SENTRY_HOST)) {
    return new Response("Invalid DSN host", { status: 400 });
  }

  const projectId = new URL(dsn).pathname.replace("/", "");
  const url = `https://${SENTRY_HOST}/api/${projectId}/envelope/`;

  const res = await fetch(url, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/x-sentry-envelope" },
  });

  return new Response(res.body, { status: res.status });
};
