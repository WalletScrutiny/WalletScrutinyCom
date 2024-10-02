import os
import re
import logging
from typing import List

# Set up logging
logging.basicConfig(filename='addHashes.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

VALID_VERDICTS = {'reproducible', 'nonverifiable'}

def find_markdown_files(directory: str) -> List[str]:
    """Find all markdown files in the specified directory."""
    markdown_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                markdown_files.append(os.path.join(root, file))
    return markdown_files

def process_file(file_path: str) -> bool:
    """Process a single markdown file. Returns True if file was processed, False otherwise."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # Check if the verdict is valid
        verdict_match = re.search(r'verdict:\s*(\w+)', content)
        if not verdict_match or verdict_match.group(1).lower() not in VALID_VERDICTS:
            return False

        # Process content
        content = process_content(content)

        # Write the updated content back to the file
        write_file(file_path, content)
        logging.info(f"Successfully processed {file_path}")
        return True

    except Exception as e:
        logging.error(f"Error processing {file_path}: {str(e)}")
        return False

def process_content(content: str) -> str:
    """Process the entire content of the file."""
    # Find the Results block
    results_block_match = re.search(r'===== Begin Results =====.*?===== End Results =====', content, re.DOTALL)
    if results_block_match:
        # Split the content into before, results block, and after
        before_results = content[:results_block_match.start()]
        results_block = content[results_block_match.start():results_block_match.end()]
        after_results = content[results_block_match.end():]

        # Extract appHash from the results block
        app_hash_match = re.search(r'appHash:\s*([0-9a-fA-F]+)', results_block)
        app_hash_value = app_hash_match.group(1) if app_hash_match else None

        # Process before_results
        before_results = process_content_without_results(before_results, app_hash_value)

        # Process after_results
        after_results = process_content_without_results(after_results, None)

        # Reassemble the content
        content = before_results + results_block + after_results
    else:
        # No Results block, process the entire content
        content = process_content_without_results(content, None)

    return content

def process_content_without_results(content: str, app_hash_value: str) -> str:
    """Process the content excluding the Results block."""
    # Ensure appHashes exists in the main section
    main_section_end = content.find('reviewArchive:')
    if main_section_end == -1:
        main_section_end = len(content)
    main_section = content[:main_section_end]

    if 'appHashes:' not in main_section:
        if app_hash_value:
            main_section = re.sub(r'(verdict:.*\n)', r'\1appHashes: [{}]\n'.format(app_hash_value), main_section)
        else:
            main_section = re.sub(r'(verdict:.*\n)', r'\1appHashes: []\n', main_section)
    else:
        # Update appHashes in main section
        if app_hash_value:
            main_section = re.sub(r'appHashes:\s*\[.*?\]', 'appHashes: [{}]'.format(app_hash_value), main_section)

    # Reassemble content
    content = main_section + content[main_section_end:]

    # Process reviewArchive
    content = process_review_archive(content)

    return content

def process_review_archive(content: str) -> str:
    """Process the reviewArchive section."""
    def replace_app_hash(entry_match):
        entry = entry_match.group(0)
        # Process the entry line by line
        lines = entry.split('\n')
        new_lines = []
        for line in lines:
            apphash_match = re.match(r'(\s*)(appHash:)(.*)', line, re.IGNORECASE)
            if apphash_match:
                indent = apphash_match.group(1)
                hash_value = apphash_match.group(3).strip()
                if hash_value:
                    new_lines.append(f"{indent}appHashes: [{hash_value}]")
                else:
                    new_lines.append(f"{indent}appHashes: []")
            else:
                new_lines.append(line)
        return '\n'.join(new_lines)

    # Adjusted pattern to ensure we capture each entry correctly
    review_archive_pattern = r'(-\s*date:.*?)(?=\n-\s*date:|\n$)'
    review_archive_match = re.search(r'reviewArchive:(.*)', content, re.DOTALL)
    if review_archive_match:
        review_archive_content = review_archive_match.group(1)
        updated_review_archive = re.sub(review_archive_pattern, replace_app_hash, review_archive_content, flags=re.DOTALL)
        content = content[:review_archive_match.start()] + "reviewArchive:" + updated_review_archive
    return content

def write_file(file_path: str, content: str):
    """Write the updated content back to the file."""
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)

def main(directory: str):
    """Main function to process all markdown files in the directory."""
    markdown_files = find_markdown_files(directory)
    processed_count = 0
    for file in markdown_files:
        if process_file(file):
            processed_count += 1
    logging.info(f"Successfully processed {processed_count} files.")

if __name__ == "__main__":
    directory = input("Enter the directory path containing markdown files: ")
    main(directory)
