---
layout: ../../layouts/DocsLayout.astro
title: "Command line"
description: "Run DearSQL from a terminal: open the app, browse in a terminal UI, give your coding agent database tools, or get SQL completion in your editor."
section: "Getting started"
sectionOrder: 1
order: 4
---

DearSQL is one program with several ways in:

| Command | What it does |
|---|---|
| `dearsql` | Opens the app |
| `dearsql my.db` | Opens the app with that file |
| `dearsql --tui` | Browse and query in the terminal |
| `dearsql --mcp` | Gives a coding agent your database tools |
| `dearsql --lsp` | SQL completion and hover in your editor |

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
- **F4 SQL** is a query editor. **F5** runs it against the database you last opened. **Ctrl+Space** shows completions for keywords, tables and columns, the same ones the app suggests; the list also opens by itself after a `.`, so `u.` after `FROM users u` lists the columns of `users`. While the list is open, **↑**/**↓** pick an entry, **Tab** or **Enter** inserts it, and **Esc** closes it.

**Tab** switches between the panes (when no completion list is open), and **q** quits.

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

## SQL completion in your editor

`dearsql --lsp` is a [language server](https://microsoft.github.io/language-server-protocol/) for `.sql` files. Point your editor at it and you get the same schema-aware completion as the app's [SQL editor](/docs/sql-editor#writing) — tables, columns, aliases, CTEs — against your saved connections, plus hover: a table shows its columns, a column shows its type, whether it allows `NULL`, whether it is a primary key, and the table a foreign key points to. Tables and columns in the completion list carry the same details.

Completion pops up as you type and after a `.`, so `u.` after `FROM users u` lists the columns of `users`.

### Choosing the database

The server needs to know which database a file is written against. It takes the first of these that is set:

1. A comment on the first line of the file, which lets each file pick its own:

```sql
-- dearsql: Production/shop
select * from orders where ...
```

2. A connection picked while the server runs with the `switchConnections` or `switchDatabase` command (below).
3. A connection named on the command line: `dearsql --lsp "Production"`.
4. `initializationOptions` from the editor config: `{ "connection": "Production", "database": "shop" }`.

The comment always wins, so one file can point somewhere else than the rest of the project.

The part after the `/` is the database and can be left out. For PostgreSQL and SQL Server it can also name a schema, as in `Production/shop.sales`. A relative file path in the comment is read from the file's folder. Like `--tui`, a connection can be a saved connection's name, a connection URL, or the path of a SQLite, DuckDB or CSV file. Passwords and SSH tunnels come from the app, so anything that connects there connects here too.

The schema is read once and kept for two minutes, so a table you just created shows up after that. If the connection fails, the editor shows a warning once and completion falls back to SQL keywords. The server logs to stderr, which most editors put in their LSP log.

### Switching connections

The server answers the same `workspace/executeCommand` commands as [sqls](https://github.com/sqls-server/sqls), so editor plugins and key bindings made for it work here too:

| Command | Argument | What it does |
|---|---|---|
| `showConnections` | — | Lists your connections, one per line, with `*` after the current one |
| `switchConnections` | a connection name, URL or file, or its number from `showConnections` | Uses that connection from now on |
| `showDatabases` | — | Lists the databases on the current connection |
| `switchDatabase` | a database name (`shop`, or `shop.sales` for a schema) | Uses that database on the current connection |
| `showTables` | — | Lists the tables and views completion knows about |

A switch lasts until the server stops. It replaces the command-line connection and `initializationOptions`, but a file with a `-- dearsql:` comment still uses its own.

In Neovim 0.11, for example: `:lua vim.lsp.get_clients({ name = 'dearsql' })[1]:exec_cmd({ title = '', command = 'switchConnections', arguments = { 'Staging' } })`.

### Coming from sqls or sql-language-server

There is no separate config file: connections are the ones saved in the app, with their passwords and SSH tunnels.

- sqls `config.yml` `connections`: save each one in the app (or pass a URL), then use `connection` in `initializationOptions` or the command line. The first entry being the default becomes `dearsql --lsp "<name>"`.
- sql-language-server `.sqllsrc.json` (a project's `connection`): use a `-- dearsql:` comment in the files instead, or `initializationOptions` in the project's editor config. Its `switchDataBaseConnection` command is `switchConnections` here.


### Neovim (0.11+)

```lua
vim.lsp.config('dearsql', {
  cmd = { 'dearsql', '--lsp' },
  filetypes = { 'sql' },
  init_options = { connection = 'Production', database = 'shop' },
})
vim.lsp.enable('dearsql')
```

Neovim does not show completion as you type on its own; use a completion plugin, or turn on the built-in one when the server attaches:

```lua
vim.api.nvim_create_autocmd('LspAttach', {
  callback = function(args)
    vim.lsp.completion.enable(true, args.data.client_id, args.buf, { autotrigger = true })
  end,
})
```

**K** shows the hover.

### Helix

In `~/.config/helix/languages.toml`:

```toml
[language-server.dearsql]
command = "dearsql"
args = ["--lsp"]
config = { connection = "Production", database = "shop" }

[[language]]
name = "sql"
language-servers = ["dearsql"]
```

Helix sends `config` as the `initializationOptions`.

### VS Code

VS Code needs an extension to run a language server it does not know. With [Generic LSP Client](https://github.com/llllvvuu/vscode-glspc) installed, add to `settings.json`:

```json
{
  "glspc.serverCommand": "dearsql",
  "glspc.serverCommandArguments": ["--lsp"],
  "glspc.languageId": "sql",
  "glspc.initializationOptions": { "connection": "Production", "database": "shop" }
}
```

### Emacs (eglot)

```elisp
(with-eval-after-load 'eglot
  (add-to-list 'eglot-server-programs
               '(sql-mode . ("dearsql" "--lsp"
                             :initializationOptions (:connection "Production" :database "shop")))))
```

Then **M-x eglot** in a SQL buffer, or add `eglot-ensure` to `sql-mode-hook`.

### Zed

Zed only starts language servers that an extension registers, so `dearsql --lsp` cannot be added from `settings.json` alone yet.
