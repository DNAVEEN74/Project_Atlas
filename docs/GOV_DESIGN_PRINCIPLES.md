# Project Atlas Design Principles

This document outlines the design principles for **Project Atlas**, a practice platform for SSC CGL aspirants. The design strategy balances three key objectives:
1.  **Government Guidelines (GIGW 3.0)**: Adherence to standards for quality, accessibility, and consistency.
2.  **Exam Familiarity**: Replicating the "feel" of the official TCS iON exam interface to build candidate confidence.
3.  **Eye Comfort ( Ergonomics)**: Ensuring the UI minimizes eye strain during long practice sessions.

---

## 1. Compliance with GIGW 3.0 (Guidelines for Indian Government Websites)

**Core Tenets:**
*   **Accessibility (WCAG 2.1 AA):** The platform must be usable by all.
    *   **Contrast:** Minimum contrast ratio of 4.5:1 for text. unique interactive elements.
    *   **Navigation:** Keyboard accessible, clear focus indicators.
    *   **Responsiveness:** Mobile-first approach.
*   **Clarity:**
    *   **Language:** Simple, plain English/Hindi.
    *   **Consistency:** Uniform headers, footers, and navigation menus across the app.
*   **Identity:**
    *   Professional, trusted aesthetic. Although "modern", it should retain a sense of official seriousness.

## 2. Exam Familiarity (TCS iON Interface)

To reduce anxiety, the practice environment should subliminally verify the exam experience.

**Key Visual Cues:**
*   **Layout:**
    *   Two-column structure during practice: **Question Panel (Left)** and **Question Palette (Right)**. *Note: Recent TCS updates moved questions to the left.*
*   **Color Coding (Status Indicators):**
    *   **Green:** Answered
    *   **Red:** Not Answered
    *   **Grey:** Not Visited
    *   **Purple:** Marked for Review
*   **Terminology:** Use terms like "Save & Next", "Mark for Review", "Clear Response".
*   **Header Info:** Distinct sections for "Section Name", "Time Left", and User Profile.

## 3. Eye Comfort & Ergonomics

Users actice for hours; visual fatigue must be minimized.

**Typography:**
*   **Font:** San-serif (Inter, Roboto, or Arial). Avoid complex serifs.
*   **Size:** Minimum **16px** for body text. Ideal: 18px for question text.
*   **Line Height:** **1.5 (150%)** to allow comfortable tracking.
*   **Line Length:** **50-75 characters** per line to prevent reading fatigue.

**Color Palette & Theme:**
*   **Avoid True Black/White:**
    *   **Light Mode:** Use Off-White (`#F8FAFC` or `slate-50`) instead of pure `#FFFFFF`.
    *   **Dark Mode:** Use Dark Grey (`#121212` or `zinc-900`) instead of pure `#000000`. Pure black causes high-contrast smearing (halation) with white text.
*   **Warmer Tones:** Reduce blue-light emission by using slightly warmer, earthy neutrals rather than cold, clinical blues.
*   **Dark Mode Implementation:**
    *   Text should be off-white / light-grey (`#E2E8F0`), not pure white, to reduce glare.
    *   Surfaces should use elevation overlay (lighter grays) rather than just borders.

---

## 4. "LeetCode-style" Home Page Design

The main landing page (Problem List) needs to merge these worlds.

**Layout:**
*   **Data Grid:** clean table/list view of questions.
*   **Right Rail:** Statistics (Problems Solved, Accuracy, Streak) - creates motivation.

**Aesthetic:**
*   **Modern Professional:** Use Shadcn UI / Geometrical cleanliness.
*   **Subtle "Exam" Accents:** Use the specific Exam Greens/Reds for status badges (Solved, Attempted) to build that association.

**Columns:**
1.  **Status:** (Icon: Checkmark/Circle) - utilizing the "Exam Green" for solved.
2.  **Title:** Truncated question text or Pattern Name (e.g., "Geometry: Circle Tangents").
3.  **Difficulty:** Badge (Easy/Medium/Hard).
4.  **Source:** Tag (e.g., "SSC CGL 2024").
5.  **Action:** "Solve" button.

---

## 5. Implementation Rules
*   Use `Tailwind CSS` for all styling.
*   Use `Shadcn UI` for base components (Tables, Badges, Cards).
*   Ensure every interactive element has an `aria-label`.
*   Support a standardized `ThemeToggle` (Light/Dark/System).
