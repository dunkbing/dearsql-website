---
layout: ../../layouts/DocsLayout.astro
title: "Connections"
description: "Connect to SQLite, DuckDB, PostgreSQL, MySQL, MongoDB, Redis and more, over SSL or an SSH tunnel."
section: "Getting started"
sectionOrder: 1
order: 1
---

Right-click the sidebar and choose **Add Database Connection**, or use the **+** in the title bar.

<img src="/docs/connection-dialog.png" alt="The connection dialog on PostgreSQL, showing host, port, SSL mode and the SSH tunnel toggle" width="800" />

## Supported databases

| Engine | Notes |
|---|---|
| SQLite | Single file; pick it with the file browser |
| DuckDB | Single file, and the engine behind CSV support |
| PostgreSQL | Databases and schemas |
| Redshift | Uses the PostgreSQL backend |
| MySQL / MariaDB | One backend covers both |
| TiDB | Uses the MySQL backend; port 4000 |
| CockroachDB | Uses the PostgreSQL backend; port 26257, database `defaultdb` (Backup/Restore through `pg_dump` is not offered) |
| MongoDB | Collections instead of tables |
| Redis | Keys, with a command console and pub/sub |
| SQL Server | Databases and schemas |
| Oracle | Downloads the Instant Client on first use if it's missing |
| Cassandra | Keyspaces |
| ScyllaDB | Uses the Cassandra backend; port 9042, keyspaces. New keyspaces use `NetworkTopologyStrategy` with one replica, which ScyllaDB's tablets require |

File-based databases only need a path. Server databases take the usual host, port, user, password and database.

## Connecting

Connections are lazy: adding one saves it, and expanding it in the sidebar is what actually connects. If a connection fails, the error from the driver is shown in place under the node rather than in a dialog you have to dismiss.

**Refresh** on a connection reconnects and reloads its schema. **Disconnect** closes it without removing it.

## Read-only connections

Tick **Read-only connection** in the dialog to stop the app writing to that database. It applies to every engine, including SQLite and DuckDB files, and is remembered with the connection. The [database tools](/docs/ai-database-tools) respect it too: an agent can't change a read-only connection, even with your approval.

With it on:

- The SQL editor runs `SELECT`, `SHOW`, `EXPLAIN`, `DESCRIBE`, `WITH` and `PRAGMA`, and refuses anything else with an explanation instead of executing it.
- Table data can't be edited, and the add, duplicate and delete row buttons are disabled.

This guards against slips — a stray edit in the grid, a `DELETE` you meant to run somewhere else. It is not a security boundary: it stops DearSQL from issuing the statement, but it doesn't change what your database user is allowed to do. For a real guarantee on production, connect as a user with only `SELECT` granted.

## SSL / TLS

Every server backend supports encryption, with the modes that engine actually offers:

| Backend | Modes |
|---|---|
| PostgreSQL, CockroachDB | disable, allow, prefer, require, verify-ca, verify-full |
| MySQL / MariaDB / TiDB | disable, prefer, require, verify-ca, verify-full |
| SQL Server | Off, Encrypt, Encrypt + Verify, Strict |
| MongoDB, Redis | Off, TLS, TLS + Verify CA |
| Cassandra, ScyllaDB | Off, TLS, TLS + Verify CA, TLS + Verify Host |

The default is `prefer` where the engine has one — encrypted if the server supports it, without failing if it doesn't. Choosing `verify-ca` or `verify-full` reveals a field for your CA certificate.

On SQL Server, Encrypt encrypts the connection without checking who is on the other end. Encrypt + Verify also checks the server's certificate and that it was issued for the host you typed, against the CA certificate you give or, if you leave that empty, the ones your system trusts; a self-signed server certificate is refused unless you point at it. Strict is the newer TDS 8.0 encryption (SQL Server 2022 and Azure SQL) with the same checks.

On Cassandra and ScyllaDB, TLS encrypts without checking the server, and TLS + Verify CA checks its certificate against the CA file you give. That file is required: the Cassandra driver doesn't read the certificates your system trusts. TLS + Verify Host also checks that each node's certificate was issued for that node. The driver talks to every node in the cluster by IP address, so with an IP as the host each certificate must list its node's IP; with a hostname, each node's IP is looked up in reverse DNS and the certificate must carry that name. Through an SSH tunnel the node is reached as 127.0.0.1, so use TLS + Verify CA there. Managed services such as ScyllaDB Cloud and DataStax Astra need TLS on.

## SSH tunnels

Any server connection can be routed through a bastion host. Enable **SSH tunnel** in the connection dialog and give the host, port and user; DearSQL forwards a local port and connects the database through it.

Authenticate with a **password** or a **private key** (with a passphrase if it has one). The host field autocompletes from your `~/.ssh/config`, so an alias you already use will work.

DearSQL opens the tunnel itself, so it works the same on macOS, Windows, Linux and iPad, with no `ssh` program needed. Host aliases from your `~/.ssh/config` resolve to their HostName, Port, User and IdentityFile. The server's key is checked against your `~/.ssh/known_hosts`: a new server is added on first connect, and a server whose key changed is refused. Jump hosts (`ProxyJump`) and ssh-agent aren't supported; give the key file instead. The tunnel opens when the connection opens and closes with it.

## How credentials are stored

Saved connections live in `~/.dearsql/connections.db`. Passwords — for both the database and SSH — are encrypted with AES-256-GCM using a key derived from a per-install secret. By default that secret lives in `~/.dearsql/master.key`, a file only your user can read. To keep it in your operating system's keystore instead (Keychain on macOS, Credential Manager on Windows, Secret Service on Linux), turn on **Settings → Security → Keep the encryption key in the Keychain**; DearSQL moves the key there and deletes the file, and turning it off moves it back. The keystore may ask for permission when DearSQL reads the key.

DearSQL never writes credentials to disk in plain text, and the encrypted values are useless without the key.
