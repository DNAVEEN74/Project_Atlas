import os
import re
from pathlib import Path

# Path to content directory
CONTENT_DIR = Path(r"c:\Users\brothers\Desktop\PROJECT ATLAS\project\src\app\explanations\content")

def clean_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # 1. Remove 'icon="..."' props
        # Pattern matches icon="any_character_except_quote" including emojis
        content = re.sub(r'\sicon="[^"]+"', '', content)

        # 2. Remove HERO section
        # Logic: Remove from {/* HERO */} marker up to the start of the first <ConceptSection
        # This assumes HERO is always at the top before concepts.
        # We use dotall to match across lines.
        # We include the whitespace after the deletion to clean up gaps.
        
        # Regex explanation:
        # {\s*/\*\s*HERO.*?\*/\s*}  -> Matches {/* HERO... */} with any text inside
        # .*?                       -> Non-greedy match of anything
        # (?=<ConceptSection)       -> Lookahead for <ConceptSection
        content = re.sub(r'{\s*/\*\s*HERO.*?\*/\s*}.*?(?=<ConceptSection)', '', content, flags=re.DOTALL)

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
    
    # Walk through quant and reasoning subdirectories
    for root, dirs, files in os.walk(CONTENT_DIR):
        for file in files:
            if file.endswith(".tsx"):
                count += 1
                full_path = Path(root) / file
                if clean_file(full_path):
                    print(f"Cleaned: {file}")
                    cleaned += 1
                else:
                    print(f"Skipped (no changes): {file}")

    print(f"\nTotal files scanned: {count}")
    print(f"Total files refined: {cleaned}")

if __name__ == "__main__":
    main()
