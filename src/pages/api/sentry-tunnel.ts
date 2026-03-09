import type { APIRoute } from "astro";

const SENTRY_HOST = "o1146325.ingest.us.sentry.io";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const buf = await request.arrayBuffer();
  const bytes = new Uint8Array(buf);

  // extract the first line (header JSON) to validate the DSN
  const newline = bytes.indexOf(10); // '\n'
  if (newline === -1) {
    return new Response("Invalid envelope", { status: 400 });
  }

  const headerLine = new TextDecoder().decode(bytes.subarray(0, newline));
  let dsn: string | undefined;
  try {
    dsn = JSON.parse(headerLine)?.dsn;
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
    body: buf,
    headers: { "Content-Type": "application/x-sentry-envelope" },
  });

  return new Response(res.body, { status: res.status });
};
