#!/usr/bin/env python3
"""
SSC Question Paper Extractor
Extracts questions from SSC CGL/CHSL previous year papers and converts them
to Project Atlas Question schema format.

Usage:
    python extract_questions.py --input paper.pdf --output questions.json
    python extract_questions.py --input paper.txt --output questions.json --pattern QUANT_PERC_001

Author: Project Atlas Team
"""

import json
import re
import argparse
from typing import List, Dict, Optional
from dataclasses import dataclass, asdict
from enum import Enum


class QuestionStatus(str, Enum):
    COLD = "COLD"
    OBSERVATION = "OBSERVATION"
    CALIBRATION = "CALIBRATION"
    VERIFIED = "VERIFIED"


class QuestionDifficulty(str, Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"


class SpeedCategory(str, Enum):
    QUICK = "QUICK"
    STANDARD = "STANDARD"
    COMPLEX = "COMPLEX"


@dataclass
class QuestionOption:
    """Represents a single MCQ option"""
    id: str
    text: str
    is_correct: bool
    inf_tag: Optional[str] = None  # Mistake tag for wrong options


@dataclass
class QuestionContent:
    """Question text and options"""
    text: str
    options: List[QuestionOption]


@dataclass
class Benchmarks:
    """Speed expectations for inference"""
    golden_ms: int = 60000  # Default 60 seconds
    shortcut_expected: bool = False
    brute_force_acceptable: bool = True
    speed_category: SpeedCategory = SpeedCategory.STANDARD


@dataclass
class Metadata:
    """Source tracking information"""
    source_exam: Optional[str] = None
    year: Optional[int] = None
    original_paper: Optional[str] = None
    question_number: Optional[int] = None


@dataclass
class Question:
    """Complete question object matching MongoDB schema"""
    p_id: Optional[str] = None  # Pattern ID (to be linked later)
    status: QuestionStatus = QuestionStatus.COLD
    difficulty: QuestionDifficulty = QuestionDifficulty.MEDIUM
    content: Optional[QuestionContent] = None
    benchmarks: Benchmarks = None
    metadata: Optional[Metadata] = None

    def __post_init__(self):
        if self.benchmarks is None:
            self.benchmarks = Benchmarks()
        if self.metadata is None:
            self.metadata = Metadata()


class QuestionExtractor:
    """Extracts questions from SSC paper text"""

    def __init__(self):
        # Regex patterns for question parsing
        self.question_pattern = r'(\d+)\.\s*(.+?)(?=\n\s*\([A-D]\)|$)'
        self.option_pattern = r'\(([A-D])\)\s*(.+?)(?=\n\s*\([A-D]\)|$|\n\n)'
        self.answer_pattern = r'(?:Answer|Ans)[:\s]*([A-D])'

    def extract_from_text(self, text: str, metadata: Metadata) -> List[Question]:
        """
        Extract questions from raw text

        Args:
            text: Raw text from PDF or text file
            metadata: Source information (exam, year, etc.)

        Returns:
            List of Question objects
        """
        questions = []

        # Split text into question blocks
        # This is a simplified parser - real implementation needs more robust parsing
        question_blocks = self._split_into_blocks(text)

        for block in question_blocks:
            try:
                question = self._parse_question_block(block, metadata)
                if question:
                    questions.append(question)
            except Exception as e:
                print(f"Warning: Failed to parse question block: {e}")
                continue

        return questions

    def _split_into_blocks(self, text: str) -> List[str]:
        """
        Split text into individual question blocks

        This is a placeholder - actual implementation depends on paper format
        """
        # Simple split by question numbers (1., 2., 3., etc.)
        blocks = re.split(r'\n\s*(\d+)\.\s+', text)

        # Reconstruct blocks with question numbers
        question_blocks = []
        for i in range(1, len(blocks), 2):
            if i + 1 < len(blocks):
                question_num = blocks[i]
                question_text = blocks[i + 1]
                question_blocks.append(f"{question_num}. {question_text}")

        return question_blocks

    def _parse_question_block(self, block: str, metadata: Metadata) -> Optional[Question]:
        """
        Parse a single question block into Question object

        Format expected:
        1. Question text here?
        (A) Option A
        (B) Option B
        (C) Option C
        (D) Option D
        Answer: C
        """
        # Extract question number and text
        question_match = re.search(r'^(\d+)\.\s*(.+?)(?=\n\s*\([A-D]\))', block, re.DOTALL)
        if not question_match:
            return None

        question_num = int(question_match.group(1))
        question_text = question_match.group(2).strip()

        # Extract options
        options = []
        option_matches = re.finditer(r'\(([A-D])\)\s*([^\n]+)', block)

        for match in option_matches:
            option_id = match.group(1)
            option_text = match.group(2).strip()

            options.append(QuestionOption(
                id=f"opt_{option_id.lower()}",
                text=option_text,
                is_correct=False,  # Will be set when we find the answer
                inf_tag=None  # To be manually tagged later
            ))

        if len(options) != 4:
            print(f"Warning: Question {question_num} has {len(options)} options (expected 4)")
            return None

        # Extract correct answer
        answer_match = re.search(self.answer_pattern, block, re.IGNORECASE)
        if answer_match:
            correct_option = answer_match.group(1).upper()
            for option in options:
                if option.id == f"opt_{correct_option.lower()}":
                    option.is_correct = True

        # Create question object
        question = Question(
            content=QuestionContent(
                text=question_text,
                options=options
            ),
            metadata=Metadata(
                source_exam=metadata.source_exam,
                year=metadata.year,
                original_paper=metadata.original_paper,
                question_number=question_num
            )
        )

        return question

    def to_json(self, questions: List[Question], output_file: str):
        """
        Export questions to JSON file

        Args:
            questions: List of Question objects
            output_file: Output JSON file path
        """
        # Convert to dict format
        questions_dict = []
        for q in questions:
            q_dict = {
                "p_id": q.p_id,
                "status": q.status.value,
                "difficulty": q.difficulty.value,
                "content": {
                    "text": q.content.text,
                    "options": [
                        {
                            "id": opt.id,
                            "text": opt.text,
                            "is_correct": opt.is_correct,
                            "inf_tag": opt.inf_tag
                        }
                        for opt in q.content.options
                    ]
                },
                "benchmarks": {
                    "golden_ms": q.benchmarks.golden_ms,
                    "shortcut_expected": q.benchmarks.shortcut_expected,
                    "brute_force_acceptable": q.benchmarks.brute_force_acceptable,
                    "speed_category": q.benchmarks.speed_category.value
                },
                "metadata": {
                    "source_exam": q.metadata.source_exam,
                    "year": q.metadata.year,
                    "original_paper": q.metadata.original_paper,
                    "question_number": q.metadata.question_number
                }
            }
            questions_dict.append(q_dict)

        # Write to file
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(questions_dict, f, indent=2, ensure_ascii=False)

        print(f"✅ Exported {len(questions)} questions to {output_file}")


def main():
    parser = argparse.ArgumentParser(description='Extract SSC questions to JSON')
    parser.add_argument('--input', required=True, help='Input file (PDF or TXT)')
    parser.add_argument('--output', required=True, help='Output JSON file')
    parser.add_argument('--exam', default='SSC CGL', help='Exam name (e.g., "SSC CGL 2023")')
    parser.add_argument('--year', type=int, help='Exam year')
    parser.add_argument('--paper', help='Paper name (e.g., "Tier 1 - Shift 2")')

    args = parser.parse_args()

    # Create metadata
    metadata = Metadata(
        source_exam=args.exam,
        year=args.year,
        original_paper=args.paper
    )

    # Read input file
    with open(args.input, 'r', encoding='utf-8') as f:
        text = f.read()

    # Extract questions
    extractor = QuestionExtractor()
    questions = extractor.extract_from_text(text, metadata)

    print(f"📝 Extracted {len(questions)} questions from {args.input}")

    # Export to JSON
    extractor.to_json(questions, args.output)

    # Print summary
    print("\n📊 Summary:")
    print(f"  Total questions: {len(questions)}")
    print(f"  Source: {metadata.source_exam}")
    if metadata.year:
        print(f"  Year: {metadata.year}")
    if metadata.original_paper:
        print(f"  Paper: {metadata.original_paper}")

    print("\n⚠️  Next Steps:")
    print("  1. Review the JSON output and verify question parsing")
    print("  2. Manually add Pattern IDs (p_id) to link questions to patterns")
    print("  3. Add mistake tags (inf_tag) to wrong options")
    print("  4. Set difficulty levels and speed benchmarks")
    print("  5. Import to MongoDB using the import script")


if __name__ == "__main__":
    main()
