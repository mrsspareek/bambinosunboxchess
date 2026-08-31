# ♟️ Bambinos - Unbox Chess Platform

> **Project Master Summary & Architecture Overview**  
> *End-to-End Chess.com Clone & Interactive Learning Ecosystem for Bambinos*

---

## 🎯 Our Aim & Core Vision

The goal of **Bambinos - Unbox Chess** is to deliver a world-class, feature-complete chess learning and gaming platform available on both **Web** and **iOS Mobile Devices**. 

The platform combines the polished competitive UX of **Chess.com** with **Bambinos' proprietary teaching methodologies** (Zing platform slide decks, 48-session structured PDF curriculum, 5-mode interactive activities, live demo bookings, and course sales management).

### 🎨 Brand Identity
- **Theme Palette**: Clean White (`#FFFFFF`, `#F8FAFC`) with Bambinos Royal Blue (`#2563EB`, `#3B82F6`) primary accents.
- **Mascot Logo**: Official Bambinos 'b' mascot icon (`/public/logo.png`) featured across headers, sidebars, mobile navigation bars, and admin dashboards.

---

## 🚀 Complete Feature Breakdown (What We Have Done From Start)

### 1. 🏠 Chess.com-Style Home Hub (`/`)
- **Hero Animated Board Preview**: Real-time auto-playing move preview demonstrating opening lines (Italian Game & Scholar's Defense).
- **Quick Play Controls**: Time control selector (1 min Bullet, 3 min Blitz, 5 min Blitz, 10 min Rapid, 30 min Daily, Custom).
- **AI Bot Selection Modal**: Choose custom bot personalities & ratings (250 Beginner, 885 Tactical, 1200 Positional, 2200 Grandmaster).
- **Live Online Counter**: Displays active player count (`1,420 Players Online`). Minimum counter fallback displays at least `1 Player Online`.
- **Global Leaderboard**: Real-time standings for top GMs, puzzle masters, and Bambinos students.

---

### 2. ♟️ Live Play Arena & Matchmaking (`/play`)
- **Interactive 2D Board**: Supports piece drags, clicks, legal move dots, selected square highlights, and high-contrast piece styling.
- **Stockfish Engine Evaluation Bar**: Live vertical bar on the left of the board displaying real-time advantage (`+0.4`, `+1.8`, `-0.2`).
- **Web Audio API Sound Effects**: Synthesized audio for piece moves, captures, checks, and victory sounds.
- **Dynamic Bot Queue Fallback**: When a user clicks "Play Online" and no real player is available in queue, they are matched with a backend Bot seamlessly.
- **Bot Playstyle Variety**: Every bot game uses randomized opening books and playstyles so no two matches feel the same.
- **Algebraic Move History & Player Cards**: Live notation log (`1. e4 e5 2. Nf3 Nc6`) with timers, player ratings, win streaks, and action controls (Resign, Rematch, Game Review).

---

### 3. 🧩 Interactive Puzzles Studio (`/puzzles`)
- **Chess.com Style Solver**: FEN position setup, turn indicator ("White to move").
- **Coach Voice & Character Dialogue**: Interactive prompts ("Not every puzzle is about checkmate. Here, your goal is to capture my queen...").
- **Real-Time Score Gains**: Score popups (+30 Rating, +5 Speed, +5 Streak, score animation 326 -> 366 -> 437).
- **Victory & Milestone Popups**: "Solved! Wow! You're on fire!" status cards and level completion milestone badges ("You completed Level 4!").

---

### 4. 🎓 Learn & Live Demo Booking (`/learn`)
- **Zing Platform Integration**: Direct links and presentation deck preview cards connecting to Zing (`zing.bambinos.live`).
- **"Book a Live Demo for Chess" Modal**: Interactive booking form for parents/students to schedule a free 1-on-1 live trial class with Bambinos master coaches.

---

### 5. 📖 48-Session Detailed Curriculum (`/curriculum`)
- **Beginner Track (Ages 7–10 / Grades 2–5)**: Complete 48-session masterplan parsed directly from `Unbox_Chess_Curriculum_7-10_Detailed_50Min.pdf`.
- **Session Breakdowns**: Kid-friendly explanations, everyday analogies, target practical & execution outcomes, and 50-minute lesson step timelines for all 48 sessions.
- **Advanced Track**: Structured curriculum layout for advanced modules.

---

### 6. 🏋️ Tactics & Vision Drills (`/train`)
- **Coordinate Vision Trainer**: Board square spotter quiz (testing speed on e4, d4, c6, g5).
- **Pattern Drills**: King & Pawn opposition, Box shrinking, and London Pyramid setup drills.

---

### 7. 📺 Watch Chess TV & Streams (`/watch`)
- **Live GM Broadcasts**: Live viewer counter (`8,420 Watching`) and stream player preview.

---

### 8. 👥 Community & Clubs (`/community`)
- **Clubs & Forums**: Featured chess clubs and student discussion forums.

---

### 9. 📜 Game History & Review (`/history`)
- **Mobile Game History View**: Matches the mobile reference screenshot showing player streak (`4`), rating, opponent name & rating, win/loss status badges (`+`/`-`), accuracy % (`68.4%`), and Game Review star button.

---

### 10. 📱 iOS Mobile Bottom Navigation Bar (`MobileBottomNav.tsx`)
- **Exact iOS 5 Bottom Tabs**: Replaced "Watch" with **"Curriculum"**:
  1. ♟️ **Home / Play**
  2. 🧩 **Puzzles**
  3. 🎓 **Learn**
  4. 📖 **Curriculum**
  5. ☰ **More** (with notification badge `3`)

---

### 11. 🔒 Master Admin Portal (`/admin-portal`)
- **Separate Security Lock**: Dedicated portal protected server-side by an environment-configured admin access code and signed HTTP-only session cookie.
- **Financial Overview**: Total revenue stats (`$167,160`), enrolled students (`1,360`), puzzle counts, and live demo requests.
- **Course Selling & Pricing Manager**: Create & publish paid course packages (*Unbox Chess Beginner $199*, *1-on-1 Live Coaching $99*), set target age groups (7-10, 10+), and manage student enrollments.
- **48-Session Curriculum Manager**: Edit session plans, PDF slide deck links, analogies, and lesson step durations.
- **Zing Puzzle & 5-Mode Activity Studio**:
  - Position setup (FEN).
  - 5 interactive activity mode builders:
    1. 📝 *Multiple choice*
    2. ⌨️ *Fill in the blank*
    3. 🎯 *Click the square*
    4. 🧩 *Place the pieces*
    5. 🤖 *Play the bot*
  - Bulk FEN JSON puzzle importer.

---

## 💻 Technical Architecture & Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16.3 (App Router, React 18, TypeScript) |
| **Styling** | Tailwind CSS with custom Bambinos White & Blue color tokens |
| **Chess Engine** | Chess.js rule engine & FEN validator |
| **Sound Effects** | Web Audio API Synthesizer (Move, Capture, Check, Victory) |
| **State & Storage** | LocalStorage persistence for custom JSON puzzles & Zing activities |
| **Deployment** | Next.js Production Build (`npm run build`) |

---

## 🔗 Quick URL Route Summary

- ♟️ **Home Hub**: [http://localhost:3000/](http://localhost:3000/)
- ⚔️ **Live Play Arena**: [http://localhost:3000/play](http://localhost:3000/play)
- 🧩 **Puzzles Studio**: [http://localhost:3000/puzzles](http://localhost:3000/puzzles)
- 🎓 **Learn & Live Demo**: [http://localhost:3000/learn](http://localhost:3000/learn)
- 📖 **48-Session Curriculum**: [http://localhost:3000/curriculum](http://localhost:3000/curriculum)
- 🏋️ **Vision Trainer & Drills**: [http://localhost:3000/train](http://localhost:3000/train)
- 📺 **Watch TV Streams**: [http://localhost:3000/watch](http://localhost:3000/watch)
- 👥 **Community & Clubs**: [http://localhost:3000/community](http://localhost:3000/community)
- 📜 **Game History & Review**: [http://localhost:3000/history](http://localhost:3000/history)
- 🔒 **Master Admin Portal**: [http://localhost:3000/admin-portal](http://localhost:3000/admin-portal) *(server-protected; configure `ADMIN_ACCESS_CODE`)*
