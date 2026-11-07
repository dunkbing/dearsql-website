---
layout: ../../layouts/DocsLayout.astro
title: "S3 object storage"
description: "Browse buckets on Amazon S3, Cloudflare R2, MinIO, Wasabi, VersityGW and other S3-compatible services: upload, download, delete and share objects."
section: "Data"
sectionOrder: 3
order: 3
---

DearSQL connects to Amazon S3 and to any service that speaks the S3 API — Cloudflare R2, MinIO, Wasabi, VersityGW, Backblaze B2, DigitalOcean Spaces and others. Buckets show up in the sidebar next to your databases, and each one opens in a tab where you can browse folders and move files in and out.

<img src="/docs/s3-browser.png" alt="An S3 bucket open in DearSQL, with folders and files listed" width="800" />

## Connecting

Click **New Connection** and pick **S3 Storage** as the type.

- **Endpoint** — the host of the S3 API. Leave it empty for Amazon S3. For Cloudflare R2 it is `<account-id>.r2.cloudflarestorage.com`; for Wasabi, `s3.<region>.wasabisys.com`; for a local MinIO or VersityGW, `localhost` with its port. You can paste a full URL such as `https://…`, and DearSQL takes the host and protocol from it.
- **Port** and **Protocol** — 443 and HTTPS for hosted services; local servers usually run plain HTTP on their own port (MinIO uses 9000).
- **Region** — the bucket region, such as `eu-west-1`. Cloudflare R2 uses `auto`. Empty means `us-east-1`.
- **Access Key** and **Secret Key** — an access key pair with permission to list buckets. They are stored encrypted, like database passwords.

DearSQL lists your buckets to check the keys, so a key that is scoped to a single bucket and cannot list buckets will not connect. SSH tunnels are not offered for S3 connections.

## Buckets

Expand the connection in the sidebar to see its buckets. Double-click a bucket, or choose **Open** from its context menu, to browse it in a tab. Right-click the connection and choose **Create Bucket...** to make a new one; **Delete Bucket...** on a bucket removes it, which S3 only allows once the bucket is empty.

## Browsing

S3 has no real folders: keys such as `reports/2026/may.csv` are shown as a `reports` folder holding a `2026` folder. Double-click a folder to open it, and use the **↑** button or the path at the top of the tab to go back up. Folders come first, then files with their size and last-modified time. Large folders load 1,000 entries at a time; click **Load more** at the bottom of the list for the next page.

## Working with files

- **Upload** — the upload button puts a file from your computer into the folder you are looking at. Big files are sent in parts, so there is no 5 GB limit.
- **Download** — double-click a file, or right-click it and choose **Download...**, and pick where to save it.
- **Share** — **Copy Share Link** puts a signed link on the clipboard that anyone can open for 1 hour, 1 day or 7 days, without your keys.
- **Details** — the size, ETag, content type, version and any custom metadata of a file.
- **Delete** — deletes a file, or a whole folder and everything under it, after you confirm.

Uploads and downloads show their progress in the toolbar and can be cancelled. Only one operation runs at a time in each tab.
