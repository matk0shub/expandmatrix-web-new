# Single-Server Deployment Guide

This document outlines a pragmatic way to host the Expand Matrix marketing site and the embedded Payload CMS **from a single server**. The goal is to keep deployment simple while retaining observability, backups, and disaster recovery paths.

## 1. Prerequisites

- Linux host (Ubuntu 22.04+ recommended) with at least 2 vCPU / 4 GB RAM.
- Node.js 20 LTS.
- MongoDB 7 running either on the same host or an external managed instance.
- Reverse proxy (NGINX or Traefik) terminating TLS; the application itself serves HTTP on an internal port (default 3000).
- Redis (optional) if you plan to introduce caching or rate limiting later.

## 2. File Layout on the Server

```
/opt/expandmatrix/
├── current -> /opt/expandmatrix/releases/20250206-1200/
├── releases/
│   └── 20250206-1200/         # unpacked git checkout with built assets
└── shared/
    ├── env/                   # environment files
    ├── logs/
    ├── media/                 # Payload file uploads
    └── node_modules/          # optional cache when deploying via rsync
```

The `media/` directory should be shared between releases so uploads created through Payload remain available after deploys. When deploying via Netlify/GitHub (no persistent disk), commit the relevant files under `media/` so each build ships the latest uploads.

## 3. Preparing Environment Variables

Create `/opt/expandmatrix/shared/env/.env.production`:

```ini
NODE_ENV=production
PAYLOAD_SECRET=generate-a-long-random-string
DATABASE_URI=mongodb://localhost:27017/expandmatrix?replicaSet=rs0
# Optional: override the auto-detected host serving Payload media.
NEXT_PUBLIC_PAYLOAD_SERVER_URL=https://cms.expandmatrix.com
PAYLOAD_PUBLIC_SERVER_URL=https://cms.expandmatrix.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@expandmatrix.com
SMTP_PASS=app-password-or-token
SMTP_FROM_NAME=Expand Matrix
```

Load this file before running any Payload CLI commands (`payload migrate`, seeders, etc.).

## 4. Build & Release Script (run inside the repo checkout)

```bash
#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/opt/expandmatrix
RELEASE_DIR="$APP_DIR/releases/$(date '+%Y%m%d-%H%M')"

git clone https://github.com/expandmatrix/expandmatrix-web-new.git "$RELEASE_DIR"
cd "$RELEASE_DIR"
npm ci --omit=dev
NODE_ENV=production npm run build

ln -sfn "$RELEASE_DIR" "$APP_DIR/current"
```

This script produces a fully built release and refreshes the `current` symlink for zero-downtime reloads. You can add a post-build hook to copy `shared/media` into `current/media` if you keep uploads outside the repository.

## 5. Systemd Service (Next.js + Payload)

`/etc/systemd/system/expandmatrix.service`:

```ini
[Unit]
Description=Expand Matrix Web + Payload
After=network.target mongod.service
Requires=network.target

[Service]
Type=simple
Environment=NODE_ENV=production
EnvironmentFile=/opt/expandmatrix/shared/env/.env.production
WorkingDirectory=/opt/expandmatrix/current
ExecStart=/usr/bin/npm run start -- --port 3000
Restart=on-failure
RestartSec=5
User=www-data
Group=www-data
StandardOutput=append:/opt/expandmatrix/shared/logs/app.out.log
StandardError=append:/opt/expandmatrix/shared/logs/app.err.log

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now expandmatrix.service
```

Payload mounts automatically on `/admin` as part of the Next.js app, so no additional process is required.

## 6. Reverse Proxy Snippet (NGINX)

```
server {
  listen 80;
  server_name expandmatrix.com www.expandmatrix.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_read_timeout 60s;
  }
}
```

Use certbot or your preferred ACME client to secure the site with HTTPS.

## 7. Database & Backups

- For self-hosted Mongo, initialize the replica set by running the existing `docker/mongo/init-replica.js` script so Payload can create transactions.
- Schedule daily `mongodump` exports. Store them off-server.
- Snapshot the `/opt/expandmatrix/shared/media` directory alongside the database dumps.

## 8. Deployment Workflow

1. Run seeders/migrations on the new release:
   ```bash
   cd /opt/expandmatrix/current
   . /opt/expandmatrix/shared/env/.env.production
   npm run payload:migrate
   npm run payload:seed   # optional
   # or ./scripts/post-deploy.sh /opt/expandmatrix/shared/env/.env.production
   ```
2. Reload the service:
   ```bash
   sudo systemctl restart expandmatrix.service
   ```
3. Tail logs:
   ```bash
   journalctl -u expandmatrix.service -f
   ```

## 9. Next Steps

- Add synthetic monitoring (Healthchecks.io, UptimeRobot, etc.) against `https://expandmatrix.com/api/payload/health`.
- Configure log rotation for `/opt/expandmatrix/shared/logs`. A simple `/etc/logrotate.d/expandmatrix` entry works:
  ```
  /opt/expandmatrix/shared/logs/*.log {
    daily
    rotate 14
    compress
    missingok
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
      systemctl kill -s HUP expandmatrix.service
    endscript
  }
  ```
- When scaling becomes necessary, split Mongo to a managed cluster and front the app with a load balancer + horizontal replicas.

## 10. Official References

- Next.js self-hosting guide: [https://nextjs.org/docs/app/building-your-application/deploying#self-hosting](https://nextjs.org/docs/app/building-your-application/deploying#self-hosting)
- Payload + Next.js production guidance: [https://payloadcms.com/docs/production/deployment#nextjs](https://payloadcms.com/docs/production/deployment#nextjs)

This setup keeps Next.js and Payload co-located, minimizes moving parts, and stays close to how the development environment already behaves.
