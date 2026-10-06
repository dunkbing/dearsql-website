---
layout: ../../layouts/DocsLayout.astro
title: "Command line"
description: "Run DearSQL from a terminal: open the app, browse in a terminal UI, or give your coding agent database tools."
section: "Getting started"
sectionOrder: 1
order: 4
---

DearSQL is one program with three ways in:

| Command | What it does |
|---|---|
| `dearsql` | Opens the app |
| `dearsql my.db` | Opens the app with that file |
| `dearsql --tui` | Browse and query in the terminal |
| `dearsql --mcp` | Gives a coding agent your database tools |

## Installing the `dearsql` command

Open **Settings** (the gear in the title bar) and click **Install 'dearsql' Command** under **Command Line**.

- On macOS this links `/usr/local/bin/dearsql` to the app. If that folder needs administrator rights, macOS asks for your password once.
- On Linux it links `~/.local/bin/dearsql` to the AppImage. Make sure `~/.local/bin` is on your `PATH`.

If you move the app later, click the button again to point the command at the new location.

## The terminal UI

```bash
dearsql --tui                                   # pick from your saved connections
dearsql --tui "Production"                      # open a saved connection by name
dearsql --tui postgres://me@localhost/shop      # or a connection URL
dearsql --tui ~/data/orders.duckdb              # or a SQLite, DuckDB or CSV file
```

The left pane is the same tree as the app's sidebar: connections, databases, schemas, tables. Use the arrow keys to move, **→** to expand, **←** to collapse, and **Enter** to open a table.

The right pane has three tabs:

- **F2 Data** shows the table's rows. Scroll them with the arrow keys and **Page Up**/**Page Down**.
- **F3 Structure** shows columns, keys, indexes and foreign keys.
- **F4 SQL** is a query editor. **F5** runs it against the database you last opened.

**Tab** switches between the panes, and **q** quits.

Your saved connections, passwords and SSH tunnels are the app's own, so anything that connects in the app connects here too.

## Database tools for your coding agent

`dearsql --mcp` runs the same [database tools](/docs/ai-database-tools) the assistant chat uses, for any agent that speaks [MCP](https://modelcontextprotocol.io) — Claude Code, Codex, Cursor and others:

```bash
claude mcp add dearsql -- dearsql --mcp
codex mcp add dearsql -- dearsql --mcp
```

The agent can then search your schema, describe tables and run read-only queries against your saved connections, opening them when it needs one. To limit it to a single database, name it after `--mcp`:

```bash
claude mcp add shop -- dearsql --mcp postgres://me@localhost/shop
```

The same rules apply as in the app: writes are rejected, and results come back a page at a time.
