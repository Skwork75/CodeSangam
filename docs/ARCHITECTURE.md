# CodeSangam Architecture

## Overview
CodeSangam is a Chrome Extension (Manifest V3) designed to help competitive programmers find equivalent coding problems across platforms (LeetCode, HackerRank, CodeChef).

## Architecture Layers

1. **Popup UI (`popup/`)**
   - Renders the user interface when the extension icon is clicked.
   - Communicates with the active tab via Chrome API (`activeTab`) to get the current URL.
   - Securely renders content using `textContent`.

2. **Application Logic (`lib/`)**
   - **`slug.js`**: Parses and extracts problem slugs from LeetCode URLs.
   - **`matcher.js`**: Acts as the sole data access layer, loading and querying problem mappings from the local database.

3. **Data Layer (`data/`)**
   - **`mappings.json`**: Static JSON file storing verified problem mappings keyed by LeetCode slug.

4. **Testing & Scripts (`scripts/`)**
   - Node.js-based test scripts to validate core logic and data integrity.
