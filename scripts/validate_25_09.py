import json
import os

files = [
    r"c:\Users\brothers\Desktop\PROJECT ATLAS\project\Jsons\questions\2024\ssc_cgl_reasoning_25_09_2024_9am.json",
    r"c:\Users\brothers\Desktop\PROJECT ATLAS\project\Jsons\questions\2024\ssc_cgl_quant_25_09_2024_9am.json"
]

for file_path in files:
    if not os.path.exists(file_path):
        print(f"FAIL: {file_path} does not exist.")
        continue
        
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        print(f"PASS: {file_path} (Items: {len(data)})")
        
        # specific checks
        for i, q in enumerate(data):
            if 'text' not in q:
                print(f"  WARNING: Question {i+1} missing 'text' field.")
            if 'solution' not in q:
                print(f"  WARNING: Question {i+1} missing 'solution' field.")
                
    except json.JSONDecodeError as e:
        print(f"FAIL: {file_path} - JSON Error at line {e.lineno}, col {e.colno}: {e.msg}")
    except Exception as e:
        print(f"FAIL: {file_path} - Error: {str(e)}")
