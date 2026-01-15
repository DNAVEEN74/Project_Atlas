# Implementation Plan - Problems Dashboard

This plan outlines the creation of the main "Home" page for authenticated users, located at `/problems`. This page will function similarly to a "Problem List" (like LeetCode) but tailored for SSC CGL aspirants, adhering to the design principles we established (GIGW compliance, Exam Familiarity, Eye Comfort).

## Proposed Changes

### 1. Database & API
Need a way to fetch questions for the grid.
#### [NEW] [route.ts](file:///c:/Users/brothers/Desktop/PROJECT%20ATLAS/project/src/app/api/questions/route.ts)
- GET endpoint to fetch paginated questions.
- Supports filtering by `section` (Quant/Reasoning), `difficulty`, and `status`.
- Returns lightweight payload (just metadata, not full content) for the table.

### 2. UI Components
Missing standard UI components will be created using Tailwind and the existing design system variables.
#### [NEW] [badge.tsx](file:///c:/Users/brothers/Desktop/PROJECT%20ATLAS/project/src/components/ui/badge.tsx)
- Simple badge component for Difficulty (Easy/Medium/Hard) and Status.
#### [NEW] [card.tsx](file:///c:/Users/brothers/Desktop/PROJECT%20ATLAS/project/src/components/ui/card.tsx)
- Standard card container for layout sections.
#### [NEW] [calendar.tsx](file:///c:/Users/brothers/Desktop/PROJECT%20ATLAS/project/src/components/ui/calendar.tsx)
- Simple visual calendar for the "Study Streak".

### 3. Page Implementation
#### [NEW] [page.tsx](file:///c:/Users/brothers/Desktop/PROJECT%20ATLAS/project/src/app/problems/page.tsx)
- **Layout**: Two-column grid (Main Content + Sidebar).
    - **Main Area**: Problem Table with filters.
    - **Sidebar**:
        - **Study Streak Calendar**: Visualizing daily activity.
        - **Exam Countdown**: Days remaining for "Target CGL 2024".
        - **Daily Challenge**: "Pattern of the Day".
