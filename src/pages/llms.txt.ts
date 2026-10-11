import type { APIRoute } from "astro";
import { getDocSections } from "./docs/_nav";
import { FREE_SAVED_CONNECTIONS, FREE_WORKSPACES } from "../data/limits";

export const prerender = true;

const SITE = "https://dearsql.dev";

// built from the docs pages' frontmatter, so it never drifts from /docs
export const GET: APIRoute = () => {
  const docs = getDocSections()
    .map(
      (section) =>
        `## ${section.name}\n\n` +
        section.pages
          .map((p) => `- [${p.title}](${SITE}${p.url}.md): ${p.description}`)
          .join("\n"),
    )
    .join("\n\n");
  const body = `# DearSQL

> A native desktop SQL client for SQLite, DuckDB, PostgreSQL, MySQL, MariaDB, MongoDB, Redis, SQL Server, Oracle, Cassandra and Redshift, on macOS, Linux and Windows. The same \`dearsql\` binary also runs in a terminal: \`--tui\` (terminal client), \`--mcp\` (database tools for coding agents) and \`--lsp\` (SQL completion for editors).

Install on macOS (Apple silicon) or Linux, non-interactively: \`curl -fsSL ${SITE}/install.sh | sh\`. Then register the agent tools with \`claude mcp add dearsql -- dearsql --mcp\`. Every page below is plain markdown; all of them in one file: ${SITE}/llms-full.txt

${docs}

## Pricing

Free: every database and feature, up to ${FREE_SAVED_CONNECTIONS} saved connections and ${FREE_WORKSPACES} workspaces. Pro: a one-time purchase that removes both limits.

## Optional

- [Changelog](${SITE}/changelog)
- [Compare with other SQL clients](${SITE}/compare)
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
