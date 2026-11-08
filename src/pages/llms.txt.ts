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

## Agent tools

The same tools over MCP (\`dearsql --mcp\`) and as shell commands (\`dearsql <tool> -c <connection>\`, where a connection is a saved name, a URL or a database file; \`dearsql tools\` prints them all):

- \`search_schema\`, \`describe_table\`, \`list_tables\`: find tables and columns (fuzzy), then their keys, indexes and foreign keys.
- \`run_query\`: one read-only statement; rows as compact text, with a cursor for more.
- \`explain_query\`: the query plan plus rule-based warnings (filtered full scans, scans repeated per join row, big sorts, misestimates); PostgreSQL, MySQL 8, SQLite.
- \`execute_sql\`: a change, with \`--allow-writes\` (MCP) or as \`dearsql exec\`; the user approves it.
- \`list_objects\`, \`read_object\` (+ \`copy_object\`, \`delete_object\`, \`upload_object\`, \`download_object\` with writes): S3-compatible object storage connections.

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
