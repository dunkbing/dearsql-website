---
layout: ../../layouts/DocsLayout.astro
title: "Excel files"
description: "Open Excel workbooks and query their sheets with SQL, import a sheet into a table, and export tables and results to .xlsx."
section: "Data"
sectionOrder: 3
order: 3
---

DearSQL reads and writes Excel workbooks (`.xlsx`). Formulas, charts and pivot tables are left to Excel: DearSQL works with the data in the sheets.

## Open a workbook

Choose **Open Excel File...** from the sidebar's context menu, drop a `.xlsx` on the window, or open one from the command line (`dearsql query -c book.xlsx "select ..."`). The workbook shows up in the sidebar as a connection, and each sheet is a table.

- The first row is the header when every cell in it holds text; otherwise the columns are named `A`, `B`, `C`, like in Excel.
- Each column gets a type from all of its cells: whole numbers are `INTEGER`, other numbers `REAL`, TRUE/FALSE `BOOLEAN`, dates `DATETIME` (shown as `2024-01-02` or `2024-01-02 10:30:00`), and a column that mixes kinds is `TEXT`.
- Formula cells show the value Excel saved with the file.

Sheets work like any other table: browse them in the table viewer, and join them in the SQL editor:

```sql
SELECT c.city, SUM(o.total)
FROM "Orders" o JOIN "Customers" c ON c.name = o.customer
GROUP BY c.city;
```

The AI assistant's database tools see the sheets too.

A workbook opens read-only, and DearSQL never writes to it. It is loaded into memory when it opens, which takes a few seconds for a big one; workbooks over 20 MB are not opened yet.

## Import a sheet into a table

Right-click a table and choose **Import → Excel workbook**. DearSQL takes the sheet with the table's name (or the first sheet), matches its header to the table's columns by name and appends the rows. A row the database rejects is skipped and counted; the rest still go in.

## Export to Excel

Tables export from **Export → Excel workbook** on their context menu (several selected tables become one workbook, a sheet each), and query results from the **Excel** button under the results. See [Import and export](/docs/import-export).
