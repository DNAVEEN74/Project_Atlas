import os
import re
from pathlib import Path

# Path to content directory
CONTENT_DIR = Path(r"c:\Users\brothers\Desktop\PROJECT ATLAS\project\src\app\explanations\content")

def process_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # 1. Remove LessonLayout import
        # Remove "LessonLayout," or ", LessonLayout" in imports
        content = re.sub(r'LessonLayout,\s*', '', content)
        content = re.sub(r',\s*LessonLayout', '', content)
        # If it was the only import, we might leave "import { } ...". 
        # But usually there are others like ConceptSection.
        # If "import { LessonLayout } from ...", it becomes "import { } from ...". We can fix that or ignore.
        # Let's handle the single import case simpler:
        content = re.sub(r'import\s+{\s*LessonLayout\s*}\s+from\s+.*?;\s*', '', content)

        # 2. Replace <LessonLayout> with <>
        content = re.sub(r'<LessonLayout>', '<>', content)

        # 3. Replace </LessonLayout> with </>
        content = re.sub(r'</LessonLayout>', '</>', content)

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    if not CONTENT_DIR.exists():
        print(f"Directory not found: {CONTENT_DIR}")
        return

    count = 0
    cleaned = 0
    
    for root, dirs, files in os.walk(CONTENT_DIR):
        for file in files:
            if file.endswith(".tsx"):
                count += 1
                full_path = Path(root) / file
                if process_file(full_path):
                    print(f"Processed: {file}")
                    cleaned += 1
                else:
                    print(f"Skipped: {file}")

    print(f"\nTotal files scanned: {count}")
    print(f"Total files updated: {cleaned}")

if __name__ == "__main__":
    main()
