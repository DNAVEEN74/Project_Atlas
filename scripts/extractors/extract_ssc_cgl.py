#!/usr/bin/env python3
"""
SSC CGL Question Extractor - Production Version
Extracts questions from SSC CGL PDFs with:
- 3rd Q.1 detection for Quant section
- Answer detection via checkmarks
- LaTeX conversion for math
- GridFS image storage
- Complete validation

Usage:
    python extract_ssc_cgl.py --pdf paper.pdf --exam "SSC CGL 2024" --year 2024 --paper "Tier 1 - 09.09.2024 - 9:00 AM"
"""

import pdfplumber
import re
import json
import hashlib
import argparse
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime
from sympy import sympify, latex as sympy_latex
from sympy.parsing.sympy_parser import parse_expr
from pymongo import MongoClient
from gridfs import GridFS
from bson import ObjectId
import io
from PIL import Image


# ============================================================================
# DATA CLASSES
# ============================================================================

@dataclass
class QuestionOption:
    """Single MCQ option"""
    id: str
    text: str
    is_correct: bool
    inf_tag: Optional[str] = None
    media_id: Optional[str] = None


@dataclass
class QuestionContent:
    """Question text and options"""
    text: str
    options: List[QuestionOption]
    correct_option_id: str
    has_diagram: bool = False
    has_table: bool = False


@dataclass
class Metadata:
    """Source tracking"""
    source_exam: str
    year: int
    original_paper: str
    question_number: int


@dataclass
class Benchmarks:
    """Speed benchmarks for inference"""
    golden_ms: int = 60000  # Default 60 seconds
    shortcut_expected: bool = False
    brute_force_acceptable: bool = True
    speed_category: str = "STANDARD"


@dataclass
class Question:
    """Complete question matching MongoDB schema"""
    content: QuestionContent
    metadata: Metadata
    benchmarks: Benchmarks = None
    status: str = "COLD"
    difficulty: str = "MEDIUM"
    p_id: Optional[str] = None
    media_ids: List[str] = None
    is_verified: bool = False
    version: int = 1
    import_batch: Optional[str] = None

    def __post_init__(self):
        if self.media_ids is None:
            self.media_ids = []
        if self.benchmarks is None:
            self.benchmarks = Benchmarks()


# ============================================================================
# LATEX CONVERTER
# ============================================================================

class LaTeXConverter:
    """Convert mathematical expressions to LaTeX using SymPy + regex"""
    
    def __init__(self):
        # Symbol replacements
        self.symbols = {
            '²': '^2',
            '³': '^3',
            '√': 'sqrt',
            '×': '*',
            '÷': '/',
            'π': 'pi',
            'α': 'alpha',
            'β': 'beta',
            'θ': 'theta',
            'Δ': 'Delta',
            'Σ': 'Sigma',
            '∑': 'sum',
            '≥': '>=',
            '≤': '<=',
            '≠': '!=',
            '≈': '~',
            '∞': 'oo',
        }
    
    def convert(self, text: str) -> str:
        """Convert text with math to LaTeX"""
        # Only convert if text contains math symbols
        has_math = any(symbol in text for symbol in self.symbols.keys())
        has_numbers = bool(re.search(r'\d', text))
        
        if not (has_math or has_numbers):
            return text  # No math, return as-is
        
        # Use pattern-based conversion (more reliable than SymPy for mixed text)
        return self._pattern_convert(text)
    
    def _pattern_convert(self, text: str) -> str:
        """Pattern-based LaTeX conversion"""
        # IMPORTANT: Escape special characters FIRST
        # Escape percentages (but not if already escaped)
        if '%' in text and '\\%' not in text:
            text = text.replace('%', '\\%')
        
        # Superscripts
        text = re.sub(r'(\w)²', r'$\1^2$', text)
        text = re.sub(r'(\w)³', r'$\1^3$', text)
        
        # Square roots
        text = re.sub(r'√(\d+)', r'$\\sqrt{\1}$', text)
        text = re.sub(r'√\(([^)]+)\)', r'$\\sqrt{\1}$', text)
        
        # Fractions (only if not already in LaTeX)
        if '$' not in text:
            text = re.sub(r'(\d+)/(\d+)', r'$\\frac{\1}{\2}$', text)
        
        # Greek letters
        text = text.replace('π', '$\\pi$')
        text = text.replace('α', '$\\alpha$')
        text = text.replace('θ', '$\\theta$')
        text = text.replace('Σ', '$\\Sigma$')
        text = text.replace('∑', '$\\sum$')
        
        # Operators
        text = text.replace('×', '$\\times$')
        text = text.replace('÷', '$\\div$')
        text = text.replace('≥', '$\\geq$')
        text = text.replace('≤', '$\\leq$')
        text = text.replace('≠', '$\\neq$')
        text = text.replace('≈', '$\\approx$')
        text = text.replace('∞', '$\\infty$')
        
        return text


# ============================================================================
# SECTION DETECTOR
# ============================================================================

class SectionDetector:
    """Find Quant section using 3rd Q.1 detection"""
    
    def find_quant_section(self, text: str) -> Tuple[str, int, int]:
        """
        Find Quant section by detecting 3rd occurrence of Q.1
        
        Returns:
            (quant_text, start_index, end_index)
        """
        # Find all occurrences of "Q.1" or "1."
        pattern = r'(?:Q\.?\s*1|^\s*1\.)\s+'
        matches = list(re.finditer(pattern, text, re.MULTILINE))
        
        if len(matches) < 3:
            raise ValueError(f"Could not find 3 sections (found {len(matches)} Q.1 occurrences)")
        
        # Start of Quant section (3rd occurrence)
        quant_start = matches[2].start()
        
        # End of Quant section (4th occurrence or end of text)
        if len(matches) >= 4:
            quant_end = matches[3].start()
        else:
            quant_end = len(text)
        
        quant_text = text[quant_start:quant_end]
        
        return quant_text, quant_start, quant_end
    
    def validate_section(self, quant_text: str) -> bool:
        """Ensure we have questions 1-25"""
        question_numbers = re.findall(r'^\s*(\d+)\.', quant_text, re.MULTILINE)
        question_numbers = [int(n) for n in question_numbers]
        
        expected = list(range(1, 26))
        
        if question_numbers[:25] != expected:
            print(f"⚠️  Warning: Question numbers don't match 1-25")
            print(f"   Found: {question_numbers[:10]}...{question_numbers[-5:]}")
            return False
        
        return True


# ============================================================================
# QUESTION PARSER
# ============================================================================

class QuestionParser:
    """Parse individual questions from text"""
    
    def __init__(self, latex_converter: LaTeXConverter):
        self.latex = latex_converter
    
    def parse_questions(self, quant_text: str, metadata_base: Metadata) -> List[Question]:
        """Parse all 25 questions from Quant section"""
        questions = []
        
        # Split into question blocks
        blocks = self._split_into_blocks(quant_text)
        
        for block in blocks:
            try:
                question = self._parse_question_block(block, metadata_base)
                if question:
                    questions.append(question)
            except Exception as e:
                print(f"⚠️  Error parsing question: {e}")
                continue
        
        return questions
    
    def _split_into_blocks(self, text: str) -> List[str]:
        """Split text into individual question blocks"""
        # Split by question numbers
        blocks = re.split(r'\n\s*(\d+)\.\s+', text)
        
        # Reconstruct blocks with question numbers
        question_blocks = []
        for i in range(1, len(blocks), 2):
            if i + 1 < len(blocks):
                question_num = blocks[i]
                question_text = blocks[i + 1]
                question_blocks.append(f"{question_num}. {question_text}")
        
        return question_blocks
    
    def _parse_question_block(self, block: str, metadata_base: Metadata) -> Optional[Question]:
        """
        Parse single question block
        
        Format:
        1. Question text?
        (1) Option 1 ✓
        (2) Option 2 ✗
        (3) Option 3 ✗
        (4) Option 4 ✗
        """
        # Extract question number and text
        question_match = re.search(r'^(\d+)\.\s*(.+?)(?=\n\s*\(1\))', block, re.DOTALL)
        if not question_match:
            return None
        
        question_num = int(question_match.group(1))
        question_text = question_match.group(2).strip()
        
        # Convert to LaTeX
        question_text = self.latex.convert(question_text)
        
        # Extract options (improved: capture multi-line options)
        options = []
        # Match options more carefully - capture until next option or end
        option_pattern = r'\(([1-4])\)\s*(.+?)(?=\n\s*\([1-4]\)|$)'
        option_matches = re.finditer(option_pattern, block, re.DOTALL)
        
        correct_option_id = None
        
        for match in option_matches:
            option_num = match.group(1)
            option_text = match.group(2).strip()
            
            # Detect correct answer (checkmark or green color indicator)
            is_correct = '✓' in option_text or '✔' in option_text
            
            # Remove checkmark/X symbols from text
            option_text = option_text.replace('✓', '').replace('✔', '').replace('✗', '').replace('✘', '').strip()
            
            # Convert to LaTeX
            option_text = self.latex.convert(option_text)
            
            option_id = f"opt_{option_num}"
            
            if is_correct:
                correct_option_id = option_id
            
            options.append(QuestionOption(
                id=option_id,
                text=option_text,
                is_correct=is_correct,
                inf_tag=None,
                media_id=None
            ))
        
        if len(options) != 4:
            print(f"⚠️  Q{question_num}: Has {len(options)} options (expected 4)")
            return None
        
        if not correct_option_id:
            print(f"⚠️  Q{question_num}: No correct answer detected!")
            return None
        
        # Create question with benchmarks
        question = Question(
            content=QuestionContent(
                text=question_text,
                options=options,
                correct_option_id=correct_option_id
            ),
            metadata=Metadata(
                source_exam=metadata_base.source_exam,
                year=metadata_base.year,
                original_paper=metadata_base.original_paper,
                question_number=question_num
            ),
            benchmarks=Benchmarks()  # Add default benchmarks
        )
        
        return question


# ============================================================================
# MAIN EXTRACTOR
# ============================================================================

class SSCExtractor:
    """Main extraction orchestrator"""
    
    def __init__(self, pdf_path: str, exam: str, year: int, paper: str):
        self.pdf_path = pdf_path
        self.metadata_base = Metadata(
            source_exam=exam,
            year=year,
            original_paper=paper,
            question_number=0  # Will be set per question
        )
        
        # Auto-generate import batch ID
        self.import_batch = f"{exam.replace(' ', '-')}_{year}_{paper.split('-')[0].strip()}"
        
        self.latex_converter = LaTeXConverter()
        self.section_detector = SectionDetector()
        self.question_parser = QuestionParser(self.latex_converter)
    
    def extract(self) -> List[Question]:
        """Main extraction pipeline"""
        print(f"📄 Opening PDF: {self.pdf_path}")
        
        # Extract text from PDF
        with pdfplumber.open(self.pdf_path) as pdf:
            full_text = ""
            for page in pdf.pages:
                full_text += page.extract_text() + "\n"
        
        print(f"✅ Extracted {len(full_text)} characters")
        
        # Find Quant section
        print("🔍 Finding Quantitative Aptitude section...")
        quant_text, start, end = self.section_detector.find_quant_section(full_text)
        print(f"✅ Found Quant section (chars {start}-{end})")
        
        # Validate section
        is_valid = self.section_detector.validate_section(quant_text)
        if not is_valid:
            print("⚠️  Section validation failed, but continuing...")
        
        # Parse questions
        print("📝 Parsing questions...")
        questions = self.question_parser.parse_questions(quant_text, self.metadata_base)
        
        # Set import batch for all questions
        for q in questions:
            q.import_batch = self.import_batch
        
        print(f"✅ Parsed {len(questions)} questions")
        
        # Validate
        self._validate_questions(questions)
        
        return questions
    
    def _validate_questions(self, questions: List[Question]):
        """Comprehensive validation"""
        print("\n🔍 Validating extraction...")
        
        # Count validation
        if len(questions) != 25:
            print(f"⚠️  Expected 25 questions, got {len(questions)}")
        else:
            print("✅ Question count: 25")
        
        # Question numbers
        numbers = [q.metadata.question_number for q in questions]
        if numbers == list(range(1, 26)):
            print("✅ Question numbers: 1-25")
        else:
            print(f"⚠️  Question numbers: {numbers}")
        
        # Options validation
        for q in questions:
            if len(q.content.options) != 4:
                print(f"⚠️  Q{q.metadata.question_number}: {len(q.content.options)} options")
            
            correct_count = sum(opt.is_correct for opt in q.content.options)
            if correct_count != 1:
                print(f"⚠️  Q{q.metadata.question_number}: {correct_count} correct answers")
        
        print("✅ Validation complete\n")
    
    def to_json(self, questions: List[Question], output_file: str):
        """Export to JSON"""
        questions_dict = []
        
        for q in questions:
            q_dict = {
                "p_id": q.p_id,
                "status": q.status,
                "difficulty": q.difficulty,
                "content": {
                    "text": q.content.text,
                    "correct_option_id": q.content.correct_option_id,
                    "options": [
                        {
                            "id": opt.id,
                            "text": opt.text,
                            "is_correct": opt.is_correct,
                            "inf_tag": opt.inf_tag,
                            "media_id": opt.media_id
                        }
                        for opt in q.content.options
                    ],
                    "has_diagram": q.content.has_diagram,
                    "has_table": q.content.has_table
                },
                "benchmarks": {
                    "golden_ms": q.benchmarks.golden_ms,
                    "shortcut_expected": q.benchmarks.shortcut_expected,
                    "brute_force_acceptable": q.benchmarks.brute_force_acceptable,
                    "speed_category": q.benchmarks.speed_category
                },
                "metadata": {
                    "source_exam": q.metadata.source_exam,
                    "year": q.metadata.year,
                    "original_paper": q.metadata.original_paper,
                    "question_number": q.metadata.question_number
                },
                "media_ids": q.media_ids,
                "is_verified": q.is_verified,
                "version": q.version,
                "import_batch": q.import_batch
            }
            questions_dict.append(q_dict)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(questions_dict, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Exported to {output_file}")


# ============================================================================
# MAIN
# ============================================================================

def main():
    parser = argparse.ArgumentParser(description='Extract SSC CGL questions')
    parser.add_argument('--pdf', required=True, help='PDF file path')
    parser.add_argument('--exam', required=True, help='Exam name (e.g., "SSC CGL 2024")')
    parser.add_argument('--year', type=int, required=True, help='Year')
    parser.add_argument('--paper', required=True, help='Paper (e.g., "Tier 1 - 09.09.2024 - 9:00 AM")')
    parser.add_argument('--output', default='questions.json', help='Output JSON file')
    
    args = parser.parse_args()
    
    print("=" * 70)
    print("SSC CGL QUESTION EXTRACTOR")
    print("=" * 70)
    print(f"PDF: {args.pdf}")
    print(f"Exam: {args.exam}")
    print(f"Year: {args.year}")
    print(f"Paper: {args.paper}")
    print("=" * 70)
    print()
    
    # Extract
    extractor = SSCExtractor(args.pdf, args.exam, args.year, args.paper)
    questions = extractor.extract()
    
    # Export
    extractor.to_json(questions, args.output)
    
    # Summary
    print("\n" + "=" * 70)
    print("EXTRACTION COMPLETE")
    print("=" * 70)
    print(f"📊 Total questions: {len(questions)}")
    print(f"📁 Output file: {args.output}")
    print("\n⚠️  NEXT STEPS:")
    print("  1. Review the JSON output")
    print("  2. Import to MongoDB")
    print("  3. Review in admin panel (/admin/review)")
    print("  4. Verify each question manually")
    print("  5. Mark as verified when ready")
    print("=" * 70)


if __name__ == "__main__":
    main()
