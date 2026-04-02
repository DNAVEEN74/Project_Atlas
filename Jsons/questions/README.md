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

## Update Rule

After each successful extraction, append the new JSON filename in the table above and update `docs/PYQs/SSC/CGL/EXTRACTION_STATUS.md` for the corresponding PDF.
