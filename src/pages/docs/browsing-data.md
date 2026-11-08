---
layout: ../../layouts/DocsLayout.astro
title: "Browsing data"
description: "The sidebar tree, the table viewer, filtering, inline editing and the inspector panel."
section: "Getting started"
sectionOrder: 1
order: 2
---

The **Databases** tab in the sidebar is a tree. Expanding a connection opens it and loads what's inside — databases, then schemas where the engine has them, then tables, views and sequences. Everything loads in the background, so a server with hundreds of databases doesn't freeze the window.

Double-click a table to open it in a viewer tab.

<img src="/docs/sidebar-tree.png" alt="The Databases sidebar with a connection expanded into Tables, Views, Sequences and Queries" width="440" />

### Open Quickly

Press **⌘P** (**Ctrl+P** on Windows and Linux) and type part of a name to jump to a table or view without scrolling the tree. Matching forgives case, underscores and small typos, so `chlid` still finds `child`. Use ↑ and ↓ to pick a result, then press Enter to open it; Esc closes the list. Each result shows which connection, database and schema it belongs to.

It searches what the sidebar has already loaded, so expand a database first if its tables are missing.

<img src="/docs/open-quickly.png" alt="Open Quickly listing invoices and invoice_items for the typed text inv" width="440" />

## The grid

<img src="/docs/table-grid.png" alt="A table open in the grid, with the filter box above and paging controls below" width="800" />

The table viewer pages through data rather than loading everything: pick 10 to 500 rows per page at the bottom right, and move with the arrow buttons. The row count is the real total, not the size of the page.

**Data**, **JSON** and **Chart** at the bottom left switch between the grid, the page as a JSON array of objects, and a [chart](/docs/sql-editor#charts) of the page. In JSON, each row is an object: NULL as `null`, booleans as `true`/`false`, and numbers as numbers (values such as `007` stay strings). Select and copy from it like any text.

Click a column header to sort. Sorting is done by the database, so it applies across every page, not just the rows on screen.

`NULL` is shown distinctly from an empty string — worth knowing before you go hunting for a bug that isn't there. Booleans render as checkboxes.

## Filtering

The filter box takes a SQL `WHERE` expression, without the `WHERE`:

```sql
status = 'active' and created_at > '2024-01-01'
```

It autocompletes column names and SQL keywords as you type. Press Enter or click the magnifier to apply; the row count updates to match.

You can also right-click a cell and filter by its value, which appends the right condition — including `IS NULL` for null cells — instead of making you type it.

## Following foreign keys

Foreign-key columns are marked with a key icon in the header — hover it to see which table the column references — and their values are coloured like links.

Hover or select one of those cells and a small jump button appears at its right edge — click it and the referenced table opens in a new tab, filtered to the matching row. It's the quickest way to answer "which customer is this order for?" without writing a join. The same thing is on the right-click menu as **Go to *table***.

The entry only appears on columns that actually have a foreign key, and not on null cells. Foreign keys are read from the database on connect, so SQLite, DuckDB, PostgreSQL, MySQL, MariaDB and SQL Server all support it.

## Editing

Cells are editable in place. Edited cells are highlighted, and nothing is sent to the database until you save:

- **Save** (or **Cmd+S** / **Ctrl+S**) applies the changes
- **Reject** discards them
- **+** adds a row, and the clone button duplicates the selected one
- The bin marks selected rows for deletion

Saving opens a confirmation dialog containing the exact SQL DearSQL is about to run — `INSERT`s, `UPDATE`s and `DELETE`s, in order. **The SQL is editable**, so if a generated statement isn't what you want, fix it before it runs. Nothing executes until you press Execute.

### Delete preview

When the changes delete rows, the dialog also shows what that does to rows in other tables that point at them through foreign keys, counted on the database before anything runs:

- **Deleted too**: rows removed by `ON DELETE CASCADE`, followed down the chain (orders, then their order items), up to three levels deep.
- **Set to NULL** or **to its default**: rows whose reference is cleared by `ON DELETE SET NULL` or `SET DEFAULT`.
- **The delete will fail** (in red): rows still referencing them through a key with `RESTRICT` or `NO ACTION`, the default. Delete or repoint those first.

<img src="/docs/delete-preview.png" alt="The save dialog listing an invoice that blocks the delete, the orders and order items it cascades to, and reviews set to NULL" width="800" />

Counts deeper in a cascade say "up to", since a row reachable along two paths is counted on each. Only foreign keys in the same schema are followed. DearSQL turns on SQLite's foreign key enforcement (`PRAGMA foreign_keys`, off in SQLite itself) for every connection, so cascades and blocked deletes work as declared. If you turn it off with the pragma, the dialog says so and lists the rows that would be left pointing at deleted ones.

Statements are keyed on the table's primary key. For a table without one, DearSQL matches on all column values, which is safe but can match more than one row if you have exact duplicates.

On a [read-only connection](/docs/connections) none of this is available: cells can't be edited, the add, duplicate and delete buttons are disabled, and the toolbar shows a **Read-only** marker.

## Inspector

The strip on the right opens the inspector, which has three tabs:

- **Value** — the selected cell in a larger editor, for JSON, long text, or anything that doesn't fit a grid cell. Edit and Apply, or Revert.
- **Metadata** — the table's columns with their types, nullability and primary keys, filterable by name.
- **DDL** — the table's `CREATE TABLE` statement with its constraints and indexes, ready to copy. It is the server's own definition where it has one (`SHOW CREATE TABLE` on MySQL, `DBMS_METADATA` on Oracle, the stored SQL on SQLite and DuckDB, `DESCRIBE TABLE` on Cassandra 4+ and ScyllaDB, with the table's options and its indexes); PostgreSQL's is rebuilt from its catalog, including identity and generated columns, check constraints and comments. Views, MongoDB collections and Redis keys don't have one.

## Profiling a table

Right-click a table and choose **Profile Columns** to see what its data looks like: a SQL editor opens and runs one query that lists every column with its number of nulls, distinct values, smallest and largest value. It reads the first 100,000 rows (not a random sample), so it stays quick on big tables, and the query is right there to edit (a `WHERE`, or a bigger `LIMIT`). Columns whose type has no order (booleans, UUIDs, JSON) leave min and max empty.

## Reviewing indexes

Right-click a database (a schema on PostgreSQL and SQL Server) and choose **Review Indexes**. DearSQL reads the tables (the first 200) and opens a script listing foreign keys with no index, which make joins and deletes on the referenced table scan the whole child table, and indexes another index already covers, which cost every write for nothing. Each finding says when it is fine to leave it, followed by the `CREATE INDEX` or `DROP INDEX` to consider. Nothing runs: keep the statements you want and click Run. These are rule-based hints, so check how the table is actually queried first; on a big production table, prefer `CREATE INDEX CONCURRENTLY` (PostgreSQL) or an online DDL.

## Comparing two databases

Right-click a database (a schema on PostgreSQL and SQL Server) and choose **Compare Schema With**, then pick another open database of the same kind: your dev copy against production, or two schemas. DearSQL reads both and opens a script that would make the first one match the second: new tables first, then added, changed and dropped columns and indexes, dropped tables last, each with a comment saying what differs. Nothing runs until you click Run, so delete what you don't want first; drops lose data. Indexes count as the same when they cover the same columns, whatever their names. Views aren't compared, and where SQLite can't change a column in place the comment says so instead of a statement.

## CSV files

DearSQL opens CSV files in their own editor — **Open CSV File...** from the sidebar's context menu, then double-click the file. Edits are saved back in the file's own format, and DuckDB lets you filter and query it with SQL. See [CSV files](/docs/csv-files).
