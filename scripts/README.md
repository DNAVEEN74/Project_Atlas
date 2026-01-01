# Data Extraction Scripts

This directory contains Python scripts for extracting and transforming SSC question papers into Project Atlas database format.

## Setup

1. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

## Scripts

### `extract_questions.py`
Extracts questions from SSC CGL/CHSL previous year papers and converts them to the Question schema format.

**Usage:**
```bash
# From a text file
python extract_questions.py --input paper.txt --output questions.json --exam "SSC CGL 2023" --year 2023 --paper "Tier 1 - Shift 2"

# Basic usage
python extract_questions.py --input paper.txt --output questions.json
```

**Arguments:**
- `--input`: Input file (PDF or TXT) containing questions
- `--output`: Output JSON file path
- `--exam`: Exam name (default: "SSC CGL")
- `--year`: Exam year (optional)
- `--paper`: Paper name, e.g., "Tier 1 - Shift 2" (optional)

**Expected Input Format:**
```
1. Question text here?
(A) Option A
(B) Option B
(C) Option C
(D) Option D
Answer: C

2. Next question...
```

**Output:**
JSON file with questions matching the MongoDB Question schema, including:
- Question text and options
- Correct answer marking
- Source metadata (exam, year, paper, question number)
- Default benchmarks and status

**Post-Processing Required:**
After extraction, you'll need to manually:
1. Add Pattern IDs (`p_id`) to link questions to patterns
2. Add mistake tags (`inf_tag`) to wrong options for inference
3. Set difficulty levels (EASY/MEDIUM/HARD)
4. Adjust speed benchmarks (`golden_ms`, `speed_category`)

## Workflow

1. **Extract questions** from source papers
2. **Review and validate** the JSON output
3. **Manually enrich** with pattern IDs and mistake tags
4. **Import to MongoDB** using backend API or direct insertion

---

**Note:** The extraction script provides a starting point. Real SSC papers may have varying formats and will require adjustments to the parsing logic.
