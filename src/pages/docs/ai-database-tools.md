---
layout: ../../layouts/DocsLayout.astro
title: "Database tools"
description: "Let the agent list tables, run read-only queries, and open connections itself."
section: "AI assistant"
sectionOrder: 2
order: 3
---

By default, a coding agent in DearSQL can do more than read the context you pin — it can query your database directly. That's what turns "write me a query" into "look at the data and tell me why this is slow".

DearSQL does this by running a small [MCP](https://modelcontextprotocol.io) server on your machine and handing the agent its address when the session starts.

## The tools

| Tool | What it does |
|---|---|
| `list_databases` | Lists your saved connections and whether each is open |
| `connect_database` | Opens one of them by name |
| `list_tables` | Lists tables and views, with their columns |
| `run_query` | Runs a **read-only** SQL query and returns the rows |

You'll see each call appear in the transcript as it happens, and can expand it to read what came back.

## What's allowed

`run_query` only accepts read-only statements — `SELECT`, `SHOW`, `EXPLAIN`, `DESCRIBE`, `WITH`, `PRAGMA` and friends. Anything that writes is rejected before it reaches your database, including a write hidden after a semicolon:

```sql
SELECT 1; DROP TABLE users   -- rejected
```

Results are capped at 200 rows and about 60 KB, so a careless `SELECT *` on a huge table can't flood the conversation.

`connect_database` is the one tool that changes DearSQL itself. It opens a connection you've already saved — it can't invent new ones, and it can't change their settings.

## Turning it off

The gear icon opens **AI settings**, which has **Let the agent query my database**. It's on by default.

<img src="/docs/ai-settings.png" alt="The AI Settings dialog, with the API key, provider, and the agent access toggle" width="800" />

Turning it off stops the running agent and closes the port, so nothing is listening. The assistant still works — it just only knows what you tell it and what you pin with `@`.

Worth knowing when deciding:

- Query results are sent to whichever model provider your agent uses. Read-only still means the contents of those rows leave your machine.
- The server listens only on `127.0.0.1` and every request must carry a bearer token that's generated fresh for each session and shared only with the agent DearSQL launched.
- Letting the agent open connections means it can trigger the side effects of connecting, such as an SSH tunnel or a keychain prompt.

If you're working against production, it's reasonable to leave this off and pin schema by hand with `@`.
