# Question Extractors

Scripts for extracting questions from PDF papers into structured JSON format.

## 📄 Available Extractors

### 1. SSC CGL Extractor (`extract_ssc_cgl.py`)

Extracts questions from SSC CGL Tier-1 PDFs with LaTeX conversion and validation.

**Usage:**
```bash
python extract_ssc_cgl.py \
  --pdf "../../docs/PYQs/SSC/CGL/2024/SSC-CGL-Tier-1-Question-Paper-English_09.09.2024_9.00-AM-10.00-AM.pdf" \
  --exam "SSC CGL 2024" \
  --year 2024 \
  --paper "Tier 1 - 09.09.2024 - 9:00 AM" \
  --output "ssc_cgl_2024_sept9_morning.json"
```

**Features:**
- ✅ 3rd Q.1 detection (finds Quant section automatically)
- ✅ Checkmark answer detection (✓ symbol)
- ✅ LaTeX conversion for math (SymPy + regex)
- ✅ Multi-line option support
- ✅ Comprehensive validation (25 questions, 4 options, 1 correct)
- ✅ Auto-generated import batch ID

**Output Format:**
```json
[
  {
    "content": {
      "text": "If $x^2 + y^2 = 25$, find x",
      "correct_option_id": "opt_2",
      "options": [...]
    },
    "metadata": {
      "source_exam": "SSC CGL 2024",
      "year": 2024,
      "original_paper": "Tier 1 - 09.09.2024 - 9:00 AM",
      "question_number": 1
    },
    "benchmarks": {...},
    "is_verified": false,
    "version": 1,
    "import_batch": "SSC-CGL-2024_2024_Tier-1"
  }
]
```

**See**: `EXTRACTION_GUIDE.md` for detailed documentation

---

## 🔧 Creating New Extractors

### Template Structure:

```python
#!/usr/bin/env python3
"""
[Exam Name] Question Extractor
Extracts questions from [Exam] PDFs
"""

import pdfplumber
import re
import json
from typing import List, Dict
from dataclasses import dataclass

@dataclass
class Question:
    text: str
    options: List[str]
    correct_answer: int
    metadata: Dict

class QuestionExtractor:
    def __init__(self, pdf_path: str):
        self.pdf_path = pdf_path
    
    def extract_text(self) -> str:
        with pdfplumber.open(self.pdf_path) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text()
        return text
    
    def find_section(self, text: str) -> str:
        # Implement section detection logic
        pass
    
    def parse_questions(self, section_text: str) -> List[Question]:
        # Implement question parsing logic
        pass
    
    def validate(self, questions: List[Question]):
        # Implement validation logic
        pass
    
    def extract(self) -> List[Question]:
        text = self.extract_text()
        section = self.find_section(text)
        questions = self.parse_questions(section)
        self.validate(questions)
        return questions

if __name__ == "__main__":
    extractor = QuestionExtractor(pdf_path)
    questions = extractor.extract()
```

### Key Components:

1. **Section Detection**
   - Find the relevant section (e.g., Quant, Reasoning)
   - Use patterns like "Q.1" occurrences
   - Validate section boundaries

2. **Question Parsing**
   - Extract question text
   - Parse options (usually (1), (2), (3), (4))
   - Detect correct answer (checkmarks, colors)

3. **LaTeX Conversion**
   - Convert math symbols (√, ², ³, π)
   - Handle fractions, operators
   - Use SymPy for complex expressions

4. **Validation**
   - Check question count
   - Verify option count (usually 4)
   - Ensure exactly 1 correct answer
   - Validate LaTeX syntax

---

## 📋 Adding New Exam Extractors

### Example: UPSC Prelims

1. **Analyze PDF Structure**
   ```python
   # Open sample PDF
   # Check question format
   # Identify section markers
   # Note answer indicators
   ```

2. **Create Extractor**:
   ```bash
   cp extract_ssc_cgl.py extract_upsc_prelims.py
   ```

3. **Customize Logic**:
   - Update section detection
   - Modify question parsing
   - Adjust validation rules

4. **Test Thoroughly**:
   ```bash
   python extract_upsc_prelims.py --pdf sample.pdf
   # Verify output JSON
   # Check all 100 questions extracted
   # Validate answers
   ```

5. **Document**:
   - Add to this README
   - Create usage examples
   - Note any limitations

---

## 🎯 Extraction Accuracy Tips

### Improve Section Detection:
- Use multiple markers (headers, page numbers)
- Validate with question count
- Handle edge cases (missing sections)

### Better Answer Detection:
- Look for multiple indicators (✓, ✔, colors)
- Cross-reference with answer key if available
- Flag uncertain answers for manual review

### LaTeX Quality:
- Test on sample questions first
- Handle edge cases (nested fractions, matrices)
- Provide fallback for complex expressions

### Validation:
- Count questions, options
- Check for duplicates
- Verify metadata completeness

---

## 📊 Workflow

```
1. Download PDFs (using scrapers)
   ↓
2. Extract questions (using extractors)
   ↓
3. Review JSON output
   ↓
4. Import to MongoDB
   ↓
5. Manual review in admin panel
   ↓
6. Mark as verified
   ↓
7. Ready for practice mode!
```

---

## ⚠️ Known Limitations

1. **Images**: Not extracted automatically (manual upload needed)
2. **Tables**: Complex tables may need manual entry
3. **Complex Math**: Very complex equations may need LaTeX correction
4. **Handwritten**: Only works with typed PDFs

**Solution**: Use admin review panel to fix these manually

---

## 🐛 Troubleshooting

**"Could not find 3 sections"**
- PDF structure is different
- Adjust section detection logic
- Check Q.1 occurrences manually

**"No correct answer detected"**
- Checkmark symbols not in PDF
- Try different answer indicators
- Manual review needed

**"LaTeX conversion failed"**
- Complex expression
- Review and edit in admin panel
- Add to LaTeX converter patterns

---

## 📚 Resources

- pdfplumber docs: https://github.com/jsvine/pdfplumber
- SymPy docs: https://docs.sympy.org/
- LaTeX reference: https://www.overleaf.com/learn
- Regex tester: https://regex101.com/
