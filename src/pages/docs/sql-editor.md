---
layout: ../../layouts/DocsLayout.astro
title: "SQL editor"
description: "Run queries, read multi-statement results, and keep scripts around."
section: "Getting started"
sectionOrder: 1
order: 3
---

Open an editor from a database's context menu — **New SQL Editor** — or from a table. Each editor is a tab bound to one database, shown in the header so you always know what you're about to run against.

<img src="/docs/sql-editor.png" alt="A SQL editor tab with a query above and its result grid below, showing execution time and row count" width="800" />

## Running

**Run** executes the whole buffer. If you have text selected, it runs **only the selection** — handy for stepping through a long script one statement at a time.

To run one statement of a script without selecting it, click the green play icon in the margin next to its first line. Hovering the icon outlines the statement in green, so you can see exactly what will run. Semicolons inside strings and comments don't split statements.

<img src="/docs/sql-run-statement.png" alt="Hovering a statement's play icon outlines what it will run" width="800" />

While a query runs the button becomes **Cancel**, so a slow query never locks up the app; DearSQL keeps rendering and you can keep working in other tabs.

Multi-statement scripts are supported. Each statement's result comes back separately, so a script that mixes `SELECT`s with `UPDATE`s shows both the rows and the affected-row counts, in order.

### Parameters

Write `:name` where a value goes, such as `where id = :id`, and DearSQL asks for the values before running, one field per name. A name used twice gets one field. Press Enter to move to the next field; Enter in the last one runs the query. The values stay with the tab, so running again starts from what you typed last.

Numbers and `NULL` go in as typed, and anything else as a quoted string, with quotes escaped for you. A quoted string works for dates and other types too, since the database converts it to the column's type. `:name` inside strings and comments is left alone, as are `::` casts and MySQL's `:=`. This works with Explain too.

<img src="/docs/sql-parameters.png" alt="The query parameters dialog with a field for each :name in the query" width="440" />

## Writing

The editor has syntax highlighting, and autocomplete that reads the statement you are writing against the connected database's schema:

- **Aliases**: after `FROM users u`, typing `u.` lists the columns of `users`.
- **CTEs and subqueries**: `WITH recent AS (...)` and `FROM (SELECT ...) t` offer `recent` and `t` as tables, with the columns they produce.
- **The current statement only**: in a script with several statements, suggestions come from the one under the cursor.
- **Not in strings or comments**: nothing pops up while you type inside quotes or after `--`.
- **Your database's dialect**: keywords and functions match the engine, so `ILIKE` is offered on PostgreSQL but not on MySQL.
- **Quoting**: a name that needs quotes, such as one with spaces or capitals on PostgreSQL, is inserted already quoted.
- **Types**: columns are listed with their type.

While the completion popup is open:

- **Up / Down** move through the suggestions
- **Tab** or **Enter** accepts
- **Escape** dismisses

The same completion works outside the app: in the [terminal UI](/docs/command-line#the-terminal-ui)'s SQL tab, and in Neovim, Helix, VS Code or Emacs through [`dearsql --lsp`](/docs/command-line#sql-completion-in-your-editor).

**Format** reformats the buffer — indentation, keyword casing, and line breaks — using the same tree-sitter grammar that drives the highlighting, so it understands the statement rather than guessing with regexes.

On PostgreSQL, MySQL, MariaDB, SQL Server, SQLite, DuckDB, CockroachDB and TiDB, syntax errors show as you type, without running anything: the word where the database stopped reading is underlined in red (hover it for the message), and the message also shows next to the toolbar with its line number. Editing the text clears the underline until the next check. They come from the database's own parser, so a query the database accepts is never flagged, and a table that doesn't exist yet isn't an error. MySQL, MariaDB, TiDB, SQL Server and CockroachDB check on the server without running anything, so their errors appear a moment after you stop typing, and only while connected. On MySQL, MariaDB and TiDB, checking stops at the first `CREATE PROCEDURE`, `FUNCTION`, `TRIGGER` or `EVENT`. Other engines (Oracle, Redshift, MongoDB and so on) aren't checked: their only syntax checks also look up tables, and would flag a statement for a missing table rather than a mistake in it.

<img src="/docs/sql-syntax-error.png" alt="A typo underlined in the SQL editor" width="800" />

## Query plans

**Explain** shows how the database will run the statement under the cursor, or the selection if you have one, without running it. The plan opens below the editor as a tree: each step, the table and index it uses, the rows the planner expects and its cost. Hover a step for the rest of what the database reports, such as filter and join conditions and sort keys.

![The plan of a join on PostgreSQL, with real timings](/docs/sql-explain.png)

Tick **Analyze** to run the statement and see what really happened: actual rows next to the estimates, how many times each step ran, and the time each step took by itself. A bar shows each step's share of the total, and steps taking 30% or more turn red, so the slow part stands out. Row counts the planner got wrong by ten times or more are highlighted: that usually means stale statistics or a missing index. Because it runs the statement, Analyze only works for read queries.

**Raw** shows the plan exactly as the database returned it, for pasting into other tools.

Query plans are available on PostgreSQL, MySQL 8.0.16 and later (Analyze from 8.0.18), and SQLite. SQLite reports the plan's shape only, without estimates or timings.

## Scripts

An editor can be saved as a script with **Cmd+S** (**Ctrl+S** on Linux and Windows). Scripts live in `~/.dearsql/scripts` as ordinary `.sql` files — nothing proprietary, so you can keep them in a git repo or edit them elsewhere.

A saved script remembers the connection, database and schema it was written against, and reopens against the same place.

## Results

Results appear below the editor in the same grid used for browsing tables, so sorting, resizing and copying behave identically. Every executed query is added to **History**, the collapsible panel at the bottom of the sidebar, with its row count and duration.

## Assistant

Each editor also has its own AI chat panel for quick "write me this query" work, separate from the [assistant chat](/docs/ai-assistant) you open from a connection. Code blocks it produces have an **Insert** button that drops the SQL straight into the editor.
