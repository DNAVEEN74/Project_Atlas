#!/usr/bin/env python3
"""
SSC CGL Production Extractor v6
Extracts REASONING and QUANT sections (50 questions per paper)
- Properly handles text and image-based questions
- Flags questions needing image upload for admin panel
- Correct option extraction and answer detection
"""

import re
import json
import argparse
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Optional

import pdfplumber

# Section configuration
SECTIONS = {
    'REASONING': {
        'header': 'Section : General Intelligence and Reasoning',
        'alt_headers': ['General Intelligence', 'Reasoning'],
        'page_hint': (0, 12)  # Pages 1-12
    },
    'QUANT': {
        'header': 'Section : Quantitative Aptitude',
        'alt_headers': ['Quantitative Aptitude'],
        'page_hint': (18, 28)  # Pages 19-28
    }
}

@dataclass
class QuestionOption:
    id: str
    text: str
    is_correct: bool = False
    inf_tag: Optional[str] = None
    image: Optional[str] = None  # Media ID for image options

@dataclass
class QuestionContent:
    text: str
    options: List[QuestionOption] = field(default_factory=list)
    correct_option_id: str = ""
    image: Optional[str] = None  # Media ID for main question image

@dataclass 
class QuestionSource:
    exam: str
    year: int
    paper: str
    section: str  # REASONING or QUANT
    question_number: int
    file_name: str

@dataclass
class QuestionBenchmarks:
    golden_ms: int = 60000
    shortcut_expected: bool = False
    brute_force_acceptable: bool = True
    speed_category: str = "STANDARD"

@dataclass
class Question:
    content: QuestionContent
    source: QuestionSource
    status: str = "COLD"
    difficulty: str = "MEDIUM"
    benchmarks: QuestionBenchmarks = field(default_factory=QuestionBenchmarks)
    p_id: Optional[str] = None
    needs_image_review: bool = False
    is_verified: bool = False
    version: int = 1
    import_batch: str = ""

class LatexConverter:
    """Convert common math notation to LaTeX"""
    def convert(self, text: str) -> str:
        if not text:
            return text
        # Fractions
        text = re.sub(r'(\d+)/(\d+)', r'\\frac{\1}{\2}', text)
        # Percent
        text = text.replace('%', '\\%')
        # Square root
        text = re.sub(r'√(\d+)', r'\\sqrt{\1}', text)
        text = re.sub(r'√\(([^)]+)\)', r'\\sqrt{\1}', text)
        return text

class SSCExtractor:
    def __init__(self, pdf_path: str, exam: str, year: int, paper: str):
        self.pdf_path = pdf_path
        self.exam = exam
        self.year = year
        self.paper = paper
        self.file_name = Path(pdf_path).name
        self.latex = LatexConverter()
        self.import_batch = f"SSC-CGL-{year}_{paper.replace(' ', '-')}"
    
    def extract(self) -> List[Question]:
        """Extract questions from REASONING and QUANT sections"""
        print(f"📄 PDF: {self.file_name}")
        
        all_questions = []
        
        with pdfplumber.open(self.pdf_path) as pdf:
            # Build full text with page markers
            full_text = ""
            for i, page in enumerate(pdf.pages):
                full_text += f"\n---PAGE_{i+1}---\n"
                full_text += (page.extract_text() or "")
            
            for section_name, section_info in SECTIONS.items():
                section_qs = self._extract_section(full_text, section_name, section_info)
                all_questions.extend(section_qs)
                
                clean = sum(1 for q in section_qs if not q.needs_image_review)
                review = len(section_qs) - clean
                print(f"   ✅ {section_name}: {len(section_qs)} questions ({clean} clean, {review} need images)")
        
        print(f"📊 Total: {len(all_questions)} questions")
        return all_questions
    
    def _extract_section(self, full_text: str, section_name: str, section_info: dict) -> List[Question]:
        """Extract questions from a specific section"""
        # Find section start
        section_start = full_text.find(section_info['header'])
        
        if section_start == -1:
            for alt in section_info['alt_headers']:
                pattern = rf'Section\s*:\s*{alt}'
                match = re.search(pattern, full_text, re.IGNORECASE)
                if match:
                    section_start = match.start()
                    break
        
        if section_start == -1:
            print(f"   ⚠️ {section_name} section not found!")
            return []
        
        section_text = full_text[section_start:]
        
        # Cut at next section
        for other_name, other_info in SECTIONS.items():
            if other_name != section_name:
                end_pos = section_text.find(other_info['header'])
                if end_pos > 0:
                    section_text = section_text[:end_pos]
        
        # Also cut at General Awareness or English
        for skip_section in ['General Awareness', 'English Comprehension']:
            skip_pos = section_text.find(f'Section : {skip_section}')
            if skip_pos > 0:
                section_text = section_text[:skip_pos]
        
        return self._parse_questions(section_text, section_name)
    
    def _parse_questions(self, section_text: str, section_name: str) -> List[Question]:
        """Parse Q.1 to Q.25 from section"""
        questions = []
        
        # Find all Q.X patterns
        pattern = r'Q\.(\d+)\s+(.+?)(?=Q\.\d+\s|---PAGE|$)'
        matches = list(re.finditer(pattern, section_text, re.DOTALL))
        
        for match in matches:
            q_num = int(match.group(1))
            if q_num > 25:
                continue
            
            q_block = match.group(2)
            question = self._parse_question(q_block, q_num, section_name)
            if question:
                questions.append(question)
        
        return questions
    
    def _parse_question(self, block: str, q_num: int, section_name: str) -> Optional[Question]:
        """Parse a single question block"""
        # Clean metadata junk
        block_clean = re.sub(r'Question ID\s*:\s*\d+', '', block)
        block_clean = re.sub(r'Option \d+ ID\s*:\s*\d+', '', block_clean)
        block_clean = re.sub(r'Status\s*:\s*\w+', '', block_clean)
        
        # Get question text (before Ans)
        ans_match = re.search(r'Ans\s+1\.', block_clean)
        if ans_match:
            question_text = block_clean[:ans_match.start()].strip()
        else:
            # Try alternate pattern for image-option questions
            alt_match = re.search(r'Ans\s*\n\s*1\.', block_clean)
            if alt_match:
                question_text = block_clean[:alt_match.start()].strip()
            else:
                question_text = ""
        
        # Clean question text
        question_text = re.sub(r'\s+', ' ', question_text).strip()
        question_text = re.sub(r'---PAGE_\d+---', '', question_text).strip()
        
        # Determine if question needs image
        needs_question_image = False
        if len(question_text) < 15:
            needs_question_image = True
        if "figure" in question_text.lower() or "diagram" in question_text.lower():
            needs_question_image = True
        if question_text.endswith(":") or question_text.endswith("is"):
            needs_question_image = True
        
        # Extract options
        options, options_are_images = self._extract_options(block_clean)
        
        # Get correct answer
        correct_num = 1
        chosen_match = re.search(r'Chosen Option\s*:\s*(\d)', block)
        if chosen_match:
            correct_num = int(chosen_match.group(1))
        
        # Mark correct option
        if 1 <= correct_num <= len(options):
            options[correct_num - 1].is_correct = True
        
        # Determine if needs review (question image OR option images)
        needs_review = needs_question_image or options_are_images
        
        # For image-based questions, add placeholder
        if needs_question_image and len(question_text) < 15:
            question_text = "[IMAGE REQUIRED - Upload question image]"
        
        return Question(
            content=QuestionContent(
                text=self.latex.convert(question_text),
                options=options,
                correct_option_id=f"opt_{correct_num}",
                image=None  # To be uploaded via admin panel
            ),
            source=QuestionSource(
                exam=self.exam,
                year=self.year,
                paper=self.paper,
                section=section_name,
                question_number=q_num,
                file_name=self.file_name
            ),
            benchmarks=QuestionBenchmarks(),
            needs_image_review=needs_review,
            import_batch=self.import_batch
        )
    
    def _extract_options(self, block: str) -> tuple[List[QuestionOption], bool]:
        """Extract 4 options. Returns (options, are_images)"""
        options = []
        are_images = False
        
        # Pattern 1: "Ans 1. text 2. text 3. text 4. text"
        full_pattern = r'Ans\s+1\.\s*(.+?)\s+2\.\s*(.+?)\s+3\.\s*(.+?)\s+4\.\s*(.+?)(?=\nQuestion ID|Chosen|$)'
        match = re.search(full_pattern, block, re.DOTALL)
        
        if match:
            for i in range(1, 5):
                opt_text = match.group(i).strip()
                opt_text = opt_text.split('\n')[0].strip()
                opt_text = re.sub(r'---PAGE_\d+---', '', opt_text).strip()
                
                if opt_text:
                    options.append(QuestionOption(
                        id=f"opt_{i}",
                        text=self.latex.convert(opt_text)
                    ))
        
        # Pattern 2: Image options - "Ans\n1.\n2.\n3.\n4."
        if len(options) < 4:
            img_pattern = r'Ans\s*\n\s*1\.\s*\n\s*2\.\s*\n\s*3\.\s*\n\s*4\.'
            if re.search(img_pattern, block):
                are_images = True
                options = []
                for i in range(1, 5):
                    options.append(QuestionOption(
                        id=f"opt_{i}",
                        text="[IMAGE OPTION - Upload option image]",
                        image=None  # To be uploaded via admin
                    ))
        
        # Ensure 4 options
        while len(options) < 4:
            options.append(QuestionOption(
                id=f"opt_{len(options)+1}",
                text="[Missing - Verify in PDF]"
            ))
        
        return options[:4], are_images

def question_to_dict(q: Question) -> dict:
    """Convert Question to JSON-serializable dict"""
    return {
        "content": {
            "text": q.content.text,
            "options": [
                {
                    "id": o.id,
                    "text": o.text,
                    "is_correct": o.is_correct,
                    "inf_tag": o.inf_tag,
                    "image": o.image
                }
                for o in q.content.options
            ],
            "correct_option_id": q.content.correct_option_id,
            "image": q.content.image
        },
        "source": {
            "exam": q.source.exam,
            "year": q.source.year,
            "paper": q.source.paper,
            "section": q.source.section,
            "question_number": q.source.question_number,
            "file_name": q.source.file_name
        },
        "status": q.status,
        "difficulty": q.difficulty,
        "benchmarks": {
            "golden_ms": q.benchmarks.golden_ms,
            "shortcut_expected": q.benchmarks.shortcut_expected,
            "brute_force_acceptable": q.benchmarks.brute_force_acceptable,
            "speed_category": q.benchmarks.speed_category
        },
        "p_id": q.p_id,
        "needs_image_review": q.needs_image_review,
        "is_verified": q.is_verified,
        "version": q.version,
        "import_batch": q.import_batch
    }

def main():
    parser = argparse.ArgumentParser(description='SSC CGL Extractor (REASONING + QUANT)')
    parser.add_argument('--pdf', required=True, help='PDF file path')
    parser.add_argument('--output', required=True, help='Output JSON file')
    args = parser.parse_args()
    
    print("=" * 60)
    print("SSC CGL EXTRACTOR v6 (REASONING + QUANT)")
    print("=" * 60)
    
    extractor = SSCExtractor(args.pdf, "SSC CGL 2024", 2024, "Tier 1")
    questions = extractor.extract()
    
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump([question_to_dict(q) for q in questions], f, indent=2, ensure_ascii=False)
    
    # Summary
    clean = sum(1 for q in questions if not q.needs_image_review)
    review = len(questions) - clean
    
    print(f"\n✅ Saved to {args.output}")
    print(f"   Clean: {clean} | Need Images: {review}")

if __name__ == "__main__":
    main()
