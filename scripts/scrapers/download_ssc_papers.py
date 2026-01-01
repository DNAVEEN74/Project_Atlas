#!/usr/bin/env python3
"""
SSC CGL Question Paper Downloader
Downloads all English question papers from 2019-2024 from Adda247
Organizes in neat folder structure by year and tier

Usage:
    python download_ssc_papers.py
"""

import requests
from bs4 import BeautifulSoup
import re
import os
from pathlib import Path
from urllib.parse import urljoin
import time
from typing import List, Dict
import json


class SSCPaperDownloader:
    """Download SSC CGL papers from Adda247"""
    
    def __init__(self, base_url: str, output_dir: str = "PYQs/SSC/CGL"):
        self.base_url = base_url
        self.output_dir = Path(output_dir)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        # Create base directory
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def fetch_page(self) -> str:
        """Fetch the main page content"""
        print(f"📄 Fetching page: {self.base_url}")
        response = self.session.get(self.base_url)
        response.raise_for_status()
        return response.text
    
    def extract_pdf_links(self, html: str) -> Dict[str, List[str]]:
        """Extract all PDF links organized by year"""
        soup = BeautifulSoup(html, 'html.parser')
        
        pdf_links = {
            '2024': [],
            '2023': [],
            '2022': [],
            '2021': [],
            '2020': [],
            '2019': []
        }
        
        # Find all links
        all_links = soup.find_all('a', href=True)
        
        for link in all_links:
            href = link.get('href', '')
            
            # Only process PDF links
            if not href.endswith('.pdf'):
                continue
            
            # Only English papers (skip Hindi)
            if 'Hindi' in href or 'hindi' in href:
                continue
            
            # Categorize by year
            for year in pdf_links.keys():
                if year in href:
                    pdf_links[year].append(href)
                    break
        
        # Remove duplicates
        for year in pdf_links:
            pdf_links[year] = list(set(pdf_links[year]))
        
        return pdf_links
    
    def parse_filename(self, url: str, year: str) -> str:
        """Parse URL to create meaningful filename"""
        # Extract filename from URL
        filename = url.split('/')[-1]
        
        # Clean up filename
        filename = filename.replace('%20', '_')
        
        # Try to extract date and time info
        date_match = re.search(r'(\d{1,2}[.-]\d{1,2}[.-]\d{2,4})', filename)
        time_match = re.search(r'(\d{1,2}[.-]\d{2}(?:[.-](?:AM|PM))?)', filename)
        
        # Determine tier
        if 'Tier-2' in filename or 'Tier_2' in filename:
            tier = 'Tier-2'
        elif 'Tier-1' in filename or 'Tier_1' in filename or 'Tier1' in filename:
            tier = 'Tier-1'
        else:
            tier = 'Tier-1'  # Default
        
        return filename
    
    def download_pdf(self, url: str, filepath: Path) -> bool:
        """Download a single PDF file"""
        try:
            print(f"  ⬇️  Downloading: {filepath.name}")
            
            response = self.session.get(url, stream=True, timeout=30)
            response.raise_for_status()
            
            # Write file
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            
            print(f"  ✅ Downloaded: {filepath.name} ({filepath.stat().st_size // 1024} KB)")
            return True
            
        except Exception as e:
            print(f"  ❌ Failed: {filepath.name} - {e}")
            return False
    
    def download_all(self):
        """Main download orchestrator"""
        print("=" * 70)
        print("SSC CGL QUESTION PAPER DOWNLOADER")
        print("=" * 70)
        print(f"Output directory: {self.output_dir.absolute()}")
        print("=" * 70)
        print()
        
        # Fetch page
        html = self.fetch_page()
        
        # Extract links
        print("🔍 Extracting PDF links...")
        pdf_links = self.extract_pdf_links(html)
        
        # Show summary
        total_papers = sum(len(links) for links in pdf_links.values())
        print(f"\n📊 Found {total_papers} English question papers:")
        for year, links in pdf_links.items():
            if links:
                print(f"  • {year}: {len(links)} papers")
        print()
        
        # Download by year
        downloaded = 0
        failed = 0
        
        for year, links in pdf_links.items():
            if not links:
                continue
            
            print(f"\n📁 Processing {year} ({len(links)} papers)")
            print("-" * 70)
            
            # Create year directory
            year_dir = self.output_dir / year
            year_dir.mkdir(exist_ok=True)
            
            for url in links:
                # Parse filename
                filename = self.parse_filename(url, year)
                filepath = year_dir / filename
                
                # Skip if already exists
                if filepath.exists():
                    print(f"  ⏭️  Skipped: {filename} (already exists)")
                    continue
                
                # Download
                if self.download_pdf(url, filepath):
                    downloaded += 1
                else:
                    failed += 1
                
                # Be nice to the server
                time.sleep(0.5)
        
        # Summary
        print("\n" + "=" * 70)
        print("DOWNLOAD COMPLETE")
        print("=" * 70)
        print(f"✅ Successfully downloaded: {downloaded} papers")
        if failed > 0:
            print(f"❌ Failed: {failed} papers")
        print(f"📁 Location: {self.output_dir.absolute()}")
        print("=" * 70)
        
        # Create index file
        self._create_index(pdf_links)
    
    def _create_index(self, pdf_links: Dict[str, List[str]]):
        """Create an index file with all downloaded papers"""
        index_file = self.output_dir / "INDEX.md"
        
        with open(index_file, 'w', encoding='utf-8') as f:
            f.write("# SSC CGL Question Papers Index\n\n")
            f.write("Downloaded from: https://www.adda247.com/jobs/ssc-cgl-previous-year-question-paper/\n\n")
            f.write(f"Total Papers: {sum(len(links) for links in pdf_links.values())}\n\n")
            
            for year in sorted(pdf_links.keys(), reverse=True):
                links = pdf_links[year]
                if not links:
                    continue
                
                f.write(f"## {year} ({len(links)} papers)\n\n")
                
                # List files in year directory
                year_dir = self.output_dir / year
                if year_dir.exists():
                    files = sorted(year_dir.glob("*.pdf"))
                    for file in files:
                        f.write(f"- {file.name}\n")
                
                f.write("\n")
        
        print(f"\n📝 Created index file: {index_file}")


def main():
    """Main entry point"""
    url = "https://www.adda247.com/jobs/ssc-cgl-previous-year-question-paper/"
    
    downloader = SSCPaperDownloader(url)
    downloader.download_all()


if __name__ == "__main__":
    main()
