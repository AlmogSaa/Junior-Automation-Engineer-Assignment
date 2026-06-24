# Jones PropTech – QA Take-Home Assignment
### Junior Automation Engineer · Playwright + Node.js

---

## Project Structure

```
jones-qa-take-home/
├── tests/
│   ├── requestCallback.spec.js   # ← Main Playwright automation script
│   └── screenshots/              # ← Pre-submit screenshot saved here at runtime
├── playwright.config.js          # ← Cross-browser config (Chrome, Firefox, WebKit)
├── package.json
├── QA_ANALYSIS.md                # ← Part 2: Written QA analysis answers
└── README.md                     # ← This file
```

---

## Prerequisites

| Tool | Minimum Version | Notes |
|------|----------------|-------|
| [Node.js](https://nodejs.org/) | v18.0.0 | LTS recommended |
| npm | v9.0.0 | Bundled with Node.js |

Verify your versions:
```bash
node --version
npm --version
```

---

## Setup & Installation

### Step 1 — Clone / unzip the project and enter the directory
```bash
cd jones-qa-take-home
```

### Step 2 — Install Node.js dependencies
```bash
npm install
```

### Step 3 — Install Playwright browsers (Chromium, Firefox, WebKit)
```bash
npx playwright install
```
> This downloads the browser binaries Playwright needs. It may take a minute on first run.

---

## Running the Tests

### Run all tests (headless, all browsers)
```bash
npm test
```

### Run with visible browser window (great for demos)
```bash
npm run test:headed
```

### Open the interactive Playwright UI mode
```bash
npm run test:ui
```

### View the HTML report after a run
```bash
npm run report
```

---

## What the Test Does

The single test in `tests/requestCallback.spec.js` performs the following automated steps against `https://test.netlify.app/`:

| Step | Action |
|------|--------|
| 1 | Navigate to the target URL |
| 2 | Fill **Name**, **Email**, **Phone**, **Company**, and **Website** fields with realistic dummy data |
| 3 | *(Bonus)* Change the **Number of Employees** dropdown from `1-10` → `51-500` |
| 4 | Save a **full-page screenshot** to `tests/screenshots/before-submit.png` |
| 5 | Click the **"Request a call back"** button |
| 6 | Assert that the thank-you / confirmation page is reached and log a success message |

Console output example:
```
✅  [1/6] Navigated to https://test.netlify.app/
✅  [2a/6] Filled "Name" → "Alexandra Bennett"
✅  [2b/6] Filled "Email" → "alex.bennett@stackventures.io"
✅  [2c/6] Filled "Phone" → "+1 (415) 308-7742"
✅  [2d/6] Filled "Company" → "Stack Ventures Inc."
✅  [2e/6] Filled "Website" → "https://stackventures.io"
✅  [3/6] Changed "Number of Employees" dropdown → "51-500"
📸  [4/6] Screenshot saved → /tests/screenshots/before-submit.png
✅  [5/6] Clicked "Request a call back" button
🎉  [6/6] SUCCESS – Thank-you page reached. Form submission confirmed!
```

---

## Configuration

All Playwright settings live in `playwright.config.js`. Key options:

| Setting | Value | Notes |
|---------|-------|-------|
| `testDir` | `./tests` | Where specs are discovered |
| `retries` | `1` | Flaky-test resilience |
| `timeout` | `30 000 ms` | Per-test timeout |
| `reporter` | `list` + `html` | HTML report in `playwright-report/` |
| `screenshot` | `only-on-failure` | Automatic failure screenshots |
| `video` | `on-first-retry` | Video recorded on retry |
| Browsers | Chrome, Firefox, WebKit | Full cross-browser matrix |

---

## Part 2 – QA Analysis

See **[QA_ANALYSIS.md](./QA_ANALYSIS.md)** for:

- **2a** — Identified UI problems (Security, Usability, Functionality)
- **2b** — 3 sample test cases (happy path, two negative paths)
- **2c** — Product solution for the most severe bug (missing CVV field)
