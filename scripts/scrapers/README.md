# Web Scrapers

Scripts for downloading question papers from various websites.

## 📥 Available Scrapers

### 1. SSC CGL Paper Downloader (`download_ssc_papers.py`)

Downloads all English SSC CGL question papers from Adda247.

**Usage:**
```bash
python download_ssc_papers.py
```

**What it does:**
- Fetches papers from 2019-2024
- Filters English papers only (skips Hindi)
- Organizes by year in `docs/PYQs/SSC/CGL/`
- Skips already downloaded files
- Creates INDEX.md with all papers

**Output:**
```
docs/PYQs/SSC/CGL/
├── 2024/ (41 papers)
├── 2023/ (76 papers)
├── 2022/ (9 papers)
├── 2021/ (24 papers)
├── 2020/ (16 papers)
├── 2019/ (21 papers)
└── INDEX.md
```

---

## 🔧 Creating New Scrapers

### Template Structure:

```python
#!/usr/bin/env python3
"""
[Exam Name] Question Paper Downloader
Downloads papers from [Website]
"""

import requests
from bs4 import BeautifulSoup
from pathlib import Path
import time

class PaperDownloader:
    def __init__(self, base_url: str, output_dir: str):
        self.base_url = base_url
        self.output_dir = Path(output_dir)
        self.session = requests.Session()
        
    def fetch_page(self) -> str:
        response = self.session.get(self.base_url)
        return response.text
    
    def extract_pdf_links(self, html: str) -> list:
        soup = BeautifulSoup(html, 'html.parser')
        # Extract PDF links
        return pdf_links
    
    def download_pdf(self, url: str, filepath: Path):
        response = self.session.get(url, stream=True)
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
    
    def download_all(self):
        html = self.fetch_page()
        links = self.extract_pdf_links(html)
        
        for url in links:
            self.download_pdf(url, filepath)
            time.sleep(0.5)  # Be nice to server

if __name__ == "__main__":
    downloader = PaperDownloader(url, output_dir)
    downloader.download_all()
```

### Best Practices:

1. **Respect Servers**
   - Add delays between requests (`time.sleep(0.5)`)
   - Use proper User-Agent headers
   - Don't overwhelm the server

2. **Error Handling**
   - Try-except blocks for downloads
   - Continue on single file failure
   - Log errors clearly

3. **Organization**
   - Organize by year/exam/tier
   - Skip existing files
   - Create index files

4. **Filtering**
   - Filter by language (English only)
   - Filter by exam type
   - Remove duplicates

---

## 📋 Adding New Exam Scrapers

### Example: UPSC Papers

1. **Create new file**: `download_upsc_papers.py`

2. **Identify source**: Find website with UPSC papers

3. **Analyze structure**:
   ```python
   # Inspect page HTML
   # Find PDF link patterns
   # Identify year/exam markers
   ```

4. **Implement scraper**:
   - Use template above
   - Customize for UPSC structure
   - Test on small sample first

5. **Update this README**:
   - Add to "Available Scrapers" section
   - Document usage and output

---

## 🌐 Common Websites for Papers

- **Adda247**: SSC, Banking, Railway
- **Testbook**: Multiple exams
- **GradeUp**: Government exams
- **Official websites**: Most reliable

---

## ⚠️ Important Notes

- **Legal**: Only download publicly available papers
- **Storage**: Papers go to `docs/PYQs/` (excluded from git)
- **Size**: Large downloads (200+ MB typical)
- **Network**: Requires stable internet connection

---

## 🐛 Troubleshooting

**"Module not found"**
```bash
pip install -r ../requirements.txt
```

**"Connection timeout"**
- Check internet connection
- Website might be down
- Try again later

**"Permission denied"**
- Check folder permissions
- Run without admin if possible

---

## 📚 Resources

- BeautifulSoup docs: https://www.crummy.com/software/BeautifulSoup/
- Requests docs: https://requests.readthedocs.io/
- Web scraping ethics: https://www.scrapehero.com/web-scraping-ethics/
