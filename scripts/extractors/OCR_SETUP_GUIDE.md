# OCR Setup Guide for Image-Based Question Extraction

This guide explains how to set up OCR (Optical Character Recognition) to extract text from image-based questions in SSC CGL PDFs.

## 📋 Why OCR is Needed

Some SSC CGL question papers have questions rendered as **images** rather than selectable text. This happens for:
- Mathematical formulas and equations
- Tables embedded as images
- Diagrams with text labels

Regular PDF extraction (pdfplumber/pymupdf) **cannot read text from images**. OCR solves this by "reading" the image pixels.

---

## 🔧 Installation Steps (Windows)

### Step 1: Install Tesseract OCR

1. Download Tesseract from: https://github.com/UB-Mannheim/tesseract/wiki
   - Get the latest Windows installer (64-bit)
   
2. Run the installer
   - Default path: `C:\Program Files\Tesseract-OCR`
   - **Important**: Check "Add to PATH" during installation
   
3. Verify installation:
   ```powershell
   tesseract --version
   ```

### Step 2: Install Poppler (for pdf2image)

1. Download Poppler from: https://github.com/osber/pdf2image/blob/master/docs/installing-poppler.md
   - Or: https://github.com/oschwartz10612/poppler-windows/releases
   
2. Extract to: `C:\Program Files\poppler`

3. Add to PATH:
   ```powershell
   $env:Path += ";C:\Program Files\poppler\Library\bin"
   ```

### Step 3: Install Python Dependencies

```bash
pip install pytesseract pdf2image pillow
```

---

## 🚀 Usage with Extractor

Once OCR is set up, update the extractor to use OCR for image-based questions:

```python
import pytesseract
from pdf2image import convert_from_path
from PIL import Image

# Set Tesseract path if not in PATH
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_with_ocr(pdf_path, page_num):
    """Convert PDF page to image and OCR it"""
    # Convert specific page to image
    images = convert_from_path(pdf_path, first_page=page_num, last_page=page_num)
    
    if images:
        # OCR the image
        text = pytesseract.image_to_string(images[0])
        return text
    return ""
```

---

## 📝 Enhanced Extraction Flow

1. **First Pass**: Use pdfplumber to extract text
2. **Detect Missing Text**: If question text is empty/short
3. **Second Pass**: Use OCR on that page/region
4. **Merge Results**: Combine OCR text with extracted options

---

## ⚡ Quick Test

```python
# test_ocr.py
import pytesseract
from PIL import Image

# Test with a sample image
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Create a simple test
print("Tesseract version:", pytesseract.get_tesseract_version())
print("OCR is working!")
```

---

## 🎯 Command to Run OCR-Enhanced Extraction

After setup, run:

```bash
python extractors/extract_ssc_cgl_ocr.py --pdf paper.pdf --output questions.json
```

---

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| `tesseract is not installed` | Add Tesseract to PATH or set path in code |
| `poppler not found` | Install Poppler and add to PATH |
| Poor OCR accuracy | Try higher DPI in pdf2image (dpi=300) |
| Slow extraction | OCR is CPU-intensive, expect 2-3 sec/page |

---

## 📊 Expected Results After OCR Setup

- **Before OCR**: ~60% questions extracted (15/25 per paper)
- **After OCR**: ~95% questions extracted (24/25 per paper)
- **Still Manual**: Complex diagrams, handwritten text

---

## 🔮 Future Enhancement

Create `extract_ssc_cgl_ocr.py` that:
1. Inherits from current extractor
2. Adds OCR fallback for image questions
3. Uses region detection to OCR only question areas (faster)
