---
layout: ../../layouts/BlogPostLayout.astro
title: "Connecting to MySQL from C++ with libmysqlclient"
description: "How DearSQL talks to MySQL and MariaDB in a few hundred lines of C++ — mysql_real_connect, multi-statement queries, and fetching rows."
pubDate: "2026-04-22"
---

DearSQL uses the MariaDB Connector/C (drop-in for `libmysqlclient`) to talk to both MySQL and MariaDB. Same C API, works against either server. Here's the short version of the client path.

## Install

```bash
# macOS
brew install mariadb-connector-c
# Debian/Ubuntu
sudo apt install libmariadb-dev
# vcpkg
vcpkg install libmariadb
```

In CMake:

```cmake
find_package(unofficial-libmariadb CONFIG REQUIRED)
target_link_libraries(my_app PRIVATE unofficial::libmariadb)
```

## Open the connection

Unlike libpq, MySQL has no connection string — you pass fields as arguments. Allocate the handle, set options, then connect:

```cpp
#include <mysql.h>

MYSQL* openConnection(const ConnInfo& i) {
    MYSQL* conn = mysql_init(nullptr);
    if (!conn) throw std::runtime_error("mysql_init failed");

    unsigned int timeout = 5;
    mysql_options(conn, MYSQL_OPT_CONNECT_TIMEOUT, &timeout);

    // enable multi-statement support for SQL scripts
    unsigned long flags = CLIENT_MULTI_STATEMENTS;

    if (!mysql_real_connect(conn, i.host.c_str(), i.username.c_str(),
                            i.password.c_str(), i.database.c_str(),
                            i.port, nullptr, flags)) {
        std::string err = mysql_error(conn);
        mysql_close(conn);
        throw std::runtime_error("MySQL connection failed: " + err);
    }

    mysql_set_character_set(conn, "utf8mb4");  // default is latin1 on older servers
    return conn;
}
```

Two things worth setting on every connection:

- `MYSQL_OPT_CONNECT_TIMEOUT` — otherwise a blackholed host hangs for minutes.
- `utf8mb4` — `latin1` is still the default on some installs and silently mangles emoji and non-Latin text.

## TLS

Same `mysql_options` API, different flags. For the common modes:

```cpp
my_bool enforce = 1;
mysql_options(conn, MYSQL_OPT_SSL_ENFORCE, &enforce);   // require TLS

my_bool verify = 1;
mysql_options(conn, MYSQL_OPT_SSL_VERIFY_SERVER_CERT, &verify);  // verify-full

mysql_options(conn, MYSQL_OPT_SSL_CA, "/path/to/ca.pem");  // verify-ca / verify-full
```

## Run a query

`mysql_query` sends the SQL. With `CLIENT_MULTI_STATEMENTS` enabled, walk the result chain with `mysql_next_result`:

```cpp
if (mysql_query(conn, sql.c_str()) != 0) {
    // error — use mysql_error(conn)
}

do {
    results.push_back(extractResult(conn, rowLimit));
} while (mysql_next_result(conn) == 0);
```

## Fetch rows

`mysql_store_result` buffers the whole result set on the client. For a SQL client that's fine; for streaming large tables, use `mysql_use_result` instead.

```cpp
struct MysqlResDeleter {
    void operator()(MYSQL_RES* r) const noexcept { if (r) mysql_free_result(r); }
};
using MysqlResPtr = std::unique_ptr<MYSQL_RES, MysqlResDeleter>;

StatementResult extractResult(MYSQL* conn, int rowLimit) {
    StatementResult r;
    MYSQL_RES* raw = mysql_store_result(conn);

    if (raw) {
        MysqlResPtr res(raw);
        unsigned int nCols = mysql_num_fields(res.get());
        MYSQL_FIELD* fields = mysql_fetch_fields(res.get());
        for (unsigned int i = 0; i < nCols; ++i)
            r.columnNames.emplace_back(fields[i].name);

        int count = 0;
        MYSQL_ROW row;
        while ((row = mysql_fetch_row(res.get())) && count < rowLimit) {
            unsigned long* lens = mysql_fetch_lengths(res.get());
            std::vector<std::string> cells;
            cells.reserve(nCols);
            for (unsigned int i = 0; i < nCols; ++i) {
                cells.emplace_back(row[i] ? std::string(row[i], lens[i]) : "NULL");
            }
            r.rows.push_back(std::move(cells));
            ++count;
        }
    } else if (mysql_field_count(conn) == 0) {
        // DML/DDL — no result set
        r.message = std::to_string(mysql_affected_rows(conn)) + " row(s) affected";
    } else {
        r.success = false;
        r.errorMessage = mysql_error(conn);
    }
    return r;
}
```

A few gotchas:

- `MYSQL_ROW` is a `char**`. A `nullptr` element means SQL NULL — and unlike libpq, a row cell can contain embedded NUL bytes, so always pass the length from `mysql_fetch_lengths` when building the string.
- `mysql_store_result` returning null is ambiguous: could be a DML statement, could be an error. Check `mysql_field_count(conn) == 0` to tell them apart.
- After consuming one result set in a multi-statement query, you *must* call `mysql_next_result` even if you don't care about the next one — otherwise the connection is left in a bad state.

## Clean up

```cpp
mysql_close(conn);
```

## What DearSQL adds on top

The production path adds a few things on top of this core:

- Wraps connections in a templated `ConnectionPool<MYSQL*>` with `mysql_ping` as the validator — stale connections get transparently reconnected.
- Handles `CR_SERVER_GONE_ERROR` / `CR_SERVER_LOST` specifically for "MySQL server has gone away" after an idle timeout.
- Uses prepared statements (`mysql_stmt_prepare` + `mysql_stmt_bind_param`) for anything user-supplied.
- Picks MySQL- or MariaDB-specific system schemas to hide based on server version.

Full source at [`dearsql/src/database/mysql/`](https://github.com/dunkbing/dearsql/tree/main/src/database/mysql) — plain C++20, same shape as the Postgres backend.
