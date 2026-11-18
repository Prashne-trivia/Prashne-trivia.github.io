# Prashne (ಪ್ರಶ್ನೆ) — Beginner Code Walkthrough

Welcome, Vishnu! This guide explains how your daily trivia project is structured, how the daily JSON system works, and how you can manage everything easily without any complex server setup.

---

### 📂 1. Project Folder Structure
Your project is split into clean, modular files:
```text
prashne/
├── index.html              # The main player website
├── admin.html              # Your local helper tool to create daily JSON files
├── EXPLAINED.md            # This code walkthrough guide
└── data/
    ├── config.json         # Lists all available daily issue dates & file paths
    └── 2026-11-19.json     # Daily trivia questions for Nov 19, 2026
```

---

### ⚙️ 2. How Daily Trivia Works (100% Free & Static)
1. **The Config File (`data/config.json`)**:
   This file acts as the directory. When a player opens your website, the app checks the current date in **IST (Indian Standard Time)**. It looks up that date in `config.json` to find which JSON file to load.
2. **The Daily JSON File (`data/YYYY-MM-DD.json`)**:
   Each day has its own JSON file containing the 7 questions, 4 options each, correct index (`0` through `3`), and a fun fact explanation.
3. **The Admin Builder (`admin.html`)**:
   Instead of writing code or JSON manually (where a missing comma could break the game), you simply open `admin.html` in your browser, fill in the date, issue number, and 7 questions, and click **Download Daily JSON File**.

---

### 🚀 3. How to Add Daily Trivia (Step-by-Step)
1. Double-click `admin.html` in your project folder to open it in your browser.
2. Select the date for the upcoming drop, type the 7 questions, options, correct answers, and fun facts.
3. Click **Download Daily JSON File**. It will download a file named something like `2026-11-20.json`.
4. Go to your GitHub repository in your web browser.
5. Drag and drop the downloaded JSON file into your `data/` folder and click **Commit changes**.
6. Open your `data/config.json` file on GitHub, click edit (pencil icon), and add the new date entry:
   ```json
   "2026-11-20": {
     "issueNumber": 2,
     "title": "Issue #2: Theme Title Here",
     "file": "data/2026-11-20.json"
   }
   ```
7. Commit changes! GitHub Pages updates instantly across India.

---

### 🎨 4. Key Technologies Used
- **Tailwind CSS (CDN)**: Instantly handles all styling, dark/light mode switching, responsive grids, and tactile button animations without needing any build tools.
- **Tone.js**: Generates procedural arcade sound effects (button clicks, correct chimes, wrong buzzes, and timer ticks) right in the player's browser.
- **LocalStorage**: Safely saves player streaks, games played, and daily scores in their browser.
- **HTML5 Canvas**: Dynamically renders high-resolution (`1080×1920`) Instagram Story scorecard PNGs on the fly when users click "Instagram Story".