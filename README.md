# 🏆 Bambinos Unbox Chess - Interactive Student & Admin Portal

A modern, high-converting interactive chess learning platform built for **Bambinos Unbox Chess**, featuring live matches, daily tactical challenges with **Coach Zaid**, 3-level practice studios, a WhatsApp OTP onboarding gate, and a unified Admin Management & Analytics suite.

---

## 🌟 Key Features

### 🎓 1. Single Webpage Student Experience
- **Play Arena (Top)**:
  - Small, continuously animated chessboard cycling through grandmaster openings (Italian & Scholar's).
  - Quick time controls: 1 min, 3 min, 5 min, 10 min, 30 min, Custom.
  - 2-Player Pass & Play, Invite a Friend (with direct shareable link), and AI Bot opponents.
  - Top-Left Live Stats: Total Games Played, Win/Loss/Draw counter, and interactive **Game History Modal**.
- **Daily Tactical Challenge by Coach Zaid (Middle)**:
  - Extra-large interactive chessboard (`size="xl"`).
  - Auto-updates daily via `/api/puzzles/daily`.
  - Coach Zaid dialogue guidance card, tactical forcing move hints, victory celebrations, and daily streak 🔥 bonuses.
- **Extra Practice Puzzles Studio (Bottom)**:
  - 3 progressive tiers: 🟢 Level 1: Beginner, 🟡 Level 2: Intermediate, 🔴 Level 3: Advanced.
  - Includes interactive board solvers, tactical objectives, and guided multiple-choice questions.
  - **Free Tier Lock**: Locked for free users with a high-converting **"Book Free Demo"** CTA and Subscribed Student Login.

### 🔐 2. Dual-Access Authentication & Gate
- **Free Tier Sign-Up (Pre-Portal Gate)**:
  - Collects Student Name, Age Group (5-6 yrs, 7-10 yrs, 11-14 yrs, 15+ yrs), City/Place, and WhatsApp Number.
  - Instant 4-digit simulated WhatsApp OTP verification.
  - Unlocks Play Arena, Daily Puzzles, and auto-logs registration into Admin Analytics.
- **Subscribed Student Login**:
  - Direct 1-click login with **Student ID** (e.g. `ZAID-2026`, `BAM-101`) or registered phone.
  - Immediately unlocks all Level 2 & 3 practice packs and curriculum.
- **Log Out**:
  - Located on the top navbar next to the user profile badge for seamless profile switching.

### 🎯 3. High-Attention Demo Booking CTAs
- **Book a Free 1-on-1 Demo with Coach Zaid**:
  - Integrated across top header ribbon, Daily Puzzle coach card, locked practice packs, and paywall modals.
  - Includes date/time slot picker, parent WhatsApp contact capture, and instant WhatsApp confirmation preview.

### 🛠️ 4. Unified Admin Management & Analytics Portal (`/admin-portal`)
- **Theme**: Clean, bright white & slate palette matching the student portal (`bg-slate-50`, `bg-white border border-slate-200`).
- **⚡ Easy 1-Click Puzzle Creator**:
  - Tactical presets (*Scholar's Mate Defense*, *Royal Knight Fork*, *Morphy's Pin*, *Greek Gift*).
  - Visual FEN and solution move selector with instant publish to Level 1, 2, or 3.
- **📊 Visitor & WhatsApp Sign-up Analytics**:
  - Real-time Active Visitors counter, Daily Puzzles Solved, and Demo Inquiries.
  - Live table of WhatsApp OTP verified student sign-ups (Name, Phone, Age, City, Verification Time).
- **🌟 Daily Puzzle Live Manager**:
  - Live editor for `/api/puzzles/daily` with custom FEN, themes, and Coach Zaid prompts.
- **📁 Bulk JSON Importer**:
  - 1-click import for external JSON puzzle datasets.

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js**: `v18.x` or `v20.x`
- **npm** or **yarn** / **pnpm**

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Access Admin Portal
- Navigate to: [http://localhost:3000/admin-portal](http://localhost:3000/admin-portal)
- Access Passcode: `admin123`

---

## 📦 Production Build & Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
1. Push this repository to GitHub / GitLab.
2. Import the project in [Vercel](https://vercel.com).
3. Vercel will automatically detect Next.js and deploy.

### Mobile App Export (Capacitor iOS & Android)
```bash
# Build web assets
npm run build

# Sync & open iOS in Xcode
npm run ios:sync
npm run ios:open

# Sync & open Android in Android Studio
npm run android:sync
npm run android:open
```

---

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx               # Single scrollable webpage (Play Arena, Daily Puzzle, Practice)
│   │   ├── admin-portal/page.tsx  # Unified Admin Portal (Creator, Analytics, Daily Manager)
│   │   ├── admin-login/page.tsx   # Admin Passcode authentication
│   │   ├── api/
│   │   │   ├── puzzles/daily/     # Rotating Daily Puzzle REST API
│   │   │   └── admin/session/     # Admin session verification
│   │   ├── globals.css            # Global styling & Tailwind directives
│   │   └── layout.tsx             # Root Layout with Demo Banner
│   ├── components/
│   │   ├── Chessboard.tsx         # Responsive interactive Chessboard (sm, md, lg, xl sizes)
│   │   ├── FreeSignUpModal.tsx    # WhatsApp OTP Free Sign-up & Subscribed Student Login
│   │   ├── BookDemoModal.tsx      # 1-on-1 Grandmaster Demo Booking modal
│   │   ├── BookDemoBanner.tsx     # Top floating demo announcement ribbon
│   │   └── SubscriptionPaywallModal.tsx # Free tier locked feature paywall with Demo CTA
│   ├── lib/
│   │   ├── puzzleStore.ts         # Level 1-3 Puzzles catalog, tracker stats, custom puzzles
│   │   ├── sound.ts               # Audio sound effects for chess moves & victories
│   │   └── server/jsonStore.ts    # JSON storage engine for persistent daily puzzles
│   └── types/
│       └── chess.ts               # Core TypeScript definitions (Puzzle, GameHistory, Annotation)
├── public/
│   ├── logo2.png                  # Bambinos brand logo
│   └── sounds/                    # Audio assets (move, check, win)
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 📄 License
© 2026 Bambinos.live. All rights reserved.
