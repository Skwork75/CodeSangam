<div align="center">

# 🧩 CodeSangam

### Where coding problems meet across platforms.

*One problem, many platforms. Find the same problem on LeetCode, HackerRank, and CodeChef in one click.*

[![Manifest](https://img.shields.io/badge/Manifest-V3-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge)](#)
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

## 🖼️ Preview

> Add a screenshot of the popup to `docs/screenshots/popup.png` and it will appear here.

![CodeSangam Popup](docs/screenshots/popup.png)

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

For the full technical design, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Extension | Chrome Manifest V3 |
| UI | HTML, CSS, Vanilla JavaScript |
| Data | Local JSON (`mappings.json`) |
| Dev tooling | Python (scrapers, fuzzy matching) |
| Planned | Supabase (community contributions) |

---

## 📁 Project Structure

```
codesangam/
├── manifest.json
├── popup/          # UI: popup.html, popup.css, popup.js
├── lib/            # Logic: matcher.js, slug.js
├── data/           # mappings.json
├── icons/
├── scripts/        # Dev-only scrapers and matching tools
└── docs/           # Architecture and screenshots
```

---

## 🚀 Installation

### Load the extension locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Skwork75/CodeSangam.git
   cd CodeSangam
   ```
2. Open Chrome and go to `chrome://extensions`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the `CodeSangam` folder.
5. Pin the extension from the puzzle icon in the toolbar.

---

## 📘 Usage

1. Open any problem on LeetCode, for example [Two Sum](https://leetcode.com/problems/two-sum/).
2. Click the **CodeSangam** icon.
3. Click a platform card to open the equivalent problem.

---

## 🗂️ Mapping Database

Mappings are stored in `data/mappings.json`, keyed by the LeetCode slug:

```json
{
  "two-sum": {
    "leetcode": { "title": "Two Sum", "difficulty": "Easy" },
    "hackerrank": { "title": "...", "url": "https://www.hackerrank.com/..." },
    "codechef": null,
    "verified": true,
    "lastUpdated": "2025-01-15"
  }
}
```

**Rule:** Only true equivalents are added. The same core problem with the same expected output counts as a match. A related problem does not.

---

## 🤝 Contributing

Contributions are welcome, especially new verified mappings.

1. Fork the repository.
2. Add or edit an entry in `data/mappings.json`.
3. Make sure both URLs open and point to the same problem.
4. Open a pull request with the title `mapping: <leetcode-slug>`.

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide. *(Create this file when you open contributions.)*

---

## 🗺️ Roadmap

- [x] Project architecture and data schema
- [x] Popup UI with dark theme
- [ ] MVP dataset: top 100 LeetCode problems
- [ ] Publish to Chrome Web Store
- [ ] "Suggest a mapping" form
- [ ] Support for Codeforces and AtCoder
- [ ] Backend (Supabase) for community mappings

---

## 🔐 Privacy

CodeSangam reads the URL of the active tab only when you click the icon. It does not collect, store, or transmit any personal data.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

**Built with ❤️ in India by [Saurabh Kumar](https://github.com/Skwork75)**
· [LinkedIn](https://www.linkedin.com/in/saurabh-kumar-185005345/)
· [LeetCode](https://leetcode.com/u/Saurab_h_Singh/)

⭐ If CodeSangam helps your practice, consider starring the repo.

</div>