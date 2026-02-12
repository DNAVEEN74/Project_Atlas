# Project Atlas (PrepLeague) — Complete Documentation

> **Version:** 1.0
> **Last Updated:** 2026-02-10
> **Platform:** Competitive Exam Preparation (SSC CGL)
> **Status:** Pre-launch (Desktop-first, mobile planned post-launch)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Directory Structure](#3-directory-structure)
4. [Database Design & Schemas](#4-database-design--schemas)
5. [Authentication & Security](#5-authentication--security)
6. [API Reference](#6-api-reference)
7. [Frontend Pages & Features](#7-frontend-pages--features)
8. [Core Features — Detailed Flows](#8-core-features--detailed-flows)
9. [Games System](#9-games-system)
10. [Admin System](#10-admin-system)
11. [Deployment & Infrastructure](#11-deployment--infrastructure)
12. [Known Issues & Pending Work](#12-known-issues--pending-work)

---

## 1. Project Overview

**Project Atlas** (branded as **PrepLeague**) is a full-stack competitive exam preparation platform built for SSC CGL aspirants. The platform offers:

- **PYQ Practice**: Previous Year Questions from SSC CGL (2018-2024) across Quantitative Aptitude and Reasoning
- **Sprint Mode**: Timed, configurable practice sessions with difficulty-based time limits
- **Quick Practice**: Daily goal-based practice aligned with user-configured targets
- **26 Mini-Games**: Speed drills for mental math and reasoning (16 Quant + 10 Reasoning)
- **Analytics Dashboard**: 365-day heatmap, accuracy tracking, streak system, topic-wise breakdown
- **Bookmarking & Reporting**: Save questions for review, report incorrect content
- **Admin Review**: Question verification pipeline for imported PYQs

**Current Exam Support:** SSC CGL only. Other exams (Bank PO, etc.) are planned for future releases. During registration, if a user selects an unsupported exam, an **Exam Request Modal** captures their interest for prioritization.

**User Tiers:**
- **Freemium**: Free access (feature gating TBD)
- **Premium**: Paid subscription (pricing decided — INR 200/mo, 700/6mo, 1200/yr — but payment integration not yet implemented)

---

## 2. Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js (App Router) | 16.1.1 | Framework, SSR, routing |
| React | 19.2.3 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.4.17 | Utility-first styling |
| Framer Motion | 12.29.0 | Animations & transitions |
| React Query | 5.90.16 | Server state management |
| Zustand | 5.0.9 | Client state management |
| Zod | 4.3.2 | Data validation |
| KaTeX | 0.16.27 | Mathematical formula rendering |
| Lucide React | 0.562.0 | Icon library |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| MongoDB | 9.1.1 | Database (via Mongoose ODM) |
| JWT (jsonwebtoken) | 9.0.3 | Authentication tokens |
| bcryptjs | 3.0.3 | Password hashing |
| AWS SDK S3 | 3.958.0 | Cloudflare R2 object storage |
| Tesseract.js | 7.0.0 | OCR (admin-only, question extraction) |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Application hosting & deployment |
| MongoDB Atlas | Cloud database |
| Cloudflare R2 | Image/asset storage (S3-compatible) |

---

## 3. Directory Structure

```
Project_Atlas/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── page.tsx                # Landing page
│   │   ├── layout.tsx              # Root layout
│   │   ├── login/                  # Login page
│   │   ├── register/               # Registration page (exam + goals)
│   │   ├── pricing/                # Pricing plans page
│   │   ├── dashboard/              # User dashboard
│   │   ├── problems/               # Question browser & practice
│   │   │   ├── page.tsx            # Filterable question list
│   │   │   └── [id]/              # Individual question view
│   │   │       ├── page.tsx        # Server component (SEO + data)
│   │   │       └── ProblemClient.tsx # Interactive client component
│   │   ├── sprint/                 # Sprint (timed practice)
│   │   │   ├── page.tsx            # Sprint configuration/setup
│   │   │   ├── session/            # (Deprecated — redirects to /sprint)
│   │   │   ├── summary/            # Post-sprint results
│   │   │   ├── history/            # Sprint history list
│   │   │   └── [id]/review/        # Question-by-question review
│   │   ├── games/                  # Mini-games hub
│   │   │   ├── page.tsx            # Games dashboard + grid
│   │   │   ├── [gameId]/           # Individual game page
│   │   │   └── history/            # Game play history
│   │   ├── bookmarks/              # Bookmarked questions
│   │   ├── submissions/            # Attempt history
│   │   ├── admin/review/           # Admin question review
│   │   ├── _providers/             # React context providers
│   │   └── api/                    # API routes (see Section 6)
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   │   ├── button.tsx, card.tsx, badge.tsx
│   │   │   ├── CircularProgress.tsx
│   │   │   ├── CustomSelect.tsx
│   │   │   ├── MathText.tsx        # KaTeX renderer
│   │   │   ├── QuestionContent.tsx
│   │   │   ├── ReportModal.tsx     # Question report modal
│   │   │   ├── ExamRequestModal.tsx
│   │   │   └── OCRModal.tsx        # OCR text extraction (admin)
│   │   ├── layout/Header.tsx       # Navigation header
│   │   ├── auth/AuthActionGuard.tsx
│   │   ├── games/
│   │   │   ├── games-config.tsx    # All 26 game definitions
│   │   │   └── GameModal.tsx       # Game player modal
│   │   └── icons.tsx               # Icon exports
│   ├── contexts/
│   │   ├── AuthContext.tsx          # Auth state (login/register/logout)
│   │   └── ToastContext.tsx         # Toast notifications
│   ├── core/
│   │   ├── db/connect.ts           # MongoDB connection
│   │   ├── models/                 # Mongoose schemas (see Section 4)
│   │   └── theme/                  # Theme configuration
│   ├── lib/
│   │   ├── auth.ts                 # JWT, bcrypt, cookie utilities
│   │   ├── streak.ts               # Streak validation logic
│   │   ├── r2.ts                   # Cloudflare R2 upload/delete
│   │   └── utils.ts                # cn() — class merging utility
│   └── middleware.ts               # Rate limiting + route protection
├── scripts/                        # Data import & extraction scripts
├── docs/                           # Documentation
├── public/                         # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 4. Database Design & Schemas

The platform uses **MongoDB** with **Mongoose ODM**. There are **9 collections** (8 existing + 1 new Report collection).

### 4.1 Entity Relationship Overview

```
User ─────────┬──────── Attempt ──────── Question
              │              │                │
              │              │                ├── Pattern
              │              │                │
              ├──────── Session (Sprint/QuickPractice)
              │
              ├──────── Bookmark ──────── Question
              │
              ├──────── GameScore
              │
              ├──────── DailyActivity
              │
              └──────── Report ───────── Question
```

### 4.2 User Collection

Stores all registered users with their profiles, preferences, stats, and roles.

```typescript
// Collection: users
// File: src/core/models/User.ts

interface IUser {
    email: string;                    // unique, indexed, lowercase, trimmed
    password_hash: string;            // bcrypt with 12 salt rounds

    profile: {
        name: string;                 // display name
        username: string;             // unique, indexed, auto-generated from email
        avatar_url?: string;          // Cloudflare R2 URL
    };

    target_exam: 'SSC_CGL';          // enum — expandable for future exams

    config: {
        is_premium: boolean;          // default: false
    };

    preferences: {
        daily_goal: number;           // range: 5-100, default: 5
        // NOTE: Currently a single field. Needs to be split into:
        //   daily_quant_goal: number
        //   daily_reasoning_goal: number
        // Frontend registration already sends separate values but
        // the backend only stores one unified number.
    };

    stats: {
        total_solved: number;         // unique questions solved correctly
        total_correct: number;        // total correct attempts (includes re-attempts)
        current_streak: number;       // consecutive active days
        max_streak: number;           // highest streak achieved (auto-tracked)
        last_active_date: string;     // "YYYY-MM-DD" — updated on attempt
    };

    role: 'USER' | 'ADMIN';          // default: USER
    created_at: Date;
    updated_at: Date;
}

// Indexes:
// - email: unique
// - profile.username: unique
```

**Key Behaviors:**
- `total_solved` increments only on the **first correct** attempt of a question (re-attempts on the same question do not increment it)
- `total_correct` increments on **every** correct attempt (including re-attempts)
- `current_streak` increments when a user attempts a question and their `last_active_date` was yesterday
- `max_streak` is automatically updated whenever `current_streak` exceeds it
- Streak resets to 0 if there's a 2+ day gap (validated on login and profile fetch)
- Username is auto-generated during registration: `emailPrefix` + random 4-digit suffix

---

### 4.3 Question Collection

Stores all exam questions (PYQs). Only questions with `is_live: true` are visible to users.

```typescript
// Collection: questions
// File: src/core/models/Question.ts

interface IQuestion {
    text: string;                     // question content (may contain [IMAGE] placeholder)
    image?: string;                   // R2 URL for question image
    options: Array<{
        id: string;                   // "A", "B", "C", or "D"
        text: string;                 // option text
        image?: string;               // R2 URL for option image
    }>;
    correct_option: string;           // "A" | "B" | "C" | "D"
    solution?: string;                // detailed solution/explanation

    subject: 'QUANT' | 'REASONING';  // section
    pattern: string;                  // topic slug: "percentage", "profit_loss", etc.
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';

    source: {
        exam: string;                 // "SSC CGL 2024"
        year: number;                 // 2018-2024
        shift: string;                // "Tier 1 - 09.09.2024 Shift 1"
    };

    stats: {                          // crowd-sourced, updated periodically
        attempt_count: number;        // total attempts by all users
        accuracy_rate: number;        // 0.0 to 1.0
        avg_time_ms: number;          // average solve time
    };

    is_live: boolean;                 // default: false — only true after admin review
    needs_review: boolean;            // default: true — flagged for admin attention
    created_at: Date;
}

// Indexes:
// - { is_live, subject, pattern, difficulty }    — browse/filter query
// - { is_live, 'source.year': -1 }              — year filter
// - { needs_review, is_live }                    — admin review queue
// - pattern: indexed                             — topic lookup
```

**Key Behaviors:**
- Questions are imported via Python/TS scripts with `is_live: false` and `needs_review: true`
- Admin reviews each question, adds missing images, then sets `is_live: true`
- All questions are PYQs from SSC CGL (2018-2024); no custom questions
- The `[IMAGE]` placeholder in `text` tells the frontend to render the image inline
- Every question has at least some text content (never image-only)
- `pattern` maps to `Pattern.code` for display name resolution
- `stats` are denormalized and updated via aggregation pipelines

**PENDING: `question_number` field needs to be added** — a global sequential number across all questions for URL-based navigation instead of MongoDB ObjectIds.

---

### 4.4 Attempt Collection

Records every answer submission by every user. Denormalizes question metadata to avoid joins in analytics queries.

```typescript
// Collection: attempts
// File: src/core/models/Attempt.ts

interface IAttempt {
    user_id: ObjectId;                // ref: User, indexed
    question_id: ObjectId;            // ref: Question, indexed
    session_id?: ObjectId;            // ref: Session — null for individual attempts

    selected_option: string;          // "A" | "B" | "C" | "D"
    is_correct: boolean;
    time_ms: number;                  // time taken to answer

    // Denormalized from Question (avoids joins on analytics queries)
    subject: 'QUANT' | 'REASONING';
    pattern: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';

    created_at: Date;
}

// Indexes:
// - { user_id, created_at: -1 }             — submission history
// - { user_id, question_id }                — check if user solved a question
// - { user_id, pattern, is_correct }        — topic-wise accuracy analysis
// - { user_id, subject, is_correct }        — subject-wise split analysis
// - { question_id, is_correct }             — crowd stats per question
// - { session_id }                          — sprint/session results lookup
```

**Key Behaviors:**
- Users can re-attempt the same question multiple times
- Each attempt is a separate record (no upsert)
- On each attempt creation, the system also:
  - Updates `DailyActivity` (increment `questions_solved`, `questions_correct`, `quant_solved`/`reasoning_solved`)
  - Updates `User.stats` (streak, `total_solved` on first correct, `total_correct` always)
  - Updates `Session` if `session_id` is provided (adds to `attempt_ids`, increments `correct_count`)
- Denormalized `subject`, `pattern`, `difficulty` are copied from the Question at the time of attempt

---

### 4.5 Session Collection

Tracks timed practice sessions (Sprints and Quick Practice).

```typescript
// Collection: sessions
// File: src/core/models/Session.ts

interface ISession {
    user_id: ObjectId;                // ref: User
    type: 'SPRINT' | 'QUICK_PRACTICE';

    config: {
        subject: 'QUANT' | 'REASONING';
        patterns: string[];           // selected topics
        difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'MIXED';
        question_count: number;       // 5, 10, 15, or 20
        time_limit_ms: number;        // total allowed time
    };

    question_ids: ObjectId[];         // randomly selected at session start
    attempt_ids: ObjectId[];          // populated as user answers questions
    correct_count: number;            // running tally
    total_time_ms: number;            // cumulative time spent

    status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
    current_index: number;            // for browser-close resumption

    created_at: Date;
    completed_at?: Date;
}

// Indexes:
// - { user_id, created_at: -1 }     — session history
```

**Sprint vs Quick Practice:**

| Aspect | Sprint | Quick Practice |
|---|---|---|
| **Purpose** | Timed exam simulation | Meet daily question target |
| **Timer** | Per-question + total countdown | No timer |
| **Config** | User picks subject, topics, difficulty, count | Based on user's daily goal target |
| **Question Count** | 5, 10, 15, or 20 | User's daily goal number |
| **Time Limits** | EASY: 40s/q, MEDIUM: 30s/q, HARD: 25s/q | No time limit |
| **Placement** | `/sprint` page | Dashboard (planned) |
| **Resumption** | Yes, via `current_index` + sessionStorage | Yes, can continue/finish anytime |

---

### 4.6 Pattern Collection

Lookup table mapping pattern codes (technical slugs) to display names. Used for topic filtering in the UI.

```typescript
// Collection: patterns
// File: src/core/models/Pattern.ts

interface IPattern {
    code: string;                     // unique slug: "percentage", "profit_loss"
    name: string;                     // display name: "Percentage", "Profit & Loss"
    subject: 'QUANT' | 'REASONING';  // patterns are exclusive to one subject
    question_count: number;           // denormalized, updated on import
}

// Indexes:
// - code: unique
```

**Key Behaviors:**
- A pattern belongs to exactly one subject — never shared across QUANT and REASONING
- `code` is stored in `Question.pattern` and `Attempt.pattern`
- `name` is used as the display label (called "topic" in the UI)
- `question_count` is updated when new questions are imported

**Topics by Subject:**

**QUANT (Quantitative Aptitude):**
| Group | Topics |
|---|---|
| Arithmetic | Percentage, Profit & Loss, Simple Interest, Compound Interest, Ratio & Proportion, Average, Mixture & Alligation, Partnership |
| Time & Work | Time & Work, Pipes & Cisterns |
| Speed & Distance | Speed Distance & Time, Boat & Stream |
| Number System | Number System, LCM & HCF, Simplification, Surds & Indices |
| Algebra & Trigonometry | Algebra, Trigonometry, Heights & Distances |
| Geometry & Mensuration | Geometry Lines & Angles, Geometry Triangles, Geometry Circles, Mensuration |
| Data | Data Interpretation |

**REASONING:**
| Group | Topics |
|---|---|
| Verbal | Analogy, Classification, Series, Coding-Decoding, Order & Ranking |
| Logical | Blood Relation, Direction Sense, Syllogism, Venn Diagram, Statement & Conclusion, Logical Sequence |
| Non-Verbal | Mirror Image, Water Image, Paper Folding, Embedded Figures, Figure Counting, Pattern Completion, Dice & Cubes |
| Analytical | Mathematical Operations |

---

### 4.7 Bookmark Collection

Allows users to save questions for later review.

```typescript
// Collection: bookmarks
// File: src/core/models/Bookmark.ts

interface IBookmark {
    user_id: ObjectId;                // ref: User
    question_id: ObjectId;            // ref: Question
    created_at: Date;
}

// Indexes:
// - { user_id, question_id } UNIQUE  — prevents duplicate bookmarks
// - { user_id, created_at: -1 }      — fetch bookmarks list in order
```

**Key Behaviors:**
- Bookmark creation is a toggle: POST to `/api/bookmarks` with a `questionId` either creates or deletes the bookmark
- Bookmarked questions are accessible from:
  - `/bookmarks` page (dedicated bookmarks list)
  - Problems page with `filter=bookmarked` query parameter
- Bookmark status is shown as a visual indicator on the problems list and problem detail page

---

### 4.8 GameScore Collection

Records results of mini-game sessions.

```typescript
// Collection: gamescores
// File: src/core/models/GameScore.ts

interface IGameScore {
    user_id: ObjectId;                // ref: User
    game_id: string;                  // "speed-tables", "square-roots", etc.
    score: number;                    // calculated score
    total_questions: number;          // always 10 per session
    correct_answers: number;
    time_seconds: number;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    created_at: Date;
}

// Indexes:
// - { user_id, created_at: -1 }     — game history
// - { game_id, score: -1 }          — leaderboard (future feature)
```

**Key Behaviors:**
- Each game session is 10 questions
- Score formula: `(10 + timeLeft*5 + streak*2) * difficultyMultiplier`
  - Difficulty multipliers: EASY 1x, MEDIUM 1.5x, HARD 2x
- Games do NOT count toward the heatmap (heatmap uses `questions_solved` only)
- Games DO increment `DailyActivity.games_played` and `time_spent_ms`
- Games are accessible without login, but scores are only saved for authenticated users

---

### 4.9 DailyActivity Collection

Aggregated per-user-per-day activity tracking. Powers the heatmap and daily goal progress.

```typescript
// Collection: dailyactivities
// File: src/core/models/DailyActivity.ts

interface IDailyActivity {
    user_id: ObjectId;                // ref: User
    date: string;                     // "YYYY-MM-DD" — unique per user per day
    questions_solved: number;         // total question attempts
    questions_correct: number;        // correct attempts only
    time_spent_ms: number;            // total time (questions + games)
    sessions_completed: number;       // finished sprint/practice sessions
    games_played: number;             // game sessions played
    quant_solved: number;             // quant correct answers (for separate goal tracking)
    reasoning_solved: number;         // reasoning correct answers (for separate goal tracking)
    createdAt: Date;
    updatedAt: Date;
}

// Indexes:
// - { user_id, date } UNIQUE         — one document per user per day
// - { user_id, date: -1 }            — heatmap query (reverse chronological)
```

**Key Behaviors:**
- Created/updated via `findOneAndUpdate` with `$inc` and `upsert: true`
- Heatmap intensity levels (based on `questions_solved` only, NOT games):
  - 0: zero questions solved
  - 1: 1-2 questions
  - 2: 3-4 questions
  - 3: 5-9 questions
  - 4: 10+ questions
- `quant_solved` and `reasoning_solved` are tracked separately for per-subject daily goal progress
- The heatmap displays the last 365 days of activity

---

### 4.10 Report Collection (NEW)

Allows users to report incorrect or problematic questions. Reports go to the admin review queue.

```typescript
// Collection: reports
// File: src/core/models/Report.ts (NEW — needs to be created)

interface IReport {
    user_id: ObjectId;                // ref: User — who reported
    question_id: ObjectId;            // ref: Question — which question
    reason: string;                   // report category (see below)
    description?: string;             // optional details from user

    status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
    admin_notes?: string;             // admin response/notes

    created_at: Date;
    updated_at: Date;
}

// Indexes:
// - { question_id, status }          — find reports for a question
// - { user_id, created_at: -1 }      — user's report history
// - { status, created_at: 1 }        — admin review queue (oldest pending first)

// Report Reasons:
// - "Content Error (Typo, Wrong Value)"
// - "Wrong Answer / Solution"
// - "Image Missing / Unclear"
// - "Formatting Issue"
// - "Other"
```

**Key Behaviors:**
- Users can report a question after attempting it in practice mode
- The ReportModal sends a POST to `/api/reports` with `questionId`, `reason`, and optional `description`
- Admin can review reports, add notes, and change status
- Multiple users can report the same question (no uniqueness constraint)

---

## 5. Authentication & Security

### 5.1 Auth Flow

```
Registration:
  Client → POST /api/auth/register { email, password, name, targetExam, dailyQuantGoal, dailyReasoningGoal }
  Server → Validate → Hash password (bcrypt, 12 rounds) → Create User → Generate JWT → Set httpOnly cookie
  Response → { user object }

Login:
  Client → POST /api/auth/login { email, password }
  Server → Find user → Verify password → Validate streak → Update last_active_date → Generate JWT → Set cookie
  Response → { user object with stats }

Session Check (on every page load):
  Client → GET /api/auth/me (cookie sent automatically)
  Server → Verify JWT → Fetch user → Validate streak → Compute heatmap → Return user data

Logout:
  Client → POST /api/auth/logout
  Server → Clear auth cookie
```

### 5.2 JWT Configuration
- **Algorithm:** HS256 (default)
- **Expiry:** 7 days
- **Payload:** `{ userId, email }`
- **Storage:** httpOnly cookie named `atlas_auth_token`
- **Cookie settings:** httpOnly, secure (production only), sameSite=lax, maxAge=7 days

### 5.3 Password Security
- **Hashing:** bcrypt with 12 salt rounds
- **Minimum length:** 6 characters (enforced at registration)

### 5.4 Middleware (Route Protection + Rate Limiting)

**Rate Limiting** (in-memory, per-IP, 1-minute sliding window):
| Route Category | Limit |
|---|---|
| `/api/auth/*` | 10 requests/minute |
| `/api/*` (other) | 120 requests/minute |
| All other routes | 60 requests/minute |

**Protected Routes** (require `atlas_auth_token` cookie):
- `/dashboard`, `/bookmarks`, `/submissions`
- `/sprint`, `/sprint/*`
- `/admin`, `/admin/*`
- `/settings`, `/profile`

**Auth Routes** (redirect to `/dashboard` if already logged in):
- `/login`, `/register`

### 5.5 Admin Access

Currently, the admin page (`/admin/review`) is protected only by the general auth middleware (requires login). There is **no role-based access check** — any authenticated user could theoretically access the admin page if they know the URL. The plan is to restrict this route before launch.

---

## 6. API Reference

### 6.1 Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create new account |
| POST | `/api/auth/login` | No | Login with email/password |
| POST | `/api/auth/logout` | Yes | Clear auth cookie |
| GET | `/api/auth/me` | Yes | Get current user + heatmap + stats |

**POST /api/auth/register**
```
Body: { email, password, name, targetExam?, dailyQuantGoal?, dailyReasoningGoal? }
Response: { user: { id, email, name, username, targetExam, dailyGoal } }
```

**POST /api/auth/login**
```
Body: { email, password }
Response: { user: { id, email, name, username, targetExam, totalSolved, streak, maxStreak } }
Side effects: Updates last_active_date, validates streak
```

**GET /api/auth/me**
```
Response: { user: { id, email, name, username, avatar_url, heatmap[], totalSolved, totalCorrect, streak, maxStreak, lastActive, dailyQuantGoal, dailyReasoningGoal, isPremium, targetExam } }
Heatmap: Array of { date, count, intensity (0-4) } for last 365 days
```

---

### 6.2 Questions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/questions` | Optional | Paginated question list with filters |
| GET | `/api/questions/patterns` | No | All patterns with live question counts |
| GET | `/api/questions/[id]` | No | Single question details |
| GET | `/api/questions/[id]/navigation` | No | Prev/next question IDs for navigation |

**GET /api/questions**
```
Query: page, limit(20), section, difficulty, pattern, year, query, filter(bookmarked|wrong|unanswered)
Response: { data: [{ id, title, pattern, difficulty, subject, acceptance, source, is_live }], pagination: { total, page, totalPages } }
Note: filter=bookmarked/wrong/unanswered requires authentication
```

**GET /api/questions/[id]/navigation**
```
Query: section (QUANT | REASONING | ALL)
Response: { data: { prevId, nextId, currentPosition, totalCount, section } }
Current behavior: Navigation uses MongoDB _id ordering (insertion order)
PENDING: Should use question_number field and respect pattern filter context
```

---

### 6.3 Attempts

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/attempts` | Yes | Record a question attempt |
| GET | `/api/attempts/history` | Yes | User's submission history |

**POST /api/attempts**
```
Body: { questionId, optionSelected, timeMs, sessionId? }
Response: { success, attempt: { id, is_correct, correct_option } }
Side effects:
  - Creates Attempt record
  - Updates DailyActivity ($inc questions_solved, questions_correct, time_spent_ms, quant_solved/reasoning_solved)
  - Updates User.stats (total_solved on first correct, total_correct, streak logic, max_streak)
  - Updates Session if sessionId provided (attempt_ids, correct_count, total_time_ms)
```

**Streak Logic on Attempt:**
```
if last_active_date == today     → no streak change (already counted)
if last_active_date == yesterday → current_streak += 1
otherwise                        → current_streak = 1 (restart)
Always: if current_streak > max_streak → max_streak = current_streak
Always: last_active_date = today
```

---

### 6.4 Bookmarks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/bookmarks` | Yes | User's bookmarked questions (paginated) |
| POST | `/api/bookmarks` | Yes | Toggle bookmark on/off |

**POST /api/bookmarks**
```
Body: { questionId }
Behavior: If bookmark exists → delete it (unbookmark). If not → create it (bookmark).
Response: { success, bookmarked: true/false }
```

---

### 6.5 Sessions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/sessions` | Yes | Create sprint/practice session |
| GET | `/api/sessions` | Yes | User's session history |

**POST /api/sessions**
```
Body: { type: 'SPRINT', config: { subject, question_count, difficulty?, patterns?, time_limit_ms? } }
Question Selection: Random via MongoDB $sample, filtered by is_live + subject + difficulty + patterns
Response: { success, session: { _id, question_ids, config, status: 'IN_PROGRESS' } }
```

---

### 6.6 Games

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/games/score` | Yes | Save game result |
| GET | `/api/games/stats` | Yes | Game statistics and leaderboard |

**POST /api/games/score**
```
Body: { gameId, score, totalQuestions, correctAnswers, timeSeconds, difficulty }
Side effects: Creates GameScore, updates DailyActivity (games_played +1, time_spent_ms)
Response: { success, id }
```

---

### 6.7 User

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/user/profile` | Yes | User profile details |
| GET | `/api/user/dashboard` | Yes | Dashboard aggregate data |
| GET | `/api/user/progress` | Yes | Progress stats by section |
| POST | `/api/user/avatar` | Yes | Upload profile picture to R2 |

**GET /api/user/progress**
```
Query: section (QUANT | REASONING | ALL)
Response: { stats: { totalAttempted, totalCorrect, totalWrong, accuracy }, difficultyBreakdown: { EASY/MEDIUM/HARD: { solved, total } }, totalsByDifficulty }
```

---

### 6.8 Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/questions` | Yes | Admin question review queue |
| PUT | `/api/admin/questions/[id]` | Yes | Update question (verify, edit, add images) |

---

### 6.9 Missing/Incomplete API Routes

These endpoints are called from the frontend but do **not yet have backend implementations**:

| Endpoint | Called From | Purpose |
|---|---|---|
| `POST /api/reports` | ReportModal.tsx | Submit question reports |
| `POST /api/exam-request` | ExamRequestModal.tsx | Submit exam interest requests |
| Various `/api/sprint/*` | Sprint pages | Sprint-specific CRUD (uses `/api/sessions` partially) |
| `POST /api/quick-practice` | ProblemClient.tsx | Quick practice session creation |
| `POST /api/user/avatar` | Dashboard | Avatar upload |

---

## 7. Frontend Pages & Features

### 7.1 Public Pages

| Page | Route | Description |
|---|---|---|
| Landing | `/` | Hero, features showcase, FAQ, CTA. Redirects authenticated users to `/dashboard` |
| Login | `/login` | Email/password login form |
| Register | `/register` | Registration with exam selection, separate Quant/Reasoning daily goals |
| Pricing | `/pricing` | Three plans: Monthly INR 200, Bi-Annual INR 700, Yearly INR 1200 |
| Games | `/games` | Mini-games hub (playable without login, scores not saved) |

### 7.2 Protected Pages

| Page | Route | Description |
|---|---|---|
| Dashboard | `/dashboard` | Profile card, circular progress, difficulty breakdown, 365-day heatmap, recent activity tabs |
| Problems | `/problems` | Filterable question browser (section, topic, difficulty, year, status, search) |
| Problem Detail | `/problems/[id]` | Interactive question solver with options, timer, solution, bookmark, report |
| Sprint Setup | `/sprint` | Configure timed session (subject, topics, difficulty, count) |
| Sprint Summary | `/sprint/summary` | Post-sprint results (accuracy %, breakdown, performance tier) |
| Sprint Review | `/sprint/[id]/review` | Question-by-question review with correct/wrong highlighting |
| Sprint History | `/sprint/history` | Past sprints with filters and pagination |
| Game Detail | `/games/[gameId]` | Individual game interface |
| Game History | `/games/history` | Game play history with filters |
| Bookmarks | `/bookmarks` | Saved questions list |
| Submissions | `/submissions` | Full attempt history with filters |
| Admin Review | `/admin/review` | Question verification interface (admin only) |

### 7.3 Problem Detail Page — Three Modes

The Problem Detail page (`/problems/[id]`) operates in three distinct modes based on URL parameters:

**1. Normal Mode** (no special params)
- User browses questions freely
- Prev/Next navigation through all questions in the selected section
- Solution shown after submission
- No timer (unless manually enabled)
- Can bookmark and report

**2. Sprint Mode** (`?sprint=true`)
- Questions auto-advance immediately after submission
- Countdown timer from total allowed time
- No solution feedback during sprint
- Auto-redirects to `/sprint/summary` when timer expires or all questions done
- Question data stored in `sessionStorage.sprintSession`

**3. Practice Mode** (`?practice=true`)
- Navigates through a fixed list of questions
- No timer pressure
- Tied to daily goal progress
- Question list stored in `sessionStorage.practiceSession`

**Keyboard Shortcuts:**
| Key | Action |
|---|---|
| `1-4` | Select option A, B, C, D |
| `Enter` | Submit answer |
| `Backspace` | Clear selection |
| `←` / `→` | Previous / Next question |
| `↑` / `↓` | Navigate sidebar (when open) |
| `+` / `-` | Zoom in/out on images |
| `Esc` | Close zoom view |

---

## 8. Core Features — Detailed Flows

### 8.1 Sprint Flow (End-to-End)

```
1. User visits /sprint
   └── Selects subject (QUANT/REASONING)
   └── Picks topics (multi-select, or "All")
   └── Chooses question count (5/10/15/20)
   └── Selects difficulty (EASY: 40s/q, MEDIUM: 30s/q, HARD: 25s/q)

2. User clicks "Start Sprint"
   └── POST /api/sessions → creates Session with random questions
   └── Session data stored in sessionStorage.sprintSession:
       { sprintId, questionIds, questions, currentIndex: 0,
         subject, difficulty, totalTimeAllowed, timePerQuestion, startTime }
   └── Redirects to /problems/{firstQuestionId}?section={subject}&sprint=true

3. During Sprint (Problem Detail page in sprint mode)
   └── Timer counts down from totalTimeAllowed
   └── User selects option → auto-submits → POST /api/attempts
   └── Auto-advances to next question
   └── No solution/feedback shown during sprint
   └── Per-question time tracked in sessionStorage.questionTimes

4. Sprint Ends (all questions answered OR timer expires)
   └── Results stored in sessionStorage.sprintResults: { sprintId, totalTimeSpent, timedOut }
   └── Redirect to /sprint/summary

5. Summary Page
   └── Fetches sprint details from API
   └── PUT /api/sprint { action: 'complete' } → finalizes session
   └── Displays: accuracy %, correct/incorrect/skipped, time, performance tier
   └── Performance Tiers:
       90%+ = Legendary (amber)
       80-89% = Excellent (emerald)
       60-79% = Good (blue)
       40-59% = Average (neutral)
       <40% = Needs Practice (rose)

6. Review (optional)
   └── /sprint/{id}/review — question-by-question with correct answers highlighted
```

**PENDING:** Sprint timer is currently client-side only (sessionStorage). Server-side validation is needed to prevent time manipulation.

---

### 8.2 Quick Practice Flow

Quick Practice is tied to the user's daily goal targets (separate for Quant and Reasoning).

```
1. User sees daily progress on Dashboard
   └── "Quant: 8/15 done today" | "Reasoning: 3/10 done today"
   └── "Continue Practice" CTA button

2. User clicks "Continue Practice"
   └── Creates a QUICK_PRACTICE session with remaining questions needed
   └── Fetches random questions matching the user's target section
   └── Navigates to problem detail in practice mode

3. User practices at their own pace
   └── No timer pressure
   └── Can pause and resume (session stays IN_PROGRESS)
   └── Progress updates in real-time via DailyActivity

4. Daily goal met
   └── Celebration/completion indicator on dashboard
   └── Streak maintained as long as at least 1 question was attempted
```

**PENDING:** Quick Practice button needs to be added to the Dashboard page. The backend session creation route needs to handle `QUICK_PRACTICE` type properly.

---

### 8.3 Streak System

**How streaks work:**

```
Streak is MAINTAINED if:
  └── User attempts at least 1 question on consecutive days

Streak INCREMENTS when:
  └── A new attempt is made AND last_active_date was YESTERDAY
  └── current_streak += 1

Streak RESETS to 1 when:
  └── A new attempt is made AND last_active_date was 2+ days ago

Streak is VALIDATED on:
  └── Every login (POST /api/auth/login)
  └── Every profile fetch (GET /api/auth/me)
  └── If 2+ day gap detected → current_streak = 0

max_streak auto-updates:
  └── On every attempt: if current_streak > max_streak → max_streak = current_streak
```

**Note:** Any single question attempt counts as daily activity. The user does NOT need to meet their daily goal to maintain the streak.

---

### 8.4 Heatmap

The heatmap on the dashboard visualizes the user's activity over the last 365 days.

**Data Source:** `DailyActivity.questions_solved` (questions only, NOT games)

**Intensity Mapping:**
| Questions Solved | Intensity | Visual |
|---|---|---|
| 0 | 0 | Empty/dark |
| 1-2 | 1 | Light shade |
| 3-4 | 2 | Medium shade |
| 5-9 | 3 | Dark shade |
| 10+ | 4 | Darkest/full |

---

### 8.5 Question Browsing & Filtering

The Problems page (`/problems`) supports rich filtering:

| Filter | Values | Behavior |
|---|---|---|
| Section | QUANT, REASONING | Tab-style switcher |
| Topic | All patterns for selected section | Dropdown with hierarchical grouping |
| Difficulty | EASY, MEDIUM, HARD | Dropdown |
| Year | 2020-2024 | Dropdown |
| Status | All, Unattempted, Bookmarked, Wrong, Correct | Dropdown (requires auth for personal filters) |
| Search | Free text | Regex search on question text |

**Question Status Badges:**
| Badge | Meaning | Color |
|---|---|---|
| Checkmark | Solved correctly | Green |
| Timer | Attempted but incorrect | Amber |
| Bookmark | Bookmarked (unattempted) | Violet |
| Circle | Not attempted | Gray |

**Pagination:** 20 questions per page with page number navigation.

---

### 8.6 Bookmarking

- Users can bookmark any question from the problem detail page (bookmark icon toggle)
- Bookmarked questions accessible from:
  - `/bookmarks` — dedicated page with full list
  - `/problems?filter=bookmarked` — filtered view in problem browser
  - Dashboard — recent bookmarks tab
- Toggle behavior: POST `/api/bookmarks` with `questionId` creates or deletes the bookmark

---

### 8.7 Reporting Questions

- Users can report a question after attempting it in practice mode
- The ReportModal offers predefined reasons:
  - Content Error (Typo, Wrong Value)
  - Wrong Answer / Solution
  - Image Missing / Unclear
  - Formatting Issue
  - Other
- Optional description field for details
- Reports are stored in the Report collection for admin review

---

## 9. Games System

### 9.1 Overview

The platform includes **26 mini-games** designed to build mental math speed and reasoning reflexes relevant to SSC CGL preparation.

| Category | Count | Purpose |
|---|---|---|
| Quantitative | 16 games | Speed math, mental calculations, conversions |
| Reasoning | 10 games | Pattern recognition, logic, spatial reasoning |

### 9.2 Difficulty System

| Level | Label | Time/Question | Score Multiplier |
|---|---|---|---|
| EASY | Beginner | 12 seconds | 1.0x |
| MEDIUM | Standard | 8 seconds | 1.5x |
| HARD | Expert | 5 seconds | 2.0x |

### 9.3 Scoring Formula

```
Per Question: baseScore = 10 + (timeLeft × 5) + (streak × 2)
Final Score: baseScore × difficultyMultiplier
```

- **10 points** base for correct answer
- **5 points** bonus per second remaining
- **2 points** bonus per consecutive correct answer (streak)
- Score multiplied by difficulty multiplier (1x / 1.5x / 2x)
- Each session is exactly **10 questions**

### 9.4 Quantitative Games (16)

| # | Game | ID | Description |
|---|---|---|---|
| 1 | Speed Tables | `speed-tables` | Rapid multiplication (e.g., 7 x 8 = ?) |
| 2 | Square Roots | `square-roots` | Recognize perfect squares (e.g., sqrt(144) = ?) |
| 3 | Cube Roots | `cube-roots` | Memorize cubes (e.g., cbrt(729) = ?) |
| 4 | Squares Flash | `squares-flash` | Calculate squares (e.g., 17² = ?) |
| 5 | Percentage Flash | `percentage-flash` | Fraction-to-percentage (e.g., 25% of 200 = ?) |
| 6 | Simplification Blitz | `simplification-blitz` | BODMAS problems under pressure |
| 7 | Addition Sprint | `addition-sprint` | Rapid addition of 2-3 digit numbers |
| 8 | Subtraction Sprint | `subtraction-sprint` | Rapid subtraction of 2-3 digit numbers |
| 9 | Divisibility Dash | `divisibility-dash` | Divisibility rule checks (e.g., Is 396 divisible by 9?) |
| 10 | Unit Digit Hunter | `unit-digit-hunter` | Find last digit of expressions |
| 11 | Fraction to Decimal | `fraction-decimal` | Convert fractions (e.g., 3/4 = 0.75) |
| 12 | Decimal to Fraction | `decimal-fraction` | Convert decimals (e.g., 0.125 = 1/8) |
| 13 | Ratio Simplification | `ratio-simplification` | Simplify ratios (e.g., 24:36 = 2:3) |
| 14 | Average Quick Solve | `average-quick` | Calculate averages of number sets |
| 15 | Profit/Loss Flash | `profit-loss` | Calculate profit/loss % from CP and SP |
| 16 | Time & Speed | `time-speed` | Convert km/h to m/s |

### 9.5 Reasoning Games (10)

| # | Game | ID | Description |
|---|---|---|---|
| 1 | Series Sprint | `series-sprint` | Identify arithmetic, geometric, square, Fibonacci patterns |
| 2 | Coding Rush | `coding-rush` | Decode letter shifting logic |
| 3 | Analogy Express | `analogy-express` | Find relationships between word pairs |
| 4 | Odd One Out | `odd-one-out` | Spot the anomaly in a group |
| 5 | Alphabet Recall | `alphabet-recall` | Master letter positions (forward and reverse rank) |
| 6 | Dictionary Order | `dictionary-order` | Identify alphabetically first word |
| 7 | Calendar Crunch | `calendar-crunch` | Calculate day of the week after N days |
| 8 | Direction Sense | `direction-sense` | Track turns and find final direction |
| 9 | Blood Relation | `blood-relation` | Decode family relationships |
| 10 | Mirror Image | `mirror-image` | Identify correct mirror image of text |

### 9.6 Game Flow

```
1. User opens /games → sees dashboard stats + game grid
2. Clicks a game card → GameModal opens
3. Selects difficulty (Easy/Medium/Hard)
4. Game starts: 10 questions with countdown timer per question
5. User answers via click or keyboard (1-4)
6. Immediate correct/incorrect feedback + streak tracking
7. After 10 questions → results screen with score, accuracy, time
8. Score saved via POST /api/games/score
9. "New Record!" celebration if score beats personal best
10. User can replay or exit to games hub
```

### 9.7 Game Integration

- Games are accessible from `/games` without login
- Scores are only saved if user is authenticated
- Games contribute to `DailyActivity.games_played` and `time_spent_ms`
- Games do **NOT** contribute to the heatmap (which counts only `questions_solved`)
- Games do **NOT** affect the streak system
- Exit confirmation warns user if they abandon an active game

---

## 10. Admin System

### 10.1 Question Import Pipeline

```
1. PDF Collection: SSC CGL papers downloaded (2018-2024)
2. Extraction: Python scripts + Tesseract.js OCR extract questions from PDFs
   └── scripts/batch_extract_*.py — bulk extraction
   └── scripts/import_to_mongodb.py — database insertion
3. Import: Questions inserted with is_live: false, needs_review: true
4. Review: Admin (/admin/review) reviews each question:
   └── Verifies text accuracy
   └── Adds missing images (uploaded to R2)
   └── Corrects options/answers
   └── Sets is_live: true when verified
5. Live: Question appears in the platform for users
```

### 10.2 Admin Review Page

The admin review page (`/admin/review`) provides:
- Queue of questions with `needs_review: true`
- Filter by verification status, batch, subject
- Inline editing of question text, options, answer
- Image upload for questions and options (via R2)
- OCR modal for extracting text from images
- Toggle `is_live` and `needs_review` flags

### 10.3 Admin Access Control

**Current state:** No role-based protection. The route is behind general auth middleware only.

**Planned:** Block the `/admin/*` routes for non-admin users before launch using role checks.

---

## 11. Deployment & Infrastructure

### 11.1 Architecture

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│   Vercel     │────▶│ MongoDB Atlas │     │ Cloudflare R2 │
│  (Next.js)   │     │  (Database)   │     │   (Images)    │
│              │────▶│              │     │               │
│  - SSR/SSG   │     │  - 9 collections│   │  - Q images   │
│  - API Routes│     │  - Indexed     │   │  - Avatars    │
│  - Middleware │     │              │     │               │
└─────────────┘     └──────────────┘     └───────────────┘
```

### 11.2 Environment Variables

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret key |
| `NODE_ENV` | Environment (development / production) |
| `R2_ENDPOINT` | Cloudflare R2 endpoint URL |
| `R2_ACCESS_KEY_ID` | R2 access key |
| `R2_SECRET_ACCESS_KEY` | R2 secret key |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_PUBLIC_URL` | R2 public URL for image access |
| `NEXT_PUBLIC_BASE_URL` | App base URL (for SEO/metadata) |

### 11.3 Vercel Deployment Considerations

| Concern | Details |
|---|---|
| **Cold Starts** | Serverless functions on Vercel may cold-start, causing a ~1-3s delay on the first MongoDB connection. The `dbConnect()` utility caches the connection to mitigate repeated cold starts within the same function instance. |
| **Function Timeout** | Vercel Hobby plan: 10s max execution. Pro plan: 60s. Complex aggregation queries (dashboard, progress) should stay within limits. |
| **Rate Limiting** | In-memory rate limiting resets on each cold start and is per-instance, not global. In production with multiple instances, rate limits may not be enforced consistently. Consider Redis-based rate limiting for production scale. |
| **File Upload Limits** | Vercel has a 4.5MB request body limit on serverless functions. Avatar and question image uploads must stay within this limit. |
| **Edge Runtime** | Middleware runs on Vercel Edge Runtime. The current middleware uses in-memory Maps which don't persist across edge invocations — rate limiting is best-effort only. |
| **MongoDB Connection Pooling** | Each serverless function invocation may create a new connection. The cached `dbConnect()` helps, but under high concurrency, connection pool limits on MongoDB Atlas may be reached. |
| **R2 Upload Latency** | Uploading to Cloudflare R2 from Vercel adds network latency. For large batches of images, consider a background job or direct client upload with signed URLs. |

---

## 12. Known Issues & Pending Work

### 12.1 Schema Issues

| Issue | Details | Priority |
|---|---|---|
| **Daily Goal Split** | `User.preferences.daily_goal` is a single field but should be two: `daily_quant_goal` and `daily_reasoning_goal`. Frontend registration already sends both values, but the backend only stores one. | High |
| **Question Number Field** | `Question` model lacks a `question_number` field. Navigation currently uses MongoDB `_id` ordering. Needs a global sequential number for stable URLs and proper navigation within pattern-filtered contexts. | High |
| **Report Collection** | No `Report` model or `/api/reports` route exists. The frontend `ReportModal` calls `POST /api/reports` which returns 404. Model and route need to be created. | Medium |

### 12.2 Missing API Routes

| Route | Purpose | Status |
|---|---|---|
| `POST /api/reports` | Submit question reports | Frontend exists, backend missing |
| `POST /api/exam-request` | Capture exam interest | Frontend exists, backend missing |
| `POST /api/user/avatar` | Avatar upload to R2 | Frontend exists, backend missing |

### 12.3 Feature Gaps

| Feature | Details | Priority |
|---|---|---|
| **Sprint Server-Side Timer** | Timer is purely client-side (sessionStorage). No server validation that a sprint was completed within the allowed time. Users could manipulate time data. Needs server-side `startTime` tracking and validation on completion. | High |
| **Quick Practice on Dashboard** | Quick Practice button was removed from the Problems page. Needs to be added to the Dashboard with a "Continue Practice" CTA alongside daily goal progress display. | High |
| **Session Resumption** | When a user closes the browser mid-sprint, the session stays `IN_PROGRESS` with `current_index` saved, but there's no UI to detect and offer resumption of abandoned sessions. | Medium |
| **Admin Role Protection** | `/admin/review` page has no role-based access check. Any authenticated user could access it. Needs `role: ADMIN` middleware check before launch. | High |
| **Pattern-Based Navigation** | Question prev/next navigation should respect the pattern filter context from the problems page. If a user is viewing "Percentage" questions, next/prev should stay within that pattern. | Medium |
| **Landing Page Stats** | Landing page claims "10,000+ PYQs" which is inaccurate. This number should be removed or replaced with the actual count. | Low |

### 12.4 Performance Considerations

| Area | Recommendation |
|---|---|
| **Progress API** | Computes stats on-demand from Attempt records. As attempts grow, consider periodic aggregation into a cached summary. |
| **Rate Limiting** | In-memory, resets on cold start, per-instance. Move to Redis for production. |
| **Heatmap Query** | Fetches 365 days of DailyActivity on every `/api/auth/me` call. Could be cached or lazy-loaded. |
| **Question Stats** | `Question.stats` (attempt_count, accuracy_rate, avg_time_ms) are denormalized but need periodic recalculation via aggregation. |

---

*This document reflects the state of the codebase as of 2026-02-10. It should be updated as features are implemented and issues are resolved.*
