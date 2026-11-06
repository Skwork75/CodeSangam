<div align="center">

# 🧩 CodeSangam

### Where coding problems meet across platforms.

*One problem, many platforms. Find the same problem on LeetCode, HackerRank, and CodeChef in one click.*

[![Manifest](https://img.shields.io/badge/Manifest-V3-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![Status](https://img.shields.io/badge/Status-v0.1.0-green?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT-26A641?style=for-the-badge)](#)

</div>

---

## 📖 About

**Sangam** means "confluence", the place where two rivers meet. CodeSangam is a Chrome extension that connects the same coding problem across platforms. Practicing on several sites often means solving the same problem twice without knowing it. CodeSangam tells you when a LeetCode problem has an equivalent on HackerRank or CodeChef, so you can practice the same idea on another platform in one click.

---

## ✨ Features

- 🔍 **One-click lookup:** Open a LeetCode problem and click the icon.
- 🔗 **Direct links:** Opens the equivalent problem on HackerRank and CodeChef.
- ⚡ **Instant results:** Data is bundled locally, so there is no loading delay.
- 🌙 **Dark theme:** Matches the look of LeetCode.
- 🔒 **Privacy-first:** No tracking, no accounts, no data collection.
- 🆓 **Free forever:** No backend or subscription required for core features.

---

## 🏗️ How It Works

```
LeetCode tab  ──►  Popup reads URL  ──►  Extracts slug  ──►  Looks up mappings.json  ──►  Shows links
```

1. You open a problem such as `leetcode.com/problems/two-sum/`.
2. You click the CodeSangam icon.
3. The extension extracts the slug (`two-sum`).
4. It looks up the slug in a verified mapping database.
5. It shows the matching HackerRank and CodeChef problems, or a "not found" message.

For the full technical design, see [`docs/ARCHITECTURE.md`](`docs/ARCHITECTURE.md`).

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Extension | Chrome Manifest V3 |
| UI | HTML, CSS, Vanilla JavaScript (ES Modules) |
| Data | Local JSON (`mappings.json`) |
| Testing & Validation | Node.js built-in `node:test` and custom scripts |

---

## 📁 Project Structure

```
codesangam/
├── manifest.json
├── package.json
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── lib/
│   ├── slug.js
│   └── matcher.js
├── data/
│   └── mappings.json
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── scripts/
│   ├── test_slug.mjs
│   ├── validate_mappings.mjs
│   └── make_icons.py
└── docs/
    └── ARCHITECTURE.md
```

---

## 🚀 Installation

### Load the extension locally in Chrome

1. Clone or download the repository:
   ```bash
   git clone https://github.com/Skwork75/CodeSangam.git
   cd CodeSangam
   ```
2. Open Google Chrome and go to `chrome://extensions`.
3. Turn on **Developer mode** (top right toggle).
4. Click **Load unpacked** (top left button) and select the `CodeSangam` root folder.
5. Pin **CodeSangam** from the puzzle icon extension menu in the Chrome toolbar.

---

## 📘 Usage

1. Open any problem on LeetCode, for example [Two Sum](https://leetcode.com/problems/two-sum/).
2. Click the **CodeSangam** icon in your toolbar.
3. View the equivalent problem titles and click **Open** to practice on HackerRank or CodeChef.

---

## 🗂️ Mapping Database

Mappings are stored in `data/mappings.json`, keyed by the LeetCode slug:

```json
{
  "two-sum": {
    "leetcode": { "title": "Two Sum", "difficulty": "Easy" },
    "hackerrank": { "title": "Solve Me First", "url": "https://www.hackerrank.com/challenges/solve-me-first/problem" },
    "codechef": null,
    "verified": true,
    "lastUpdated": "2026-03-30"
  }
}
```

**Rule:** Only true equivalents are added. The same core problem with the same expected output counts as a match. A related problem does not.

---

## ⚠️ Current Limitations

- Covers an initial curated dataset of verified problems (expanding continuously).
- Supports LeetCode problem URLs (HackerRank and CodeChef target matching).

---

## 🔐 Privacy

CodeSangam reads the URL of the active tab only when you click the extension icon. It does not collect, store, transmit, or share any personal data, telemetry, or browsing history.

---

## 🤝 Contributing & Bug Reports

Contributions are welcome, especially new verified mappings.

1. Fork the repository.
2. Add or edit an entry in `data/mappings.json`.
3. Run `npm run validate` to ensure schema compliance.
4. Open a pull request.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](`LICENSE`) for details.

---

<div align="center">

**Built with ❤️ in India by [Saurabh Kumar](https://github.com/Skwork75)**
· [LinkedIn](https://www.linkedin.com/in/saurabh-kumar-185005345/)
· [LeetCode](https://leetcode.com/u/Saurab_h_Singh/)

⭐ If CodeSangam helps your practice, consider starring the repo.

</div>
