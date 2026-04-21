---
layout: ../../layouts/BlogPostLayout.astro
title: "Connecting to PostgreSQL from C++ with libpq"
description: "How DearSQL talks to PostgreSQL in a few hundred lines of C++ — connection string, PQsendQuery, and a tiny RAII wrapper."
pubDate: "2026-04-21"
---

DearSQL is a native SQL client written in C++20. For PostgreSQL we use `libpq` directly — no ORM, no wrapper library. libpq is small, stable, and gives us control over multi-statement results and cancellation. Here's the short version of what our Postgres backend actually does.

## Install

```bash
# macOS
brew install libpq
# Debian/Ubuntu
sudo apt install libpq-dev
# vcpkg
vcpkg install libpq
```

In CMake:

```cmake
find_package(PostgreSQL REQUIRED)
target_link_libraries(my_app PRIVATE PostgreSQL::PostgreSQL)
```

## Build a connection string

libpq accepts a keyword string. Build it piece by piece so empty fields are easy to skip:

```cpp
std::string buildConnStr(const ConnInfo& i) {
    std::string s = "host=" + i.host +
                    " port=" + std::to_string(i.port) +
                    " connect_timeout=10" +
                    " dbname=" + (i.database.empty() ? "postgres" : i.database);
    if (!i.username.empty()) s += " user=" + i.username;
    if (!i.password.empty()) s += " password=" + i.password;
    s += " sslmode=" + i.sslmode;  // disable | prefer | require | verify-ca | verify-full
    return s;
}
```

Always set `connect_timeout` — otherwise a blackholed host hangs for minutes.

## Open the connection

```cpp
PGconn* conn = PQconnectdb(connStr.c_str());
if (PQstatus(conn) != CONNECTION_OK) {
    std::string err = PQerrorMessage(conn);
    PQfinish(conn);  // free the handle even on failure
    throw std::runtime_error("Postgres connection failed: " + err);
}
```

`PQconnectdb` always returns a non-null handle. A failed connection still needs `PQfinish`.

## Run a query

`PQexec` only returns the last statement's result. For a SQL editor that accepts scripts, use the async API and drain results one at a time:

```cpp
if (!PQsendQuery(conn, sql.c_str())) {
    // error — use PQerrorMessage(conn)
}
while (PGresult* raw = PQgetResult(conn)) {
    PgResultPtr res(raw);              // unique_ptr with PQclear deleter
    results.push_back(extractResult(res.get()));
}
```

## Extract rows

```cpp
StatementResult extractResult(PGresult* res) {
    StatementResult r;
    switch (PQresultStatus(res)) {
    case PGRES_TUPLES_OK: {
        int nCols = PQnfields(res), nRows = PQntuples(res);
        for (int c = 0; c < nCols; ++c)
            r.columnNames.emplace_back(PQfname(res, c));
        for (int row = 0; row < nRows; ++row) {
            std::vector<std::string> cells;
            for (int c = 0; c < nCols; ++c) {
                cells.emplace_back(PQgetisnull(res, row, c)
                    ? "NULL" : PQgetvalue(res, row, c));
            }
            r.rows.push_back(std::move(cells));
        }
        break;
    }
    case PGRES_COMMAND_OK:
        r.message = "OK";
        break;
    default:
        r.success = false;
        r.errorMessage = PQresultErrorMessage(res);
    }
    return r;
}
```

Two gotchas: text-mode results are all `char*` (pass `resultFormat=1` to `PQexecParams` for binary), and `PQgetisnull` is the only way to tell `NULL` apart from an empty string.

## Clean up

```cpp
PQfinish(conn);
```

## What DearSQL adds on top

Beyond this core, the real backend:

- Wraps connections in a templated `ConnectionPool<PGconn*>` with RAII `Session` handles — callers can't forget to return a connection.
- Uses `PQexecParams` with `$1`, `$2` placeholders for anything user-supplied.
- Supports `PQcancel` for a responsive "cancel query" button.
- Tunnels through SSH by spawning the system `ssh -L` and pointing libpq at `127.0.0.1`.

If you want the full version, it lives in [`dearsql/src/database/postgres/`](https://github.com/dunkbing/dearsql/tree/main/src/database/postgres) — a few hundred lines of plain C++20.
