import type { APIRoute } from "astro";
import { getDocSources } from "./_nav";

export const prerender = true;

// /docs/<page>.md: the page as plain markdown, for agents and scripts
export function getStaticPaths() {
  return getDocSources().map((doc) => ({
    params: { page: doc.url.replace("/docs/", "") },
    props: { doc },
  }));
}

export const GET: APIRoute = ({ props }) =>
  new Response(`# ${props.doc.title}\n\n> ${props.doc.description}\n\n${props.doc.markdown}`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
