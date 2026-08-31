# Deployment and Release Runbook

## Supported deployment shape

The application builds as a Next.js 14 Node.js service. The current durable-data adapter supports one application instance with one persistent encrypted volume. Use Node.js 22 LTS (required by the maintained Capacitor toolchain).

For a pilot deployment:

1. Provision a Linux Node.js service with HTTPS and a persistent disk.
2. Mount the disk and set `UNBOX_DATA_DIR` to that absolute path.
3. Copy `.env.example` into the host’s secret manager and set every required value.
4. Install exactly locked dependencies with `npm ci`.
5. Run `npm run build`.
6. Start with `npm run start` behind the provider’s TLS proxy.
7. Configure the health check as `GET /api/health`.
8. Confirm the proxy and server route gates redirect to `/admin-login` when no valid HTTP-only session exists.

For multi-instance or commercial scale, replace JSON repositories and all browser-local content stores with a managed transactional database and object storage before adding replicas.

## Required production variables

- `NEXT_PUBLIC_APP_URL`
- `ADMIN_ACCESS_CODE`
- `ADMIN_SESSION_SECRET`
- `UNBOX_DATA_DIR`
- `ZING_LAUNCH_SECRET` (the health gate requires this future-integration signing secret)
- Zing variables when the integration is activated

Secrets must be at least 32 random bytes where applicable. Keep separate values per environment and rotate them through the host secret manager.

## Release commands

PowerShell/Windows:

```powershell
npm.cmd ci
.\node_modules\.bin\tsc.cmd --noEmit
npm.cmd run build
npm.cmd run start
```

Linux/macOS:

```bash
npm ci
npx tsc --noEmit
npm run build
npm run start
```

## Health and rollback

- `/api/health` returns `200` only when required production configuration is present; it never exposes secret values.
- Preserve the previous deploy artifact for one-click rollback.
- Back up `UNBOX_DATA_DIR` before a schema or repository change.
- Never roll back data by replacing the persistent directory with a build artifact.

## Security baseline

- Admin routes are protected by the Next.js proxy plus server route gates and a signed, HTTP-only, `SameSite=Lax`, secure production cookie.
- Security headers include MIME sniffing protection, restrictive browser permissions, HSTS in production, and a frame-ancestor policy limited to self and Zing.
- Zing return URLs are HTTPS and origin allow-listed.
- Launch tokens are HMAC-signed, short-lived, and contain only opaque launch IDs.
- `.env` and `.data` are ignored by version control.

Add before a public commercial launch: distributed login rate limiting, organisation/role-based authorization, audit logs, managed backups, vulnerability scanning in CI, dependency update automation, error monitoring, uptime alerts, and a tested incident-response process.

## Child safety and privacy gate

This product targets minors. Before real student onboarding, obtain legal review for COPPA, GDPR-K, FERPA or local equivalents; publish guardian consent, privacy, retention, deletion, moderation, and safeguarding processes. Minimise personal data and never expose a child’s name or ID in a public URL.

## Capability truth table

| Area | Current release status | Production dependency still required |
| --- | --- | --- |
| Curriculum and guided puzzle UI | Deployable | Content owner sign-off and accessibility UAT |
| Local two-player and deterministic chess legality | Deployable | None for local play |
| Public online matchmaking | Demo simulation | Realtime authoritative game server, queues, anti-cheat |
| “Players online” counters | Demo display | Presence/analytics service |
| Bot move choice/evaluation | Demo heuristic | Stockfish worker/service for engine-strength claims |
| Courses, subscriptions, payments | UI prototype | Payment provider, entitlements, receipts, refund flow |
| Admin-created content | Browser-local prototype | Server database, validation, versioning, publish workflow |
| Student accounts and performance | Integration data model/scaffold | Identity provider, RBAC, managed database, teacher console |
| Community/forums | Static prototype | Moderated backend, reporting, safeguarding controls |
| Zing | Secure contract/scaffold only | Zing API access, identity mapping, data agreement, UAT |

Do not market demo simulations as live production services until the dependency in the final column is implemented and tested.
