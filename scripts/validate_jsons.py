import json
import os

files = [
    r"c:\Users\brothers\Desktop\PROJECT ATLAS\project\Jsons\questions\2024\ssc_cgl_reasoning_26_09_2024_9am.json",
    r"c:\Users\brothers\Desktop\PROJECT ATLAS\project\Jsons\questions\2024\ssc_cgl_quant_26_09_2024_9am.json"
]

for f in files:
    try:
        if not os.path.exists(f):
             print(f"FAIL: {f} - File not found")
             continue
             
        with open(f, 'r', encoding='utf-8') as file:
            data = json.load(file)
        print(f"PASS: {f} (Items: {len(data)})")
    except json.JSONDecodeError as e:
        print(f"FAIL: {f} - JSON Error at line {e.lineno}, col {e.colno}: {e.msg}")
    except Exception as e:
        print(f"FAIL: {f} - {e}")
