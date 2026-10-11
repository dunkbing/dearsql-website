import type { APIRoute } from "astro";
import { getDocSources } from "./docs/_nav";

export const prerender = true;

// every docs page in one plain-markdown file
export const GET: APIRoute = () =>
  new Response(
    "# DearSQL docs\n\n" +
      getDocSources()
        .map((d) => `# ${d.title}\n\nSource: https://dearsql.dev${d.url}\n\n${d.markdown.trim()}`)
        .join("\n\n---\n\n") +
      "\n",
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
