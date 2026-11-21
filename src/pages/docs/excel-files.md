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

- The header is the first row that holds only text names and spans the columns below it, so a report title or notes above the table are skipped. When there is no such row, the columns are named by their letter (`B`, `C`, ...), like in Excel.
- Empty columns on the left and blank rows are left out.
- Each column gets a type from all of its cells: whole numbers are `INTEGER`, other numbers `REAL`, TRUE/FALSE `BOOLEAN`, dates `DATETIME` (shown as `2024-01-02` or `2024-01-02 10:30:00`), and a column that mixes kinds is `TEXT`.
- Formula cells show the value Excel saved with the file. Error cells such as `#N/A` read as empty (NULL) in a number or date column, so a single error doesn't turn the whole column into text.

Sheets work like any other table: browse them in the table viewer, and join them in the SQL editor:

```sql
SELECT c.city, SUM(o.total)
FROM "Orders" o JOIN "Customers" c ON c.name = o.customer
GROUP BY c.city;
```

## With AI agents

The assistant's [database tools](/docs/ai-database-tools), and coding agents through the [command line](/docs/command-line), work on workbooks too. An agent opens a `.xlsx` by its path and queries the sheets with SQL, and `describe_table` tells it how each sheet is laid out: which row holds the header, what stands above it, each column's letter, which columns are formulas and how many error cells they hold. So it can cite the cell a value came from and knows a total is a formula.

It can also make spreadsheets: `export_query` saves the rows of a query as a `.xlsx` file, from any connection, with numbers, dates and true/false as real cells. In the assistant chat you approve each file before it is written; in a terminal it's `dearsql export report.xlsx "SELECT ..."`. An existing file is only replaced when the agent says so.

A workbook opens read-only, and DearSQL never writes to it. It is loaded into memory when it opens, which takes a few seconds for a big one; workbooks over 20 MB are not opened yet.

## Import a sheet into a table

Right-click a table and choose **Import → Excel workbook**. DearSQL takes the sheet with the table's name (or the first sheet), matches its header to the table's columns by name and appends the rows. A row the database rejects is skipped and counted; the rest still go in.

## Export to Excel

Tables export from **Export → Excel workbook** on their context menu (several selected tables become one workbook, a sheet each), and query results from the **Excel** button under the results. See [Import and export](/docs/import-export).
