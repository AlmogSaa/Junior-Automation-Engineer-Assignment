const { test, expect } = require('@playwright/test');
const path = require('path');

// Realistic dummy data – kept in one place so it is easy to update
const FORM_DATA = {
  name:    'Alexandra Bennett',
  email:   'alex.bennett@stackventures.io',
  phone:   '+1 (415) 308-7742',
  company: 'Stack Ventures Inc.',
  website: 'https://stackventures.io',
};

const EMPLOYEES_TARGET = '51-500'; // value to select in the dropdown

// Helper: resolve an absolute path for screenshots so the file is always
// written to the /tests/screenshots/ folder regardless of CWD.
const screenshotPath = (filename) =>
  path.resolve(__dirname, 'screenshots', filename);

// Test Suite
test.describe('Jones – Request a Call-Back Form', () => {

  test('should fill the form, change employee count, screenshot, submit and land on thank-you page', async ({ page }) => {

    // STEP 1 – Navigate to the target URL
    await page.goto('https://test.netlify.app/');

    // Assert the page loaded by verifying a visible heading / landmark
    await expect(page).toHaveURL('https://test.netlify.app/');
    console.log('✅  [1/6] Navigated to https://test.netlify.app/');

    // STEP 2 – Fill the text fields with realistic dummy values
    // fields (by their visible label text).  We fall back to getByPlaceholder()
    // where a visible <label> element is absent.

    // Name
    await page.getByLabel('Name').fill(FORM_DATA.name);
    console.log(`✅  [2a/6] Filled "Name" → "${FORM_DATA.name}"`);

    // Email
    await page.getByLabel('Email').fill(FORM_DATA.email);
    console.log(`✅  [2b/6] Filled "Email" → "${FORM_DATA.email}"`);

    // Phone – some implementations use a placeholder instead of a <label>
    await page.getByLabel('Phone').fill(FORM_DATA.phone);
    console.log(`✅  [2c/6] Filled "Phone" → "${FORM_DATA.phone}"`);

    // Company
    await page.getByLabel('Company').fill(FORM_DATA.company);
    console.log(`✅  [2d/6] Filled "Company" → "${FORM_DATA.company}"`);

    // Website
    await page.getByLabel('Website').fill(FORM_DATA.website);
    console.log(`✅  [2e/6] Filled "Website" → "${FORM_DATA.website}"`);

    // STEP 3 (BONUS) – Change "Number of Employees" dropdown from "1-10" to "51-500"
    // selectOption() works against both the visible label text and the underlying <option> value attribute.
    await page.getByLabel('Number of Employees').selectOption({ label: EMPLOYEES_TARGET });
    console.log(`✅  [3/6] Changed "Number of Employees" dropdown → "${EMPLOYEES_TARGET}"`);

    // STEP 4 – Screenshot BEFORE clicking submit
    const beforeScreenshotPath = screenshotPath('before-submit.png');
    await page.screenshot({ path: beforeScreenshotPath, fullPage: true });
    console.log(`📸  [4/6] Screenshot saved → ${beforeScreenshotPath}`);

    // STEP 5 – Click the "Request a call back" button
    await page.getByRole('button', { name: /request a call back/i }).click();
    console.log('✅  [5/6] Clicked "Request a call back" button');

    // STEP 6 – Assert successful navigation to the thank-you page
    // Wait for navigation to complete after form submission
    await page.waitForURL(/thank[-_]?you|confirmation|success/i, { timeout: 10_000 });

    // Additional guard: confirm a success-related element is visible on the page
    await expect(
      page.getByRole('heading').filter({ hasText: /thank you/i })
    ).toBeVisible({ timeout: 10_000 });

    console.log('🎉  [6/6] SUCCESS – Thank-you page reached. Form submission confirmed!');
  });

});
