---
layout: ../../layouts/DocsLayout.astro
title: "Import and export"
description: "SQL dumps for MySQL and PostgreSQL, plus CSV files."
section: "Data"
sectionOrder: 3
order: 1
---

## Exporting a table

Right-click a table and choose an export format:

<img src="/docs/table-menu.png" alt="A table's context menu with the Export submenu open on CSV, JSON and SQL" width="440" />

| Format | Good for |
|---|---|
| CSV | Spreadsheets, and anything that eats delimited text |
| JSON | Feeding an API or a script |
| SQL | `INSERT` statements to replay elsewhere |

## SQL dumps

MySQL and PostgreSQL databases can be dumped to, and restored from, plain SQL — from the database's context menu.

This runs **inside DearSQL**. You don't need `mysqldump`, `pg_dump` or a matching client version on your machine, which is usually the thing that makes dumps annoying.

The PostgreSQL exporter follows the same ordering `pg_dump` uses — schema first, then data, then constraints and indexes — so the output restores cleanly rather than tripping over foreign keys. Data is streamed with `COPY`, which is considerably faster than a file full of `INSERT`s.

A dump runs in the background with a progress panel and a **Cancel** button. While one is running, actions that would tear the connection out from under it — editing the connection, disconnecting, removing it — are disabled with a note explaining why.

Importing shows a preview of what the file contains before anything runs.

PostgreSQL additionally keeps the external **Backup** and **Restore** menus, which shell out to `pg_dump` and `pg_restore` if you'd rather use the real thing.

## CSV files

Open a CSV directly with **Open CSV File...** in the sidebar's context menu. DearSQL loads it through DuckDB, so the file behaves like a table: browse it, sort it, filter it, and run SQL against it.

Tables can also be **imported** from a CSV file, from the table's context menu.
