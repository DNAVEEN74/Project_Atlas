# Prepleague — UI/UX Review: Dashboard, Submissions, Bookmarks

> Covers: Dashboard page, Submissions page, Bookmarks page, Analytics architecture, Quick Practice integration, Premium analytics features

---

## DASHBOARD PAGE (`/dashboard`)

### What's Working

- Heatmap is functional and displays correctly from DailyActivity collection
- Difficulty breakdown (Easy/Medium/Hard) with progress bars is useful
- Section tabs (All/Quant/Reasoning) filter the stats correctly
- Profile card with avatar, name, exam badge looks clean
- Statistics section (Correct/Wrong/Bookmarks/Max Streak) is relevant data

### Issue 1: The dashboard has no clear "what should I do right now?" moment

**What's wrong:** The dashboard shows data but doesn't drive action. A student opens the dashboard and sees stats — but there's no answer to "what should I practice today?" The most important job of the dashboard is to get the user INTO a practice session within 5 seconds.

**Fix:** The top of the dashboard (above the fold, first thing visible) should be a **Daily Practice card** that answers three questions:
1. How much have I done today?
2. How much is left?
3. One-tap to continue.

```
┌──────────────────────────────────────────────────────┐
│  Today's Progress                          Feb 12    │
│                                                      │
│  ████████████████░░░░░░░░░░  12/20 questions         │
│                                                      │
│  Quant: 8/12 done    Reasoning: 4/8 done             │
│                                                      │
│  🔥 2 day streak — keep it alive!                    │
│                                                      │
│  [ Continue Practice → ]     [ Start Sprint ⚡ ]      │
└──────────────────────────────────────────────────────┘
```

This card should be the HERO of the dashboard. Everything else is secondary.

---

### Issue 2: Profile card takes too much space for what it shows

**What's wrong:** The left column dedicates a large card to: avatar, name (truncated), username (truncated), SSC CGL badge, and "Practice Now" button. This is ~25% of the screen for information that's already in the header (avatar + name + streak).

**Fix:** Compress the profile into a single row at the top of the dashboard, or merge it into the daily progress card:

```
┌────────────────────────────────────────────┐
│  👤 Naveen Durgam    🔥 2 days    SSC CGL  │
│  12/20 today · 50% accuracy this week      │
└────────────────────────────────────────────┘
```

Reclaim that left column space for something more useful — like the Quick Practice section or topic-wise stats.

---

### Issue 3: "3/50 Solved" circular progress is misleading

**What's wrong:** The circular progress shows "3/50 Solved" — meaning 3 out of 50 total questions. But this is a total-progress metric that will become meaningless when you have 3000+ questions. Nobody will ever "complete" 3000 questions — that's not how exam prep works.

**Fix:** Replace with a more meaningful metric:

**Option A — Weekly progress ring:**
```
This Week: 35 questions
        ┌───┐
       │ 35 │  (ring fills based on weekly goal, e.g., 100/week)
        └───┘
  vs last week: +12 more
```

**Option B — Accuracy ring:**
```
Overall Accuracy: 62%
        ┌────┐
       │ 62% │
        └────┘
  Quant: 58%  Reasoning: 71%
```

The accuracy ring is more actionable — students want to see their accuracy improve over time, not count total questions.

---

### Issue 4: Difficulty breakdown lacks context

**What's wrong:** "Easy 1/16 · Medium 2/22 · Hard 0/12" shows how many questions you've solved at each difficulty level out of total available. This is useful but doesn't tell you HOW WELL you did.

**Fix:** Add accuracy to the difficulty breakdown:

```
Easy     1/16 solved    100% accuracy    ████████████████ 
Medium   2/22 solved     50% accuracy    ████████░░░░░░░░ 
Hard     0/12 solved      —              ░░░░░░░░░░░░░░░░
```

Now the student sees: "I'm 100% on Easy but only 50% on Medium — I need to work on Medium questions."

---

### Issue 5: Statistics section is flat and unactionable

**What's wrong:** "Correct: 3, Wrong: 3, Bookmarks: 0, Max Streak: 1" — these are just numbers. They don't tell the user anything actionable. 3 correct and 3 wrong means 50% accuracy — but that calculation is left to the user.

**Fix:** Replace with a more informative stats section:

```
Your Performance
─────────────────
Accuracy          50%    (3 correct / 6 attempted)
Avg Time/Q        42s    (SSC CGL needs: 36s)
Current Streak    🔥 2 days
Best Streak       🔥 1 day (beat it today!)
Questions Today   12/20
```

Key additions:
- **Accuracy as a percentage** (don't make users do math)
- **Average time per question** vs SSC CGL benchmark (36s) — this is the speed metric they care about
- **Current streak** with motivational nudge
- **Questions today** vs daily goal

---

### Issue 6: Heatmap should filter by section

**What's wrong:** You confirmed the heatmap doesn't change when switching between All/Quant/Reasoning tabs. But students who focus on Quant want to see if they've been consistent on Quant specifically.

**Fix:** When the user selects "Quant" tab, the heatmap should show only Quant activity. DailyActivity already tracks `quant_solved` and `reasoning_solved` separately — use those fields.

**Architecture:** The heatmap query needs to return both total and per-subject data:

```typescript
// GET /api/user/dashboard returns:
heatmap: [
  { 
    date: "2026-02-12", 
    total: 15, 
    quant: 10, 
    reasoning: 5 
  },
  ...
]

// Frontend filters based on selected tab:
const value = tab === 'QUANT' ? day.quant 
            : tab === 'REASONING' ? day.reasoning 
            : day.total;
```

This needs no schema change — DailyActivity already has the fields.

---

### Issue 7: No topic-wise performance visible on dashboard

**What's wrong:** The dashboard shows overall accuracy and difficulty breakdown, but NOT which specific topics the user is strong/weak in. This is the #3 pain point from your market research: "platforms show surface-level results — 'you scored 60% in Quant' — but fail to identify granular weaknesses."

**Fix — Add a Topic Accuracy section (FREE tier):**

```
Your Topics (Quant)
─────────────────────────────────────────────
Percentage        ████████████░░  5/6   83%  ↑
Profit & Loss     ██████████░░░░  3/4   75%  
Time & Work       ██████░░░░░░░░  2/5   40%  ⚠️ Focus here
Geometry          ████░░░░░░░░░░  1/4   25%  ⚠️ Needs work
Trigonometry      ░░░░░░░░░░░░░░  0/3    —   Not started
```

Sort by: worst accuracy first (so the user sees what needs work at the top).

**Architecture for topic accuracy:**

```typescript
// Aggregation pipeline on Attempt collection:
const topicStats = await Attempt.aggregate([
  { $match: { user_id: userId, subject: 'QUANT' } },
  { $group: {
      _id: '$pattern',
      total: { $sum: 1 },
      correct: { $sum: { $cond: ['$is_correct', 1, 0] } },
      avg_time: { $avg: '$time_ms' },
  }},
  { $project: {
      pattern: '$_id',
      total: 1,
      correct: 1,
      accuracy: { $divide: ['$correct', '$total'] },
      avg_time: 1,
  }},
  { $sort: { accuracy: 1 } }  // worst first
]);
```

This query is fast (uses the `{ user_id, pattern, is_correct }` index) and runs only when dashboard loads.

---

### Issue 8: Quick Practice needs to be integrated into dashboard

**What's wrong:** Quick Practice currently lives on the Problems page sidebar. We agreed to move it to the dashboard. It's partially visible at the bottom (Image 2) as a link but not as an interactive feature.

**Fix — Quick Practice section on dashboard:**

```
┌──────────────────────────────────────────────────────┐
│  ⚡ Quick Practice                                    │
│                                                      │
│  Based on your daily goal: 20 questions              │
│  Remaining today: 8 questions                        │
│                                                      │
│  Your weak areas need attention:                     │
│  ⚠️ Geometry (25% accuracy) — 3 questions            │
│  ⚠️ Time & Work (40% accuracy) — 3 questions         │
│  📊 Mixed topics — 2 questions                       │
│                                                      │
│  [ Start Quick Practice → ]                          │
│                                                      │
│  OR pick your own:                                   │
│  [ Go to Problems ] [ Start Sprint ⚡ ]               │
└──────────────────────────────────────────────────────┘
```

**How Quick Practice works (architecture):**

```
1. User clicks "Start Quick Practice"
2. POST /api/sessions with type: 'QUICK_PRACTICE'
3. Server calculates remaining questions needed:
   remaining = daily_goal - today's DailyActivity.questions_solved
4. Server selects questions intelligently:
   - 50% from weak topics (lowest accuracy patterns)
   - 30% from topics not practiced recently
   - 20% random (exposure to all topics)
5. Creates Session with those question IDs
6. Returns questions to client
7. User practices at own pace (no timer)
8. Each answer → POST /api/attempts (same as normal)
9. When all answered OR user quits:
   - Show mini-summary
   - Update daily progress
   - If goal met: celebration animation + "Goal reached! 🎯"
```

**Server-side question selection for Quick Practice:**

```typescript
async function selectQuickPracticeQuestions(userId, subject, count) {
  // 1. Find user's weak topics
  const topicStats = await getTopicAccuracy(userId, subject);
  const weakTopics = topicStats
    .filter(t => t.accuracy < 0.6 && t.total >= 3)
    .map(t => t.pattern);

  // 2. Find topics not practiced in last 7 days
  const recentPatterns = await Attempt.distinct('pattern', {
    user_id: userId,
    subject,
    created_at: { $gte: sevenDaysAgo }
  });
  const allPatterns = await Pattern.find({ subject }).distinct('code');
  const staleTopics = allPatterns.filter(p => !recentPatterns.includes(p));

  // 3. Build question selection
  const weakCount = Math.ceil(count * 0.5);
  const staleCount = Math.ceil(count * 0.3);
  const randomCount = count - weakCount - staleCount;

  const questions = await Promise.all([
    // Weak topic questions (not previously solved correctly)
    Question.aggregate([
      { $match: { is_live: true, subject, pattern: { $in: weakTopics } } },
      { $sample: { size: weakCount } }
    ]),
    // Stale topic questions
    Question.aggregate([
      { $match: { is_live: true, subject, pattern: { $in: staleTopics } } },
      { $sample: { size: staleCount } }
    ]),
    // Random
    Question.aggregate([
      { $match: { is_live: true, subject } },
      { $sample: { size: randomCount } }
    ]),
  ]);

  return [...questions[0], ...questions[1], ...questions[2]];
}
```

---

### Issue 9: Recent Submissions tab shows "No recent activity" (bug)

**What's wrong:** You confirmed this is a bug — the submissions page has data but the dashboard tab doesn't fetch it.

**Fix:** The dashboard API should return the last 5-10 attempts:

```typescript
const recentAttempts = await Attempt.find({ user_id: userId })
  .sort({ created_at: -1 })
  .limit(10)
  .populate('question_id', 'text pattern difficulty')
  .lean();
```

Display in the tab as:
```
Recent Submissions
─────────────────
✗ Mensuration (Easy)           2m 21s    today
✗ Data Interpretation (Easy)   44s       today
✗ Data Interpretation (Easy)   15s       today
✓ Percentage (Medium)          32s       yesterday
✓ Profit & Loss (Medium)       28s       yesterday
```

---

## DASHBOARD — PREMIUM ANALYTICS FEATURES

These are behind the paywall. Free users see a locked/blurred version with "Upgrade for detailed analytics."

### Premium Feature 1: Time Analysis

**What it shows:**
```
Time Analysis
─────────────────────────────────────────────
Average time per question:  42s  (target: 36s)

By Topic:
Percentage        ⏱ 28s  ✓ Under target
Profit & Loss     ⏱ 35s  ✓ Under target  
Time & Work       ⏱ 52s  ⚠️ 16s over target
Geometry          ⏱ 67s  🔴 31s over target

By Difficulty:
Easy    ⏱ 25s    Medium  ⏱ 45s    Hard  ⏱ 72s

Speed Trend (last 30 days):
  Week 1: 55s avg → Week 2: 48s → Week 3: 44s → Week 4: 42s
  📈 Improving! 13s faster than when you started.
```

**Architecture:**
```typescript
const timeAnalysis = await Attempt.aggregate([
  { $match: { user_id: userId } },
  { $group: {
      _id: '$pattern',
      avg_time: { $avg: '$time_ms' },
      count: { $sum: 1 },
  }},
  { $sort: { avg_time: -1 } }
]);

// Speed trend: group by week
const speedTrend = await Attempt.aggregate([
  { $match: { user_id: userId } },
  { $group: {
      _id: { $week: '$created_at' },
      avg_time: { $avg: '$time_ms' },
      count: { $sum: 1 },
  }},
  { $sort: { '_id': 1 } }
]);
```

### Premium Feature 2: Mistake Pattern Analysis

**What it shows:**
```
Mistake Patterns
─────────────────────────────────────────────
Your most common mistake areas:

1. Geometry — Circles       1/5 correct  (20%)
   You've attempted 5 circle questions and got 4 wrong.
   → Recommended: Practice 5 more circle questions
   [ Practice Geometry Circles → ]

2. Trigonometry — Heights    0/3 correct  (0%)
   → Recommended: Review basic trig identities first
   [ Practice Trigonometry → ]

3. DI — Tables               2/7 correct  (29%)
   You're spending 67s avg on DI questions (target: 36s)
   → Your issue may be calculation speed, not concepts
   [ Play Speed Math Games → ]
```

**Architecture:**
```typescript
const mistakePatterns = await Attempt.aggregate([
  { $match: { user_id: userId, is_correct: false } },
  { $group: {
      _id: '$pattern',
      wrong_count: { $sum: 1 },
      avg_time: { $avg: '$time_ms' },
  }},
  { $sort: { wrong_count: -1 } },
  { $limit: 5 }
]);

// Cross-reference with correct attempts for accuracy
const patternAccuracy = await Attempt.aggregate([
  { $match: { user_id: userId, pattern: { $in: mistakePatterns.map(m => m._id) } } },
  { $group: {
      _id: '$pattern',
      total: { $sum: 1 },
      correct: { $sum: { $cond: ['$is_correct', 1, 0] } },
      avg_time: { $avg: '$time_ms' },
  }}
]);
```

### Premium Feature 3: Progress Trends (Charts)

**What it shows:**
- Line chart: accuracy over time (weekly rolling average)
- Line chart: speed over time (avg time per question by week)
- Bar chart: questions solved per day (last 30 days)
- Comparison: "You're in the top 35% of active users this week"

**Architecture:** Use Recharts (already a common React charting library). Data comes from the same Attempt aggregation with `$group` by date/week.

```typescript
// Weekly accuracy trend
const accuracyTrend = await Attempt.aggregate([
  { $match: { user_id: userId } },
  { $group: {
      _id: { 
        year: { $year: '$created_at' },
        week: { $week: '$created_at' }
      },
      total: { $sum: 1 },
      correct: { $sum: { $cond: ['$is_correct', 1, 0] } },
  }},
  { $project: {
      week: '$_id',
      accuracy: { $multiply: [{ $divide: ['$correct', '$total'] }, 100] },
  }},
  { $sort: { '_id.year': 1, '_id.week': 1 } }
]);
```

### Premium Feature 4: Predicted Score

**What it shows:**
```
Predicted SSC CGL Score
─────────────────────────
Based on your practice data:

Quant:        128 / 200  (64%)
Reasoning:     —  (not enough data)

Estimated Tier 1 Total:  128+ / 400
Last year's cutoff:      145 / 400

⚠️ You need to improve by ~17 marks
Focus areas: Geometry (+5), DI (+4), Trigonometry (+3)
```

**Architecture:** This is a simulated score based on:
1. User's accuracy rate per topic
2. Weighted by topic frequency in actual SSC CGL papers
3. Adjusted for negative marking (wrong answers × -0.50)

```typescript
function predictScore(topicStats, examPattern) {
  let totalMarks = 0;
  
  for (const topic of examPattern) {
    const userStat = topicStats.find(t => t.pattern === topic.pattern);
    if (!userStat) continue;
    
    const expectedCorrect = topic.questions * userStat.accuracy;
    const expectedWrong = topic.questions * (1 - userStat.accuracy) * 0.7; 
    // assume 70% of remaining are attempted (30% skipped)
    
    totalMarks += (expectedCorrect * 2) - (expectedWrong * 0.5);
  }
  
  return totalMarks;
}
```

This is approximate but gives students a motivating target.

### How to display Premium teasers for Free users

Free users see the same dashboard sections but with data blurred/locked:

```
┌──────────────────────────────────────────────┐
│  📊 Time Analysis                    🔒 PRO  │
│                                              │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░  Your average time: ██s  ░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                              │
│  Unlock detailed time analysis, mistake      │
│  patterns, and predicted scores.             │
│                                              │
│  [ Upgrade to Premium — ₹99/mo → ]          │
└──────────────────────────────────────────────┘
```

Show just enough to make them curious. The blurred data creates FOMO — "I can almost see my weak areas but not quite."

---

## SUBMISSIONS PAGE (`/submissions`)

### Issue 10: Same question appearing multiple times is confusing

**What's wrong (Image 3):** The same data_interpretation question appears 3 times (2m 21s, 44s, 15s). This is the user re-attempting the same question. But visually it looks like three different questions — and it clutters the history.

**Fix — Group re-attempts:**
```
Data Interpretation (Easy)          2/12/2026
├── Attempt 3:  ✗ Incorrect   15s
├── Attempt 2:  ✗ Incorrect   44s
└── Attempt 1:  ✗ Incorrect   2m 21s
```

Or show only the latest attempt with a "(3 attempts)" badge:
```
✗  Data Interpretation (Easy)   15s   today   (3 attempts)
```

Click to expand and see all attempts.

### Issue 11: Pattern slug shown instead of display name

**What's wrong:** The submissions show `mensuration_3d` and `data_interpretation` — these are the technical pattern codes from the database, not display names.

**Fix:** Show the display name from Pattern collection: "Mensuration 3D" and "Data Interpretation". The API should join/lookup the Pattern.name.

### Issue 12: Time shows "-" for some entries

**What's wrong:** First entry shows time as "-" instead of a duration. This likely means `time_ms` was not recorded for that attempt.

**Fix:** If time is not recorded, show "—" (em dash) and don't include it in time averages. Investigate why time_ms is sometimes missing — it should always be tracked.

### Issue 13: No "click to review" on submissions

**What's wrong:** Each submission shows the question text but there's no way to click through to the actual question to review it, see the solution, or re-attempt.

**Fix:** Make each submission row clickable → navigates to `/problems/[question_id]`. Add a small "→" icon on the right to indicate it's clickable.

---

## BOOKMARKS PAGE (`/bookmarks`)

### Issue 14: Empty state is bare

**What's wrong (Image 4):** "You haven't bookmarked any questions yet." — plain text with no guidance.

**Fix:** Better empty state:
```
┌──────────────────────────────────────────┐
│  🔖 No bookmarks yet                    │
│                                          │
│  Bookmark questions you want to          │
│  review later — especially ones you      │
│  got wrong!                              │
│                                          │
│  [ Browse Questions → ]                  │
└──────────────────────────────────────────┘
```

Also add subject filter (Quant/Reasoning) and topic filter in addition to the existing difficulty filter.

---

## DASHBOARD LAYOUT — COMPLETE REDESIGN

Here's the full corrected dashboard layout, top to bottom:

```
DESKTOP LAYOUT (3 columns)
═══════════════════════════════════════════════════════════

ROW 1: Daily Progress Hero (full width)
┌──────────────────────────────────────────────────────────┐
│  Today · Feb 12          🔥 2 day streak                 │
│  ████████████████░░░░░░  12/20 questions                 │
│  Quant: 8/12    Reasoning: 4/8                           │
│  [ Continue Practice → ]         [ Start Sprint ⚡ ]      │
└──────────────────────────────────────────────────────────┘

ROW 2: Stats + Heatmap
┌────────────────┐ ┌──────────────────────────────────────┐
│ Accuracy  62%  │ │  Activity (365 days)                  │
│ Avg Time  42s  │ │  ░░▓▓██░░▓▓▓▓██░░░░▓▓██▓▓████▓▓▓▓  │
│ Solved    35   │ │  [All] [Quant] [Reasoning]            │
│ Streak  🔥 2   │ │  Total active days: 12  Max streak: 7 │
└────────────────┘ └──────────────────────────────────────┘

ROW 3: Topic Accuracy (FREE) + Quick Practice
┌──────────────────────────────┐ ┌─────────────────────────┐
│ Topic Performance (Quant)    │ │ ⚡ Quick Practice         │
│                              │ │                         │
│ Percentage    5/6   83% ████ │ │ 8 questions left today  │
│ Profit/Loss   3/4   75% ███ │ │                         │
│ Time & Work   2/5   40% ██  │ │ Weak areas:             │
│ Geometry      1/4   25% █   │ │ ⚠️ Geometry (3 Qs)       │
│ Trig          0/3    —  ░   │ │ ⚠️ Time & Work (3 Qs)    │
│                              │ │                         │
│ [See all topics →]           │ │ [ Start Practice → ]    │
└──────────────────────────────┘ └─────────────────────────┘

ROW 4: Premium Teaser (for free users)
┌──────────────────────────────────────────────────────────┐
│ 📊 Unlock Deep Analytics                        🔒 PRO  │
│ Time analysis · Mistake patterns · Predicted score       │
│ [ Upgrade — ₹99/mo → ]                                  │
└──────────────────────────────────────────────────────────┘

ROW 5: Difficulty Breakdown + Recent Activity
┌──────────────────────────────┐ ┌─────────────────────────┐
│ Difficulty Breakdown         │ │ Recent Activity          │
│ Easy    1/16  100%  █████   │ │                         │
│ Medium  2/22   50%  ███     │ │ ✗ Mensuration    2m 21s │
│ Hard    0/12    —   ░       │ │ ✗ Data Interp      44s  │
│                              │ │ ✓ Percentage       32s  │
│ [All] [Quant] [Reasoning]   │ │                         │
└──────────────────────────────┘ │ [All submissions →]     │
                                 └─────────────────────────┘

MOBILE LAYOUT (single column, stacked)
═══════════════════════════════════════
1. Daily Progress Hero (compact)
2. Stats row (4 cards in 2×2 grid)
3. Heatmap (horizontal scroll)
4. Topic Accuracy (collapsible)
5. Quick Practice card
6. Premium teaser
7. Recent Activity
```

---

## HOW TO BUILD THE DASHBOARD API

One API call returns all dashboard data:

```typescript
// GET /api/user/dashboard

async function getDashboardData(userId) {
  const today = getTodayString();
  const yearAgo = getDateString(365);

  // Run all queries in parallel
  const [user, todayActivity, heatmap, topicStats, recentAttempts, difficultyStats] = 
    await Promise.all([
      
      // 1. User profile + stats
      User.findById(userId, 'profile stats preferences config').lean(),
      
      // 2. Today's activity
      DailyActivity.findOne({ user_id: userId, date: today }).lean(),
      
      // 3. Heatmap (365 days)
      DailyActivity.find(
        { user_id: userId, date: { $gte: yearAgo } },
        'date questions_solved quant_solved reasoning_solved'
      ).sort({ date: 1 }).lean(),
      
      // 4. Topic accuracy
      Attempt.aggregate([
        { $match: { user_id: new ObjectId(userId) } },
        { $group: {
            _id: { pattern: '$pattern', subject: '$subject' },
            total: { $sum: 1 },
            correct: { $sum: { $cond: ['$is_correct', 1, 0] } },
            avg_time: { $avg: '$time_ms' },
        }},
      ]),
      
      // 5. Recent attempts (last 10)
      Attempt.find({ user_id: userId })
        .sort({ created_at: -1 })
        .limit(10)
        .populate('question_id', 'text pattern difficulty subject')
        .lean(),
      
      // 6. Difficulty breakdown
      Attempt.aggregate([
        { $match: { user_id: new ObjectId(userId) } },
        { $group: {
            _id: { difficulty: '$difficulty', subject: '$subject' },
            total: { $sum: 1 },
            correct: { $sum: { $cond: ['$is_correct', 1, 0] } },
        }},
      ]),
    ]);

  return {
    user,
    daily_progress: {
      today_solved: todayActivity?.questions_solved || 0,
      today_correct: todayActivity?.questions_correct || 0,
      daily_goal: user.preferences.daily_goal,
      quant_solved: todayActivity?.quant_solved || 0,
      reasoning_solved: todayActivity?.reasoning_solved || 0,
    },
    heatmap,
    topic_stats: topicStats,
    recent_attempts: recentAttempts,
    difficulty_breakdown: difficultyStats,
  };
}
```

All 6 queries run in **parallel** via `Promise.all` — total response time is the slowest single query, not the sum. With proper indexes, this should return in under 500ms even with thousands of attempts.

---

## SUMMARY: Priority Fixes

### Do immediately:
1. **Daily Progress hero card** at top of dashboard (today's progress + CTA)
2. **Fix Recent Submissions bug** (dashboard not fetching data)
3. **Show accuracy as percentage** in stats (not just correct/wrong counts)
4. **Pattern display names** instead of slugs in submissions
5. **Topic accuracy section** (FREE tier — basic accuracy per topic)
6. **Quick Practice integration** on dashboard

### Do before launch:
7. **Heatmap filter by section** (Quant/Reasoning)
8. **Difficulty breakdown with accuracy** (not just solved count)
9. **Better empty states** (bookmarks, submissions)
10. **Clickable submissions** (link to question)
11. **Group re-attempts** in submission history
12. **Mobile dashboard layout** (single column, stacked sections)

### Premium features (build when payment is live):
13. **Time Analysis** (avg time by topic, speed trend over weeks)
14. **Mistake Pattern Analysis** (worst topics with recommendations)
15. **Progress Trend Charts** (accuracy and speed over time)
16. **Predicted Score** (simulated SSC CGL score from practice data)
17. **Blurred premium teasers** on free dashboard
