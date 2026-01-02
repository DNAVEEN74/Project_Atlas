#!/usr/bin/env python3
"""
Batch Extractor for SSC CGL 2024 Papers
Extracts REASONING + QUANT sections (50 questions per paper)
Outputs single JSON for MongoDB import
"""

import sys
import json
from pathlib import Path    

sys.path.insert(0, str(Path(__file__).parent))
sys.path.insert(0, str(Path(__file__).parent / "extractors"))

from extractors.extract_ssc_cgl import SSCExtractor, question_to_dict

def main():
    papers_dir = Path(__file__).parent.parent.parent / "docs" / "PYQs" / "SSC" / "CGL" / "2024"
    output_dir = Path(__file__).parent / "output" / "2024"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    papers = list(papers_dir.glob("*.pdf"))
    
    print("=" * 60)
    print("BATCH EXTRACTION - SSC CGL 2024 (REASONING + QUANT)")
    print("=" * 60)
    print(f"Found {len(papers)} papers")
    print()
    
    all_questions = []
    stats = {"successful": 0, "failed": 0, "total_qs": 0, "clean": 0, "need_review": 0}
    failed_papers = []
    
    for i, paper_path in enumerate(sorted(papers), 1):
        print(f"[{i}/{len(papers)}] {paper_path.name}")
        
        try:
            # Parse paper name from filename
            filename = paper_path.stem
            parts = filename.split("_")
            if len(parts) >= 2:
                date = parts[1] if len(parts) > 1 else ""
                time_part = parts[2].replace("-", " ") if len(parts) > 2 else ""
                paper_name = f"Tier 1 - {date} {time_part}".strip()
            else:
                paper_name = filename
            
            extractor = SSCExtractor(
                pdf_path=str(paper_path),
                exam="SSC CGL 2024",
                year=2024,
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
    output_file = output_dir / "ssc_cgl_2024_all.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
    
    # Summary
    print()
    print("=" * 60)
    print("EXTRACTION COMPLETE")
    print("=" * 60)
    print(f"✅ Successful: {stats['successful']} papers")
    print(f"❌ Failed: {stats['failed']} papers")
    print(f"📊 Total questions: {stats['total_qs']}")
    print(f"   ✅ Clean (ready): {stats['clean']}")
    print(f"   ⚠️  Need images: {stats['need_review']}")
    print(f"📁 Output: {output_file}")
    
    if failed_papers:
        print(f"\n⚠️ Failed papers:")
        for fp in failed_papers[:5]:
            print(f"   - {fp}")
    
    print()
    print("NEXT: Run 'python import_to_mongodb.py' to import to database")

if __name__ == "__main__":
    main()
