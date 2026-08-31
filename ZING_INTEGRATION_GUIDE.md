# Future Zing → Unbox Chess Integration

Status: **contract and secure launch scaffold are ready; the live Zing account is intentionally not connected yet.**

This guide describes how the Zing lesson should open one exact Unbox Chess puzzle after a lesson slide, record the child’s work, show the result to the teacher in Unbox Chess, and optionally return the child to Zing.

## 1. Target student journey

1. A teacher starts the normal lesson in Zing.
2. The teacher presents the “Guided Puzzle 1: Piece Coordinates” teaching slide.
3. The next Zing slide contains a single **Open interactive puzzle** button.
4. Zing requests a short-lived launch link from the Unbox Chess server for each student.
5. The link opens `/zing/launch?token=...` in a new tab or full-screen web view.
6. Unbox Chess validates the signed token and opens only the assigned puzzle. The standard play/community navigation is covered by the focused activity screen.
7. Unbox Chess records start, completion, accuracy, mistakes, hints, score, and time.
8. The completion screen returns the child to the allow-listed Zing lesson URL. Teachers view performance in Unbox Chess; a webhook can also send the result to Zing later.

Do not use one shared public puzzle URL for a whole class. It cannot identify the student or assignment safely. Generate one short-lived link per student.

## 2. What is already implemented

- Published integration puzzle catalog: `src/lib/zingPuzzleCatalog.ts`
- Exact lesson puzzle: `guided-puzzle-1-piece-coordinates`
- Server-to-server launch endpoint: `POST /api/integrations/zing/launch-link`
- Focused student launch route: `GET /zing/launch?token=...`
- Attempt ingestion and teacher/API read endpoint: `/api/integrations/zing/attempts`
- Signed four-hour launch tokens containing only opaque IDs (no child name in the URL)
- Allow-listed HTTPS return URLs
- Idempotent attempt completion per launch token
- Optional signed completion webhook to Zing
- File repositories isolated behind server modules so they can later be replaced by PostgreSQL without changing the client contract

The teacher reporting UI is a future phase. The attempt API and data model are ready for it.

## 3. Zing change required

Ask the Zing engineering/product team for these two capabilities:

1. An external action/button component in a slide that can open a per-student URL.
2. A server-side hook that can request the URL using the authenticated Zing student, teacher, class, deck, and live-session IDs.

If Zing only supports a normal hyperlink, the teacher can use a pre-generated link, but each student still needs a unique link delivered through the class roster/chat. A presentation-wide link is acceptable only for a non-tracked public practice activity.

Prefer a new tab or full-screen web view. Use an iframe only after testing Zing’s iframe sandbox, cookie policy, mobile sizing, and accessibility. The platform’s CSP currently permits framing by `https://zing.bambinos.live` for future testing.

## 4. Create a launch link

This call must be made from Zing’s backend. Never expose `ZING_API_KEY` in slide JavaScript or a browser bundle.

```http
POST https://chess.example.com/api/integrations/zing/launch-link
Content-Type: application/json
X-Zing-Api-Key: <server-secret>

{
  "teacherId": "zing-teacher-42",
  "studentId": "zing-student-1088",
  "studentName": "Student display name",
  "classId": "class-7a",
  "assignmentId": "unbox-s1-guided-puzzle-1",
  "puzzleId": "guided-puzzle-1-piece-coordinates",
  "zingDeckId": "216967",
  "zingSessionId": "live-session-abc",
  "returnUrl": "https://zing.bambinos.live/present/216967"
}
```

Successful response:

```json
{
  "launchUrl": "https://chess.example.com/zing/launch?token=<opaque-signed-token>",
  "launchId": "<uuid>",
  "expiresAt": "<ISO-8601 timestamp>",
  "puzzle": { "id": "guided-puzzle-1-piece-coordinates" }
}
```

The launch URL expires after four hours. Create a new link for a retry, a new class, or another student.

## 5. Result contract

The platform stores these teacher-facing fields:

| Field | Meaning |
| --- | --- |
| `assignmentId` | Stable lesson/assignment identifier |
| `studentId`, `studentName` | Zing roster mapping and display name |
| `puzzleId`, `puzzleTitle` | Exact activity completed |
| `status` | `started` or `completed` |
| `score`, `accuracy` | Server-calculated performance |
| `correctAnswers`, `totalQuestions` | Progress evidence |
| `mistakes`, `hintsUsed` | Intervention signals |
| `durationSeconds` | Active attempt duration |
| `startedAt`, `completedAt` | ISO-8601 timestamps |
| `syncStatus` | Result webhook delivery state |

An authenticated teacher session or `X-Zing-Api-Key` can read attempts:

```http
GET /api/integrations/zing/attempts?teacherId=zing-teacher-42
X-Zing-Api-Key: <server-secret>
```

## 6. Optional completion webhook

Set `ZING_RESULTS_WEBHOOK_URL` and `ZING_WEBHOOK_SECRET`. Unbox Chess sends:

- Event: `unbox_chess.puzzle.completed`
- Header: `X-Unbox-Event: unbox_chess.puzzle.completed`
- Header: `X-Unbox-Signature: sha256=<hex HMAC-SHA256 of the raw body>`
- JSON fields: attempt, assignment, student, puzzle, score, accuracy, mistakes, hints, and duration

Zing must verify the HMAC against the raw request body before accepting the event. Its handler should be idempotent on `attemptId` and return a `2xx` response only after durable storage.

## 7. Environment configuration

Copy `.env.example` and configure:

- `NEXT_PUBLIC_APP_URL`
- `ZING_API_KEY`
- `ZING_LAUNCH_SECRET`
- `ZING_ALLOWED_RETURN_ORIGINS`
- `UNBOX_DATA_DIR`
- Optional webhook variables

Rotate secrets before production, store them in the hosting provider’s secret manager, and never commit `.env` files.

## 8. Production data decision

The current repository uses atomic JSON files under `UNBOX_DATA_DIR`. This is suitable for a controlled pilot on **one Node.js instance with one encrypted persistent disk**.

Before horizontal scaling, replace `launchRepository.ts` and `attemptRepository.ts` with PostgreSQL (or another transactional managed database). Add unique indexes for launch ID and attempt ID, encryption at rest, daily backups, retention/deletion policies for minors’ data, and an audit log for teacher access. Do not run multiple application replicas against the JSON repository.

## 9. Zing integration acceptance tests

- A valid student link opens only its assigned puzzle.
- A modified token is rejected and records no result.
- An expired token shows the expiry screen and records no result.
- A return URL outside the allow-list is rejected at link creation.
- Student names and IDs do not appear inside the URL token payload.
- Start is recorded once; duplicate completion calls do not duplicate results.
- Score, accuracy, mistakes, hints, and duration match the completed attempt.
- The completion button returns to the correct Zing deck.
- Webhook signature verification passes; a tampered body fails.
- A teacher can view only the students/classes allowed by the organisation’s authorization policy.

## 10. Information needed from Zing before go-live

- Official API documentation and authentication method
- Roster identifiers and tenant/organisation identifier
- External-link or embedded-app restrictions
- Completion webhook/API format and retry rules
- Live-session and deck identifiers
- FERPA/COPPA/GDPR data-processing responsibilities, retention, deletion, and parent-consent requirements

Do not connect production student accounts until the identity mapping, tenancy authorization, child-data agreement, and deletion workflow are approved.
