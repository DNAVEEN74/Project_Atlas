# 🎯 PrepLeague Dashboard - Complete Architecture Guide

**Version:** 1.0  
**Date:** February 13, 2026  
**Target:** Transform dashboard from stats display → action-driving practice hub  
**Implementation Time:** 48 hours over 3 weeks

---

## Executive Summary

### Current Problems
- ❌ No "what should I practice NOW?" moment
- ❌ Profile card wastes 25% of screen space
- ❌ "7/50 solved" becomes meaningless with 3000+ questions
- ❌ Statistics are flat (just numbers, no context)
- ❌ No topic-level breakdown visible
- ❌ Recent Submissions shows "No recent activity" (bug)
- ❌ Heatmap doesn't change when switching All/Quant/Reasoning tabs

### Solution Architecture
- ✅ Daily Progress Hero at top (drives immediate action)
- ✅ Single API call returns ALL dashboard data in ~100ms
- ✅ Topic Performance section (shows weak areas)
- ✅ Heatmap filters by section (Quant/Reasoning)
- ✅ Quick Practice integrated into dashboard
- ✅ Accuracy shown as % (not just counts)
- ✅ Display names for topics (not database slugs)

### Performance Impact
| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Dashboard load | Multiple queries, ~1s | Single call, ~100ms | **10x faster** |
| Data freshness | On-demand compute | Pre-computed + real-time | Always accurate |
| User to practice | 30+ seconds | <5 seconds | **6x faster** |

---

## Complete Dashboard Layout

```
┌──────────────────────────────────────────────────────────┐
│ HEADER: PrepLeague | Problems | Sprint | Games | Dashboard
│         7/50 (14%) 🔥 1 Day Streak    [Naveen ▼]         │
├──────────────────────────────────────────────────────────┤
│ ROW 1: DAILY PROGRESS HERO (Full Width) ════════════    │
│ ┌────────────────────────────────────────────────────┐  │
│ │ 📅 Today • Feb 13          🔥 1 day streak         │  │
│ │ ████████████░░░░░░░░ 12/20 questions (60%)        │  │
│ │ Quant: 8/12 ✓  Reasoning: 4/8 ⚡                  │  │
│ │ [⚡ Continue Practice →]  [🏃 Start Sprint]       │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ ROW 2: STATS + HEATMAP ═══════════════════════════════  │
│ ┌──────────────┐  ┌──────────────────────────────┐    │
│ │ 📊 Stats     │  │ 📈 Activity (365 days)        │    │
│ │ Accuracy 28% │  │ [All] [Quant] [Reasoning]     │    │
│ │ Avg Time 15s │  │ ░░▓██░▓▓▓██░░▓▓██▓▓          │    │
│ │ Solved  7/26 │  │ 3 active days • Max streak: 1 │    │
│ │ Streak 🔥 1  │  └──────────────────────────────┘    │
│ └──────────────┘                                        │
│                                                          │
│ ROW 3: TOPIC PERFORMANCE + QUICK PRACTICE ══════════   │
│ ┌─────────────────────┐  ┌──────────────────┐         │
│ │ 🎯 Topics (Quant)   │  │ ⚡ Quick Practice │         │
│ │ Percentage 5/6 83%  │  │ 8 questions left  │         │
│ │ Time Work  2/5 40%⚠│  │ Focus: Geometry   │         │
│ │ Geometry   1/4 25%⚠│  │ [Start Now →]     │         │
│ └─────────────────────┘  └──────────────────┘         │
│                                                          │
│ ROW 4: DIFFICULTY + RECENT ACTIVITY ════════════════   │
│ ┌─────────────────────┐  ┌──────────────────┐         │
│ │ 📈 Difficulty       │  │ 📝 Recent         │         │
│ │ Easy   1/16 100% ██ │  │ ✗ Mensuration 2m  │         │
│ │ Medium 6/22  50% ██ │  │ ✗ Data Interp 44s │         │
│ │ Hard   0/12   —  ░  │  │ ✓ Percentage  32s │         │
│ └─────────────────────┘  └──────────────────┘         │
└──────────────────────────────────────────────────────────┘
```

---

## API Architecture

### Single Endpoint Strategy

**ONE API call returns ALL dashboard data**

```
GET /api/user/dashboard?section=ALL

Returns in ~100ms:
- User profile & stats
- Today's progress
- 365-day heatmap
- Topic accuracy
- Recent attempts
- Difficulty breakdown
```

### Complete API Implementation

```typescript
// File: src/app/api/user/dashboard/route.ts

export async function GET(req: NextRequest) {
    const userId = await getAuthUser(req);
    const section = req.nextUrl.searchParams.get('section') || 'ALL';
    
    const today = getTodayString();
    const yearAgo = getYearAgoString();
    
    // Run ALL queries in PARALLEL
    const [user, todayActivity, heatmap, topicStats, recentAttempts, difficultyStats, patterns] = 
        await Promise.all([
            
            // 1. User (10ms)
            User.findById(userId).select('profile stats preferences config').lean(),
            
            // 2. Today's activity (15ms)
            DailyActivity.findOne({ user_id: userId, date: today }).lean(),
            
            // 3. Heatmap 365 days (50ms)
            DailyActivity.find(
                { user_id: userId, date: { $gte: yearAgo } },
                'date questions_solved quant_solved reasoning_solved'
            ).sort({ date: 1 }).lean(),
            
            // 4. Topic accuracy (100ms) ← SLOWEST
            Attempt.aggregate([
                { $match: { user_id: new ObjectId(userId) } },
                { $group: {
                    _id: { pattern: '$pattern', subject: '$subject' },
                    total: { $sum: 1 },
                    correct: { $sum: { $cond: ['$is_correct', 1, 0] } },
                    avg_time: { $avg: '$time_ms' }
                }},
                { $project: {
                    pattern: '$_id.pattern',
                    subject: '$_id.subject',
                    total: 1,
                    correct: 1,
                    accuracy: { $divide: ['$correct', '$total'] },
                    avg_time_ms: '$avg_time'
                }},
                { $sort: { accuracy: 1 } }
            ]),
            
            // 5. Recent attempts (30ms)
            Attempt.find({ user_id: userId })
                .sort({ created_at: -1 })
                .limit(10)
                .lean(),
            
            // 6. Difficulty breakdown (80ms)
            Attempt.aggregate([
                { $match: { user_id: new ObjectId(userId) } },
                { $group: {
                    _id: { difficulty: '$difficulty', subject: '$subject' },
                    total: { $sum: 1 },
                    correct: { $sum: { $cond: ['$is_correct', 1, 0] } }
                }}
            ]),
            
            // 7. Pattern display names (5ms)
            Pattern.find({}, 'code name subject').lean()
        ]);
    
    // Total time: ~100ms (limited by slowest query)
    
    // Build response...
    return NextResponse.json({ success: true, dashboard: {...} });
}
```

### Query Performance

| Query | Duration | Index Used |
|-------|----------|------------|
| User profile | 10ms | _id (primary) |
| Today's activity | 15ms | user_id + date |
| Heatmap (365 days) | 50ms | user_id + date |
| Topic accuracy | 100ms | user_id + pattern + is_correct |
| Recent attempts | 30ms | user_id + created_at |
| Difficulty stats | 80ms | user_id + difficulty |
| **Total (parallel)** | **~100ms** | ← Slowest query wins |

---

## Database Queries Detail

### Query 1: Today's Activity

```typescript
const todayActivity = await DailyActivity.findOne({
    user_id: userId,
    date: "2026-02-13"
}).lean();

// Returns:
{
    questions_solved: 12,
    questions_correct: 8,
    quant_solved: 8,
    reasoning_solved: 4,
    time_spent_ms: 180000,
    games_played: 2
}

// Used for: Daily Progress Hero
```

### Query 2: Topic Accuracy

```typescript
const topicStats = await Attempt.aggregate([
    { $match: { user_id: new ObjectId(userId) } },
    {
        $group: {
            _id: { pattern: '$pattern', subject: '$subject' },
            total: { $sum: 1 },
            correct: { $sum: { $cond: ['$is_correct', 1, 0] } },
            avg_time: { $avg: '$time_ms' }
        }
    },
    {
        $project: {
            pattern: '$_id.pattern',
            subject: '$_id.subject',
            total: 1,
            correct: 1,
            incorrect: { $subtract: ['$total', '$correct'] },
            accuracy: { $divide: ['$correct', '$total'] },
            avg_time_ms: '$avg_time'
        }
    },
    { $sort: { accuracy: 1 } }  // Worst topics first
]);

// Returns:
[
    {
        pattern: 'geometry',
        subject: 'QUANT',
        total: 4,
        correct: 1,
        incorrect: 3,
        accuracy: 0.25,  // 25%
        avg_time_ms: 45000
    },
    // ... more topics
]

// Used for: Topic Performance section
```

### Query 3: Heatmap with Section Filtering

```typescript
const heatmap = await DailyActivity.find({
    user_id: userId,
    date: { $gte: yearAgo }
}, 'date questions_solved quant_solved reasoning_solved')
.sort({ date: 1 })
.lean();

// Returns 365 days of data
// Frontend filters based on selected tab:
const value = section === 'QUANT' ? day.quant_solved 
            : section === 'REASONING' ? day.reasoning_solved 
            : day.questions_solved;

// Intensity calculation (0-4):
// 0 questions = intensity 0
// 1-2 questions = intensity 1
// 3-4 questions = intensity 2
// 5-9 questions = intensity 3
// 10+ questions = intensity 4
```

---

## Component Architecture

### 1. Daily Progress Hero

```typescript
interface DailyProgressProps {
    date: string;
    total_solved: number;
    total_correct: number;
    daily_goal: number;
    quant_goal: number;
    reasoning_goal: number;
    quant_solved: number;
    reasoning_solved: number;
    streak: number;
}

// Shows:
// - Progress bar (12/20 = 60%)
// - Subject breakdown (Quant 8/12, Reasoning 4/8)
// - Streak message
// - [Continue Practice] and [Start Sprint] CTAs
```

### 2. Topic Performance

```typescript
interface TopicStat {
    pattern: string;
    display_name: string;  // From Pattern collection
    subject: string;
    total: number;
    correct: number;
    accuracy: number;
    avg_time_ms: number;
}

// Shows:
// - Top 5 worst topics (sorted by accuracy)
// - Visual progress bars
// - Warning icons for <50% accuracy
// - [View All Topics →] link
```

### 3. Quick Practice Card

```typescript
// Shows:
// - Questions remaining (8 left)
// - Weak areas (Geometry, Time & Work)
// - [Start Practice] button
//
// On click:
// 1. Determine which subject needs practice
// 2. Get weak topics (<50% accuracy)
// 3. Create QUICK_PRACTICE session
// 4. Navigate to first question
```

### 4. Heatmap with Filtering

```typescript
// Features:
// - 365-day grid visualization
// - Tabs: [All] [Quant] [Reasoning]
// - Recalculates intensity based on selected section
// - Shows: "3 active days • Max streak: 1"
```

---

## Critical Fixes

### Fix 1: Recent Submissions Empty

**Problem:** Dashboard shows "No recent activity" even with attempts

**Root Cause:** API not returning data OR frontend not rendering

**Solution:**
```typescript
// Backend: Ensure recentAttempts are returned
const recentAttempts = await Attempt.find({ user_id: userId })
    .sort({ created_at: -1 })
    .limit(10)
    .select('pattern difficulty is_correct time_ms')
    .lean();

// Frontend: Check if data exists
{recentAttempts.length > 0 ? (
    <AttemptsList attempts={recentAttempts} />
) : (
    <EmptyState />
)}
```

### Fix 2: Topic Display Names

**Problem:** Shows "mensuration_3d" instead of "Mensuration 3D"

**Solution:**
```typescript
// Lookup Pattern collection
const patternMap = patterns.reduce((acc, p) => {
    acc[p.code] = p.name;
    return acc;
}, {});

// Apply to all topic references
const displayName = patternMap[pattern] || formatTopicName(pattern);

function formatTopicName(slug: string): string {
    return slug.split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}
```

### Fix 3: Heatmap Section Filtering

**Problem:** Heatmap stays the same for All/Quant/Reasoning tabs

**Solution:**
```typescript
// DailyActivity already has the fields
const value = section === 'QUANT' ? day.quant_solved 
            : section === 'REASONING' ? day.reasoning_solved 
            : day.questions_solved;

const intensity = calculateIntensity(value);
```

---

## Required Indexes

```typescript
// DailyActivity
DailyActivitySchema.index({ user_id: 1, date: -1 });  // Today's query
DailyActivitySchema.index({ user_id: 1, date: 1 });   // Heatmap range

// Attempt
AttemptSchema.index({ user_id: 1, created_at: -1 });   // Recent attempts
AttemptSchema.index({ user_id: 1, pattern: 1, is_correct: 1 });  // Topic stats
AttemptSchema.index({ user_id: 1, difficulty: 1, subject: 1 });  // Difficulty breakdown

// Pattern
PatternSchema.index({ code: 1 });  // Display name lookup
```

---

## Implementation Checklist

### Phase 1: API (Week 1 - 16 hours)

**Day 1-2: Core API (8h)**
- [ ] Create GET /api/user/dashboard endpoint
- [ ] Implement parallel queries with Promise.all
- [ ] Add Pattern lookup for display names
- [ ] Implement heatmap day filling
- [ ] Test with real data

**Day 3-4: Data Enhancement (8h)**
- [ ] Calculate derived stats (accuracy %, avg time)
- [ ] Filter by section (All/Quant/Reasoning)
- [ ] Add intensity calculation for heatmap
- [ ] Test performance (<500ms)

### Phase 2: Components (Week 2 - 20 hours)

**Day 1-2: Hero & Stats (6h)**
- [ ] Create DailyProgressHero component
- [ ] Update Statistics component (show %)
- [ ] Add streak messaging
- [ ] Wire up CTAs

**Day 3-4: Topics & Practice (8h)**
- [ ] Create TopicPerformance component
- [ ] Create QuickPracticeCard component
- [ ] Add weak area detection
- [ ] Implement Quick Practice flow

**Day 5-6: Heatmap & Activity (6h)**
- [ ] Update Heatmap with section filtering
- [ ] Fix RecentActivity component
- [ ] Add loading/error states
- [ ] Test all interactions

### Phase 3: Polish (Week 3 - 12 hours)

**Day 1-2: Layout (6h)**
- [ ] Compress profile card
- [ ] Implement responsive grid
- [ ] Add empty states
- [ ] Mobile optimization

**Day 3-4: Premium (6h)**
- [ ] Create PremiumTeaser component
- [ ] Add blur effects
- [ ] Test conversion tracking

**Total: 48 hours over 3 weeks**

---

## Testing Strategy

### Functional Tests
- [ ] Dashboard loads with no data (new user)
- [ ] Dashboard loads with 1 attempt
- [ ] Dashboard loads with 1000+ attempts
- [ ] Section tabs filter correctly
- [ ] Quick Practice creates session
- [ ] Recent activity shows attempts

### Performance Tests
- [ ] Dashboard loads in <500ms
- [ ] All queries use indexes
- [ ] Parallel queries work correctly
- [ ] No N+1 query problems

### Edge Cases
- [ ] User with 0 daily goal
- [ ] User with no preferences set
- [ ] Missing Pattern display names
- [ ] Heatmap with gaps in data

---

## Success Metrics

### User Engagement
- **Time to first practice** - From dashboard land to question
- **Daily goal completion** - % meeting daily target
- **Streak maintenance** - % maintaining >7 days
- **Quick Practice usage** - % starting from dashboard

### Technical Metrics
- **Dashboard load time** - <500ms target
- **API response size** - <50KB target
- **Query performance** - All queries <100ms
- **Cache hit rate** - If using Redis

---

## Summary

### What Changed

**Before:**
- Multiple API calls
- Stats without context
- No topic breakdown
- No section filtering
- No action focus

**After:**
- Single API call (~100ms)
- Stats with context (% not counts)
- Topic Performance section
- Heatmap filters by section
- Daily Progress Hero drives action

### Architecture Principles

1. **Single API call** - All data in one request
2. **Parallel queries** - Promise.all for speed
3. **Proper indexes** - <100ms aggregations
4. **Display names** - Pattern lookup
5. **Section filtering** - Quant/Reasoning everywhere
6. **Action-focused** - Hero drives practice

### Ready to Build! 🚀

**This dashboard transforms PrepLeague from a stats viewer into an action-driving practice hub for SSC CGL students.**

---

**End of Document**
