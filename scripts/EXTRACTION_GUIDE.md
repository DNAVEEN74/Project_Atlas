# SSC CGL Question Extraction - Complete Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd scripts
pip install -r requirements.txt
```

### 2. Run Extraction
```bash
python extract_ssc_cgl.py \
  --pdf "PYQs/SSC/CGL/SSC-CGL-Tier-1-Question-Paper-English_09.09.2024_9.00-AM-10.00-AM.pdf" \
  --exam "SSC CGL 2024" \
  --year 2024 \
  --paper "Tier 1 - 09.09.2024 - 9:00 AM" \
  --output "ssc_cgl_2024_tier1_shift1.json"
```

### 3. Import to MongoDB
```bash
# Using mongoimport
mongoimport --db project_atlas --collection questions --file ssc_cgl_2024_tier1_shift1.json --jsonArray

# Or use the import script (coming soon)
```

### 4. Review in Admin Panel
1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/admin/review`
3. Review each question
4. Click "Verified" when done

---

## 📋 Features

### ✅ Automatic Detection
- **Section Detection**: Finds 3rd occurrence of Q.1 (Quant section)
- **Answer Detection**: Detects ✓ checkmarks for correct answers
- **Validation**: Ensures exactly 25 questions, 4 options each, 1 correct answer

### ✅ LaTeX Conversion
- **SymPy Integration**: Converts math expressions automatically
- **Symbol Support**: √, ², ³, π, ×, ÷, ≥, ≤, etc.
- **Fallback Regex**: Pattern matching for complex cases

### ✅ Data Quality
- **Comprehensive Validation**: Question count, numbering, options
- **Error Reporting**: Warns about issues but continues extraction
- **JSON Output**: Matches MongoDB Question schema perfectly

---

## 🔧 Command Line Options

```bash
python extract_ssc_cgl.py [OPTIONS]

Required:
  --pdf PATH          Path to SSC CGL PDF file
  --exam TEXT         Exam name (e.g., "SSC CGL 2024")
  --year INT          Exam year (e.g., 2024)
  --paper TEXT        Paper details (e.g., "Tier 1 - 09.09.2024 - 9:00 AM")

Optional:
  --output PATH       Output JSON file (default: questions.json)
```

---

## 📊 Output Format

```json
[
  {
    "p_id": null,
    "status": "COLD",
    "difficulty": "MEDIUM",
    "content": {
      "text": "If $x^2 + y^2 = 25$, find x",
      "correct_option_id": "opt_2",
      "options": [
        {
          "id": "opt_1",
          "text": "3",
          "is_correct": false,
          "inf_tag": null,
          "media_id": null
        },
        {
          "id": "opt_2",
          "text": "5",
          "is_correct": true,
          "inf_tag": null,
          "media_id": null
        }
      ],
      "has_diagram": false,
      "has_table": false
    },
    "metadata": {
      "source_exam": "SSC CGL 2024",
      "year": 2024,
      "original_paper": "Tier 1 - 09.09.2024 - 9:00 AM",
      "question_number": 1
    },
    "media_ids": [],
    "is_verified": false,
    "version": 1,
    "import_batch": null
  }
]
```

---

## ⚠️ Known Limitations

1. **Images**: Not extracted yet (manual upload in admin panel)
2. **Complex Math**: May need manual LaTeX correction
3. **Tables**: Not extracted (manual entry required)

---

## 🔄 Workflow

```
1. Extract PDF
   ↓
2. Review JSON output
   ↓
3. Import to MongoDB
   ↓
4. Open /admin/review
   ↓
5. Verify each question
   ↓
6. Mark as verified
   ↓
7. Ready for practice mode!
```

---

## 🐛 Troubleshooting

### "Could not find 3 sections"
- PDF structure is different
- Manually check where Quant section starts
- May need to adjust detection logic

### "No correct answer detected"
- Checkmark symbols not in PDF
- Manually mark correct answer in admin panel

### "LaTeX conversion failed"
- Complex math expression
- Review and edit in admin panel

---

## 💡 Tips

1. **Batch Processing**: Extract all papers, then review together
2. **Naming Convention**: Use consistent file names (exam_year_tier_shift.json)
3. **Backup**: Keep original PDFs and JSON files
4. **Version Control**: Git commit after each verified batch

---

**Total Cost: $0** - 100% free, offline extraction! 🎉
