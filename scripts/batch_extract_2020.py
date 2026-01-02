#!/usr/bin/env python3
"""
Batch Extractor for SSC CGL 2020 Papers (CGL 2019 Exam - conducted March 2020)
- Detects Tier 1 papers from PDF headers
- Extracts REASONING + QUANT sections (50 questions per paper)
- Outputs single JSON for MongoDB import
"""

import sys
import json
import re
from pathlib import Path    

import pdfplumber

sys.path.insert(0, str(Path(__file__).parent))
sys.path.insert(0, str(Path(__file__).parent / "extractors"))

from extractors.extract_ssc_cgl import SSCExtractor, question_to_dict


def detect_paper_type(pdf_path: str) -> dict:
    """
    Read the first page of PDF to detect paper type.
    Returns dict with: is_tier1, exam_name, exam_date, exam_time
    """
    result = {
        "is_tier1": False,
        "exam_name": "",
        "exam_year": 2019,  # CGL 2019 exam conducted in March 2020
        "exam_date": "",
        "exam_time": ""
    }
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            if len(pdf.pages) == 0:
                return result
            
            first_page_text = pdf.pages[0].extract_text() or ""
            
            # Check for Tier-I / Tier 1 / Tier-1 in the header
            tier1_patterns = [
                r'Tier[\s-]*I\b',
                r'Tier[\s-]*1\b',
                r'Tier[\s-]*I\s',
            ]
            
            for pattern in tier1_patterns:
                if re.search(pattern, first_page_text, re.IGNORECASE):
                    result["is_tier1"] = True
                    break
            
            # Also check it's NOT Tier-II explicitly
            tier2_patterns = [
                r'Tier[\s-]*II\b',
                r'Tier[\s-]*2\b',
                r'Paper[\s-]*II\b',
                r'Paper[\s-]*2\b',
                r'statistics',
                r'AAO',
            ]
            
            for pattern in tier2_patterns:
                if re.search(pattern, first_page_text, re.IGNORECASE):
                    result["is_tier1"] = False
                    break
            
            # Extract exam name from header
            exam_match = re.search(r'Combined Graduate Level Examination\s+(\d{4})', first_page_text, re.IGNORECASE)
            if exam_match:
                result["exam_year"] = int(exam_match.group(1))
                result["exam_name"] = f"SSC CGL {exam_match.group(1)}"
            
            # Extract exam date
            date_match = re.search(r'Exam Date[:\s]+(\d{1,2}/\d{1,2}/\d{4})', first_page_text)
            if date_match:
                result["exam_date"] = date_match.group(1)
            
            # Extract exam time
            time_match = re.search(r'Exam Time[:\s]+([^\n]+)', first_page_text)
            if time_match:
                result["exam_time"] = time_match.group(1).strip()
                
    except Exception as e:
        print(f"   ⚠️ Error reading PDF header: {str(e)[:40]}")
    
    return result


def main():
    papers_dir = Path(__file__).parent.parent.parent / "docs" / "PYQs" / "SSC" / "CGL" / "2020"
    output_dir = Path(__file__).parent / "output" / "2020"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    papers = list(papers_dir.glob("*.pdf"))
    
    print("=" * 60)
    print("BATCH EXTRACTION - SSC CGL 2020 (CGL 2019 EXAM)")
    print("Detecting Tier 1 papers from PDF headers...")
    print("=" * 60)
    print(f"Found {len(papers)} PDFs to scan")
    print()
    
    all_questions = []
    stats = {"scanned": 0, "tier1_found": 0, "skipped": 0, "successful": 0, "failed": 0, "total_qs": 0, "clean": 0, "need_review": 0}
    skipped_papers = []
    failed_papers = []
    
    for i, paper_path in enumerate(sorted(papers), 1):
        stats["scanned"] += 1
        print(f"[{i}/{len(papers)}] {paper_path.name}")
        
        # First, detect paper type from first page
        paper_info = detect_paper_type(str(paper_path))
        
        if not paper_info["is_tier1"]:
            print(f"   ⏭️ Skipping - Not Tier 1")
            stats["skipped"] += 1
            skipped_papers.append(paper_path.name)
            continue
        
        stats["tier1_found"] += 1
        exam_name = paper_info["exam_name"] or "SSC CGL 2019"
        exam_year = paper_info["exam_year"]
        
        # Build paper name from date and time
        if paper_info["exam_date"] and paper_info["exam_time"]:
            paper_name = f"Tier 1 - {paper_info['exam_date']} {paper_info['exam_time']}"
        else:
            paper_name = f"Tier 1 - {paper_path.stem}"
        
        print(f"   ✅ Tier 1 detected - {exam_name} - {paper_info['exam_date']}")
        
        try:
            extractor = SSCExtractor(
                pdf_path=str(paper_path),
                exam=exam_name,
                year=exam_year,
                paper=paper_name
            )
            
            questions = extractor.extract()
            
            if len(questions) > 0:
                for q in questions:
                    all_questions.append(question_to_dict(q))
                    if q.needs_image_review:
                        stats["need_review"] += 1
                    else:
                        stats["clean"] += 1
                
                stats["total_qs"] += len(questions)
                stats["successful"] += 1
            else:
                stats["failed"] += 1
                failed_papers.append(paper_path.name)
                print(f"   ❌ No questions extracted")
                
        except Exception as e:
            stats["failed"] += 1
            failed_papers.append(f"{paper_path.name}: {str(e)[:40]}")
            print(f"   ❌ Error: {str(e)[:60]}")
    
    # Save to single JSON
    output_file = output_dir / "ssc_cgl_2019_all.json"  # Named 2019 since that's the exam year
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
    
    # Summary
    print()
    print("=" * 60)
    print("EXTRACTION COMPLETE")
    print("=" * 60)
    print(f"📂 Scanned: {stats['scanned']} PDFs")
    print(f"   ✅ Tier 1 found: {stats['tier1_found']} papers")
    print(f"   ⏭️ Skipped (Tier 2/Other): {stats['skipped']} papers")
    print()
    print(f"✅ Successful: {stats['successful']} papers")
    print(f"❌ Failed: {stats['failed']} papers")
    print(f"📊 Total questions: {stats['total_qs']}")
    print(f"   ✅ Clean (ready): {stats['clean']}")
    print(f"   ⚠️  Need images: {stats['need_review']}")
    print(f"📁 Output: {output_file}")
    
    if skipped_papers:
        print(f"\n⏭️ Skipped papers (not Tier 1):")
        for sp in skipped_papers[:10]:
            print(f"   - {sp}")
        if len(skipped_papers) > 10:
            print(f"   ... and {len(skipped_papers) - 10} more")
    
    if failed_papers:
        print(f"\n⚠️ Failed papers:")
        for fp in failed_papers[:5]:
            print(f"   - {fp}")
    
    print()
    print("NEXT: Run 'python import_to_mongodb.py' to import to database")

if __name__ == "__main__":
    main()
