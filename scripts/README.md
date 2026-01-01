# Scripts Directory

This directory contains Python scripts for data extraction and web scraping.

## 📁 Directory Structure

```
scripts/
├── extractors/          # Question extraction scripts
│   ├── extract_ssc_cgl.py
│   └── README.md
├── scrapers/           # Web scraping scripts
│   ├── download_ssc_papers.py
│   └── README.md
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd scripts
pip install -r requirements.txt
```

### 2. Download Question Papers
```bash
cd scrapers
python download_ssc_papers.py
```

### 3. Extract Questions from PDFs
```bash
cd extractors
python extract_ssc_cgl.py --pdf "path/to/paper.pdf" --exam "SSC CGL 2024" --year 2024 --paper "Tier 1 - 09.09.2024"
```

## 📋 Available Scripts

### **Scrapers** (`scrapers/`)
- `download_ssc_papers.py` - Downloads SSC CGL papers from Adda247
- See `scrapers/README.md` for details

### **Extractors** (`extractors/`)
- `extract_ssc_cgl.py` - Extracts questions from SSC CGL PDFs
- See `extractors/README.md` for details

## 📦 Dependencies

All required packages are in `requirements.txt`:
- `beautifulsoup4` - Web scraping
- `requests` - HTTP requests
- `pdfplumber` - PDF text extraction
- `pymongo` - MongoDB integration
- `Pillow` - Image processing
- `sympy` - LaTeX conversion
- `pydantic` - Data validation

## 🔧 Adding New Scripts

### For New Scrapers:
1. Create script in `scrapers/` directory
2. Follow the pattern in `download_ssc_papers.py`
3. Update `scrapers/README.md`

### For New Extractors:
1. Create script in `extractors/` directory
2. Follow the pattern in `extract_ssc_cgl.py`
3. Update `extractors/README.md`

## 📖 Documentation

- **Scrapers Guide**: `scrapers/README.md`
- **Extractors Guide**: `extractors/README.md`
- **Extraction Guide**: `extractors/EXTRACTION_GUIDE.md`

## ⚠️ Important Notes

- Downloaded PDFs are stored in `docs/PYQs/` (not in git)
- Extracted JSON goes to project root or specified output
- Always test scripts on sample data first
- Use virtual environment for Python packages
