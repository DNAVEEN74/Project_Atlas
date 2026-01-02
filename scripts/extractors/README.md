# SSC CGL Question Extractor

Production-ready extractor for SSC CGL Previous Year Question papers.

## 📁 Files

| File | Purpose |
|------|---------|
| `extract_ssc_cgl.py` | Main extraction script |
| `OCR_SETUP_GUIDE.md` | Guide for setting up OCR (for image-based questions) |
| `EXTRACTION_GUIDE.md` | Detailed usage guide |
| `README.md` | This file |

## 🚀 Quick Start

```bash
python extract_ssc_cgl.py --pdf paper.pdf --output questions.json
```

## 📊 What Gets Extracted

| Content | Status |
|---------|--------|
| Question text | ✅ If text-based |
| 4 Options | ✅ Always |
| Correct answer | ✅ From "Chosen Option" |
| Source metadata | ✅ Exam, year, paper, filename |
| `needs_image_review` | ✅ Flag for image-based questions |

## ⚠️ Image-Based Questions

Some questions have mathematical expressions/tables as images. These are flagged with:
```json
"needs_image_review": true
```

### Options:
1. **Manual Review**: Screenshot and upload in admin panel
2. **OCR Setup**: See `OCR_SETUP_GUIDE.md` for automated extraction

## 📋 Output Schema

```json
{
  "content": {
    "text": "Question text here",
    "options": [...],
    "correct_option_id": "opt_2",
    "image": null
  },
  "source": {
    "exam": "SSC CGL 2024",
    "year": 2024,
    "paper": "Tier 1",
    "question_number": 1,
    "file_name": "SSC-CGL-Tier-1-Question-Paper-English_09.09.2024.pdf"
  },
  "needs_image_review": false,
  "is_verified": false
}
```

## 📈 Expected Results

Per paper (25 Quant questions):
- ~15 clean questions (text fully extracted)
- ~10 image-based questions (flagged for review)

## 🔧 Dependencies

```bash
pip install pdfplumber sympy
```

Optional (for OCR):
```bash
pip install pytesseract pdf2image pillow
```
