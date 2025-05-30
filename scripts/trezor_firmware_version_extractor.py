#!/usr/bin/env python3
"""
Trezor Firmware Version Extractor

This script extracts the latest firmware version information for different Trezor models
using two methods:
1. Parsing changelog files from the repository
2. Checking firmware binary directories for the latest versions
"""

import requests
import re
from datetime import datetime
from typing import Dict, List, Tuple, Optional
import json
from bs4 import BeautifulSoup

class TrezorFirmwareExtractor:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        # Model mappings
        self.models = {
            'T2B1': 'Trezor Safe 3',
            'T2T1': 'Trezor Model T',
            'LEGACY': 'Trezor Model One', 
            'T3T1': 'Trezor Safe 5'  # Note: T3T1 might also be Safe 5 variant
        }
        
        # Changelog URLs
        self.changelog_urls = {
            'T2B1': 'https://raw.githubusercontent.com/trezor/trezor-firmware/main/core/CHANGELOG.T2B1.md',
            'T2T1': 'https://raw.githubusercontent.com/trezor/trezor-firmware/main/core/CHANGELOG.T2T1.md',
            'LEGACY': 'https://github.com/trezor/trezor-firmware/releases/tag/legacy%2Fv1.13.1',
            'T3T1': 'https://raw.githubusercontent.com/trezor/trezor-firmware/main/core/CHANGELOG.T3T1.md'
        }
        
        # Firmware directory URLs (GitHub API)
        self.firmware_dirs = {
            'T2B1': 'https://api.github.com/repos/trezor/data/contents/firmware/t2b1',
            'T2T1': 'https://api.github.com/repos/trezor/data/contents/firmware/t2t1',
            'LEGACY': 'https://api.github.com/repos/trezor/trezor-firmware/releases',
            'T3T1': 'https://api.github.com/repos/trezor/data/contents/firmware/t3t1'
        }

    def parse_changelog(self, model_code: str) -> Optional[Dict]:
        """Parse changelog file to extract latest version and date"""
        try:
            url = self.changelog_urls[model_code]
            response = self.session.get(url)
            response.raise_for_status()
            content = response.text
            
            # Look for version pattern like [2.8.10] (21st May 2025)
            version_pattern = r'\[(\d+\.\d+\.\d+)\]\s*\(([^)]+)\)'
            matches = re.findall(version_pattern, content)
            
            if matches:
                version, date_str = matches[0]  # Get the first (latest) match
                return {
                    'version': version,
                    'date': date_str.strip(),
                    'model_code': model_code,
                    'model_name': self.models.get(model_code, model_code)
                }
        except Exception as e:
            print(f"Error parsing changelog for {model_code}: {e}")
        return None

    def get_latest_from_firmware_dir(self, model_code: str) -> Optional[Dict]:
        """Get latest firmware version from GitHub directory listing"""
        try:
            url = self.firmware_dirs[model_code]
            response = self.session.get(url)
            response.raise_for_status()
            
            if model_code == 'LEGACY':
                # Handle legacy releases differently
                releases = response.json()
                for release in releases:
                    if release['tag_name'].startswith('legacy/'):
                        version = release['tag_name'].replace('legacy/v', '')
                        return {
                            'version': version,
                            'date': release['published_at'][:10],
                            'model_code': model_code,
                            'model_name': self.models.get(model_code, model_code)
                        }
            else:
                files = response.json()
                
                # Extract version numbers from .bin files
                versions = []
                for file_info in files:
                    if file_info['name'].endswith('.bin') and not file_info['name'].endswith('-bitcoinonly.bin'):
                        # Extract version from filename like "trezor-t3t1-2.8.10.bin"
                        match = re.search(r'-(\d+\.\d+\.\d+)\.bin$', file_info['name'])
                        if match:
                            version = match.group(1)
                            versions.append((version, file_info['name']))
                
                if versions:
                    # Sort versions to get the latest
                    latest_version = max(versions, key=lambda x: tuple(map(int, x[0].split('.'))))
                    return {
                        'version': latest_version[0],
                        'filename': latest_version[1],
                        'model_code': model_code,
                        'model_name': self.models.get(model_code, model_code)
                    }
        except Exception as e:
            print(f"Error getting firmware dir for {model_code}: {e}")
        return None

    def extract_all_versions_changelog(self) -> Dict:
        """Extract version information from all changelog files"""
        results = {}
        
        print("Extracting from changelog files...")
        for model_code in self.changelog_urls.keys():
            print(f"Processing {model_code} ({self.models.get(model_code, model_code)})...")
            result = self.parse_changelog(model_code)
            if result:
                results[model_code] = result
                print(f"  ✓ Found version {result['version']} ({result['date']})")
            else:
                print(f"  ✗ Failed to extract version info")
        
        return results

    def extract_all_versions_firmware_dirs(self) -> Dict:
        """Extract version information from firmware directories"""
        results = {}
        
        print("\nExtracting from firmware directories...")
        for model_code in self.firmware_dirs.keys():
            print(f"Processing {model_code} ({self.models.get(model_code, model_code)})...")
            result = self.get_latest_from_firmware_dir(model_code)
            if result:
                results[model_code] = result
                print(f"  ✓ Found version {result['version']} ({result.get('filename', 'N/A')})")
            else:
                print(f"  ✗ Failed to extract version info")
        
        return results

    def get_legacy_version(self) -> Optional[Dict]:
        """Get latest legacy (Trezor One) version from GitHub tags page"""
        try:
            # Get the tags page
            url = "https://github.com/trezor/trezor-firmware/tags"
            response = self.session.get(url)
            response.raise_for_status()
            content = response.text
            
            # Parse HTML with BeautifulSoup
            soup = BeautifulSoup(content, 'html.parser')
            
            # Find all tag links
            tag_links = soup.select('a[href*="/trezor/trezor-firmware/releases/tag/legacy"]')
            
            legacy_versions = []
            for link in tag_links:
                tag_text = link.text.strip()
                if tag_text.startswith('legacy/v'):
                    version = tag_text.replace('legacy/v', '')
                    # Find the date info in the parent elements
                    date_element = link.find_parent('div').find_next_sibling('div')
                    if date_element:
                        date_info = date_element.text.strip()
                        legacy_versions.append((version, date_info))
                        print(f"Found legacy version: {version} ({date_info})")
            
            if legacy_versions:
                # Sort versions to get the latest
                sorted_versions = sorted(legacy_versions, key=lambda x: tuple(map(int, x[0].split('.'))))
                latest_version, date_info = sorted_versions[-1]  # Get the last (highest) version
                
                return {
                    'version': latest_version,
                    'date': date_info,
                    'model_code': 'LEGACY',
                    'model_name': self.models['LEGACY']
                }
            else:
                print("No legacy versions found in the tags page")
        except Exception as e:
            print(f"Error getting legacy version: {e}")
        return None

    def display_results(self, results: Dict, method_name: str):
        """Display results in a formatted table"""
        print(f"\n{'='*60}")
        print(f"RESULTS - {method_name}")
        print(f"{'='*60}")
        print(f"{'Model':<20} {'Code':<8} {'Version':<10} {'Date/Info'}")
        print(f"{'-'*60}")
        
        for model_code, info in results.items():
            model_name = info['model_name']
            version = info['version']
            date_info = info.get('date', info.get('filename', 'N/A'))
            print(f"{model_name:<20} {model_code:<8} {version:<10} {date_info}")

def main():
    extractor = TrezorFirmwareExtractor()
    
    print("Trezor Firmware Version Extractor")
    print("="*50)
    
    # Method 1: Changelog parsing
    changelog_results = extractor.extract_all_versions_changelog()
    
    # Method 2: Firmware directory parsing
    firmware_results = extractor.extract_all_versions_firmware_dirs()
    
    # Get legacy version
    print("\nGetting legacy (Trezor One) version...")
    legacy_info = extractor.get_legacy_version()
    if legacy_info:
        changelog_results['LEGACY'] = legacy_info
        firmware_results['LEGACY'] = legacy_info
        print(f"  ✓ Found legacy version {legacy_info['version']}")
    
    # Display results
    extractor.display_results(changelog_results, "CHANGELOG METHOD")
    extractor.display_results(firmware_results, "FIRMWARE DIRECTORY METHOD")
    
    # Print a summary
    print(f"\n✓ Extraction completed at {datetime.now().isoformat()}")
    print(f"✓ Found information for {len(set(changelog_results.keys()) | set(firmware_results.keys()))} Trezor models")
    
    # Print the URLs used for reference
    print("\nReference URLs:")
    print("- GitHub Tags: https://github.com/trezor/trezor-firmware/tags")
    for model, url in extractor.changelog_urls.items():
        print(f"- {model} Changelog: {url}")
    for model, url in extractor.firmware_dirs.items():
        print(f"- {model} Firmware: {url}")

if __name__ == "__main__":
    main()
