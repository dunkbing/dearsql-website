---
layout: ../../layouts/DocsLayout.astro
title: "Database tools"
description: "Let the agent search your schema, run read-only queries, and open connections itself."
section: "AI assistant"
sectionOrder: 2
order: 3
---

By default, a coding agent in DearSQL can do more than read the context you pin — it can query your database directly. That's what turns "write me a query" into "look at the data and tell me why this is slow".

DearSQL does this by running a small [MCP](https://modelcontextprotocol.io) server on your machine and handing the agent its address when the session starts.

## The tools

| Tool | What it does |
|---|---|
| `search_schema` | Finds tables, views and columns by name. Forgiving: `user id`, `userId` and a typo like `usres` all find `users.user_id` |
| `describe_table` | Shows one table's columns, types, keys, indexes and which tables point at it |
| `run_query` | Runs a **read-only** query and returns the rows |
| `list_tables` | Lists every table and view with its size |
| `list_connections` | Lists your saved connections, which are open, and the databases on them |
| `connect` | Opens one of your saved connections by name |

The agent works on whatever you've selected in the sidebar unless it names another connection or database. It's told to look names up with `search_schema` and `describe_table` before writing SQL, so it doesn't guess column names, and when a query still trips over a misspelled table it gets back "did you mean …" suggestions instead of a bare error.

You'll see each call appear in the transcript as it happens, and can expand it to read what came back.

## What's allowed

`run_query` only accepts read-only statements — `SELECT`, `SHOW`, `EXPLAIN`, `DESCRIBE`, `WITH`, `PRAGMA` and friends. Anything that writes is rejected before it reaches your database, including a write hidden after a semicolon:

```sql
SELECT 1; DROP TABLE users   -- rejected
```

On Redis it accepts read commands (`GET`, `HGETALL`, `SCAN`, `INFO` …), and on MongoDB read commands such as `find`, `aggregate` and `countDocuments` — but not a pipeline that writes with `$out` or `$merge`.

Results come back 50 rows at a time. If there are more, the agent can ask for the next page without re-running the query; a single query stops at 1,000 rows, so a careless `SELECT *` on a huge table can't flood the conversation.

`connect` is the one tool that changes DearSQL itself, and naming a closed connection in any other tool opens it the same way. It only opens connections you've already saved — it can't invent new ones, and it can't change their settings.

## Turning it off

The gear icon opens **AI settings**, which has **Let the agent query my database**. It's on by default.

<img src="/docs/ai-settings.png" alt="The AI Settings dialog, with the API key, provider, and the agent access toggle" width="800" />

Turning it off stops the running agent and closes the port, so nothing is listening. The assistant still works — it just only knows what you tell it and what you pin with `@`.

Worth knowing when deciding:

- Query results are sent to whichever model provider your agent uses. Read-only still means the contents of those rows leave your machine.
- The server listens only on `127.0.0.1` and every request must carry a bearer token that's generated fresh for each session and shared only with the agent DearSQL launched.
- Letting the agent open connections means it can trigger the side effects of connecting, such as an SSH tunnel or a keychain prompt.

If you're working against production, it's reasonable to leave this off and pin schema by hand with `@`.
