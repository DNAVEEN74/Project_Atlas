# JSON Extraction Tracker

This file tracks extracted JSONs from `docs/PYQs/SSC/CGL/2024` and duplicate cleanup decisions.

## Current Extracted JSONs (2024)

| JSON File | Subject | Source Date | Shift Slot | Questions | Status |
|---|---|---|---|---:|---|
| ssc_cgl_quant_25_09_2024_12_30pm.json | QUANT | 25.09.2024 | 12_30pm | 25 | Completed |
| ssc_cgl_reasoning_25_09_2024_12_30pm.json | REASONING | 25.09.2024 | 12_30pm | 25 | Completed |
| ssc_cgl_quant_25_09_2024_4pm.json | QUANT | 25.09.2024 | 4pm | 25 | Completed |
| ssc_cgl_reasoning_25_09_2024_4pm.json | REASONING | 25.09.2024 | 4pm | 25 | Completed |
| ssc_cgl_quant_25_09_2024_9am.json | QUANT | 25.09.2024 | 9am | 19 | Completed |
| ssc_cgl_reasoning_25_09_2024_9am.json | REASONING | 25.09.2024 | 9am | 25 | Completed |
| ssc_cgl_quant_26_09_2024_12_30pm.json | QUANT | 26.09.2024 | 12_30pm | 25 | Completed |
| ssc_cgl_reasoning_26_09_2024_12_30pm.json | REASONING | 26.09.2024 | 12_30pm | 25 | Completed |
| ssc_cgl_quant_26_09_2024_4pm.json | QUANT | 26.09.2024 | 4pm | 25 | Completed |
| ssc_cgl_reasoning_26_09_2024_4pm.json | REASONING | 26.09.2024 | 4pm | 25 | Completed |
| ssc_cgl_quant_26_09_2024_9am.json | QUANT | 26.09.2024 | 9am | 19 | Completed |
| ssc_cgl_reasoning_26_09_2024_9am.json | REASONING | 26.09.2024 | 9am | 24 | Completed |

## Duplicate Cleanup Log

- Removed file duplicate (kept richer file):
  - Removed: `ssc_cgl_reasoning_26_09_2024_9am_complete.json`
  - Kept: `ssc_cgl_reasoning_26_09_2024_9am.json` (more questions and more solution content).
- Removed repeated question entries inside JSONs (kept entry with longer solution text):
  - `ssc_cgl_quant_25_09_2024_9am.json`: removed 6 duplicate question entries (25 -> 19).
  - `ssc_cgl_quant_26_09_2024_9am.json`: removed 6 duplicate question entries (25 -> 19).
  - `ssc_cgl_reasoning_26_09_2024_9am.json`: removed 1 duplicate question entry (25 -> 24).

## Database Import Status (MongoDB)

Last sync: `2026-04-02`

- Import script used: `scripts/import_questions_auto_increment.ts`
- Duplicate-safe behavior: skips questions already present in DB by `(subject, source.shift, normalized text)`.
- Current DB totals after sync:
  - `questions` collection total: `277`
  - 2024 questions total: `277`

| JSON File | Subject | File Questions | Valid For Import | In DB | DB Status | Notes |
|---|---|---:|---:|---:|---|---|
| ssc_cgl_quant_25_09_2024_12_30pm.json | QUANT | 25 | 25 | 25 | IN_DB | Fully synced |
| ssc_cgl_quant_25_09_2024_4pm.json | QUANT | 25 | 25 | 25 | IN_DB | Fully synced |
| ssc_cgl_quant_25_09_2024_9am.json | QUANT | 19 | 13 | 13 | IN_DB | 6 rows invalid in JSON (missing/invalid required fields) |
| ssc_cgl_quant_26_09_2024_12_30pm.json | QUANT | 25 | 25 | 25 | IN_DB | Fully synced |
| ssc_cgl_quant_26_09_2024_4pm.json | QUANT | 25 | 25 | 25 | IN_DB | Fully synced |
| ssc_cgl_quant_26_09_2024_9am.json | QUANT | 19 | 15 | 15 | IN_DB | 4 rows invalid in JSON (missing/invalid required fields) |
| ssc_cgl_reasoning_25_09_2024_12_30pm.json | REASONING | 25 | 25 | 25 | IN_DB | Fully synced |
| ssc_cgl_reasoning_25_09_2024_4pm.json | REASONING | 25 | 25 | 25 | IN_DB | Fully synced |
| ssc_cgl_reasoning_25_09_2024_9am.json | REASONING | 25 | 25 | 25 | IN_DB | Fully synced |
| ssc_cgl_reasoning_26_09_2024_12_30pm.json | REASONING | 25 | 25 | 25 | IN_DB | Fully synced |
| ssc_cgl_reasoning_26_09_2024_4pm.json | REASONING | 25 | 25 | 25 | IN_DB | Fully synced |
| ssc_cgl_reasoning_26_09_2024_9am.json | REASONING | 24 | 24 | 24 | IN_DB | Fully synced |

## Update Rule

After each successful extraction:

1. Append/update the JSON row in the extraction table above.
2. Update `docs/PYQs/SSC/CGL/EXTRACTION_STATUS.md` for the corresponding PDF.
3. Push to DB using:
   - `npx.cmd tsx scripts/import_questions_auto_increment.ts Jsons/questions/2024`
4. Update the **Database Import Status (MongoDB)** table so duplicate push can be avoided later.
