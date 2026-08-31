# Release QA Report

Date: **2026-08-31**  
Target: Bambinos Unbox Chess web production bundle  
Result: **PASS for the documented single-instance pilot deployment shape**

## Environment tested

- Windows development host
- Node.js `22.16.0`
- Next.js `16.3.3`
- React `18.3.1`
- TypeScript strict mode
- Optimized `next build` and `next start`

## Automated gates

| Gate | Result |
| --- | --- |
| `npm run lint` (`tsc --noEmit`) | Pass |
| Clean production build | Pass |
| Full runtime + development dependency audit | Pass — 0 vulnerabilities |
| Required deployment artifacts | Pass |
| Full curriculum source count | Pass — exactly 48 sessions |
| Production configuration health endpoint | Pass — `200 ready` with required variables |

Re-run the release gates on Windows with:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\release-qa.ps1
```

## Runtime route smoke tests

All routes were exercised against the optimized production server:

| Route/behaviour | Result |
| --- | --- |
| `/` | 200 |
| `/curriculum` and full 48-session experience marker | 200, verified |
| `/puzzles` | 200 |
| `/play` | 200 |
| `/learn` | 200 |
| `/community` | 200 |
| `/history` | 200 |
| `/train` | 200 |
| `/watch` | 200 |
| `/admin-login` | 200 |
| `/zing/launch` without a token | Safe invalid-link screen, no result recorded |
| Anonymous `/admin-portal` | 307 redirect to secure login |
| Incorrect admin access code | 401 |
| Correct admin access code | 200 and signed session issued |
| Authenticated `/admin-portal` | 200 |
| `/api/health` with production variables | 200 `ready` |

## Security assertions

- Admin enforcement exists in both the Next.js proxy and server-rendered route layouts.
- Admin session cookie was verified as `Secure` and `HttpOnly`.
- HMAC-tamper-resistant, expiring session and Zing launch token implementations type-check and build.
- Zing return URLs require HTTPS and an allowed origin.
- Security response headers were verified at runtime: CSP frame ancestors, HSTS, MIME sniffing protection, referrer policy, and restricted browser permissions.
- `.env`, runtime `.data`, build output, dependency folders, and TypeScript caches are excluded from version control.
- Runtime and build-tool dependency audits both report zero known vulnerabilities after upgrading Next.js and Capacitor.

## Curriculum/content assertions

- The release curriculum contains 48 consecutively numbered sessions.
- Every session includes a title, class type, two topics, core concept, child-friendly analogy, practical and execution outcomes, and a five-step 50-minute plan.
- The Zing screenshot’s “Guided Puzzle 1: Piece Coordinates” position is represented in the future integration catalog.

## Release boundary

The web application is deployable for a single-instance pilot with the configuration and persistent volume in `DEPLOYMENT.md`. The following visible areas remain prototypes until their named backends exist:

- internet matchmaking and presence counters;
- authoritative Stockfish evaluation/anti-cheat;
- payments and subscription entitlements;
- server-published admin content (current custom content uses browser storage);
- student identity/RBAC and managed performance database;
- moderated community services;
- live Zing identity/API connection.

These are recorded as explicit production dependencies, not silently treated as complete. Do not publicly market them as live services before their backend, privacy, observability, and failure-path acceptance tests pass.

## Manual checks still required before real students

- Chrome, Edge, Safari, iPad, and target iPhone visual/accessibility testing
- Keyboard-only puzzle and navigation testing
- Screen-reader labels and focus-order review
- Real-device sound/autoplay behaviour
- Load test using the intended concurrent-class target
- Backup/restore drill for `UNBOX_DATA_DIR`
- Child-safety, privacy, consent, retention, and deletion legal approval
- Content-owner review of all 48 lesson plans
- Zing UAT listed in `ZING_INTEGRATION_GUIDE.md`
