# QA Analysis – Billing Widget UI Mock-Up
### Jones PropTech SaaS · Junior Automation Engineer Assignment
---

## Part 2a — UI Problems & Issues Found

The following issues were identified by analysing the billing widget mock-up across the dimensions of **Security**, **Usability**, and **Functionality/Completeness**.

---

### 🔴 Critical Issues

#### 1. Missing CVV / CVC Field *(Security – P0)*
**Observation:** The form collects Card Number, Expiration, and Cardholder Name, but has no field for the Card Verification Value (CVV/CVC) — the 3- or 4-digit security code printed on the card.

**Impact:** CVV is a mandatory data element in virtually every card-not-present (CNP) payment gateway. Without it, the transaction will be rejected at the processor level, meaning the form **cannot complete a real payment** in its current state. More critically, omitting CVV removes a key authentication layer that protects cardholders from fraudulent use of stolen card numbers.

**Risk Level:** P0 – Blocker. The feature is non-functional and insecure as designed.

---

#### 2. Plaintext Card Number Input — No Masking *(Security – P0)*
**Observation:** The card number field appears to be a standard `<input type="text">`. There is no indication that the entered value is masked (e.g., displayed as `•••• •••• •••• 4242`), auto-formatted, or tokenised client-side before transmission.

**Impact:** Displaying the full PAN (Primary Account Number) in plaintext on screen exposes it to shoulder-surfing. It also suggests the raw number may be transmitted and/or logged without proper tokenisation, which is a **PCI-DSS compliance violation**.

**Risk Level:** P0 – Security and compliance blocker.

---

#### 3. No HTTPS / Secure Transmission Indicator Visible *(Security – P1)*
**Observation:** The mock-up does not surface any visual trust signal (padlock icon, "Secure Payment" badge, or references to encryption). While a live implementation may use TLS, the absence in the design means this was not considered.

**Impact:** Users are less likely to trust and complete the form. More critically, if the production implementation inherits the oversight, sensitive payment data could be transmitted over an unencrypted connection.

**Risk Level:** P1 – High. Must be addressed before release.

---

### 🟠 High Severity Issues

#### 4. Instruction to Remove Dashes/Spaces from Card Number *(Usability – P1)*
**Observation:** The field label reads: *"Card Number (No dashes or spaces)"*. Users are instructed to manually reformat their 16-digit card number (e.g., type `4111111111111111` instead of `4111 1111 1111 1111`).

**Impact:** This is an unnecessary cognitive burden. Card numbers are printed and mentally chunked in groups of four. Forcing users to strip separators increases transcription errors and form-abandonment rates. Industry best practice is to accept any reasonable format and sanitise server-side (or via an input mask that auto-removes separators as the user types).

**Risk Level:** P1 – High usability defect that directly harms conversion.

---

#### 5. Instruction to Remove Dashes from Postal Code *(Usability – P1)*
**Observation:** Similar to the card number, the field label reads: *"Postal Code (no dashes)"*. This affects ZIP+4 codes (e.g., `90210-1234`) and Canadian postal codes (e.g., `M5V 3L9`).

**Impact:** Breaks the form for international users and creates unnecessary friction for domestic users. Sanitisation should be handled by the application, not delegated to the user.

**Risk Level:** P1 – High. Also an internationalisation (i18n) issue.

---

#### 6. Static, Non-Editable Payment Amount *(Functionality – P1)*
**Observation:** The "Payment Amount" is shown as a static value of `30.00` with no context (currency symbol, invoice reference, or breakdown). It cannot be changed by the user and there is no explanation of what it relates to.

**Impact:** A user arriving at this form without knowing they owe exactly $30.00 (or £30.00, or €30.00?) will be confused. The absence of currency, invoice context, or itemisation undermines trust. If the amount is dynamic (e.g., pulled from an invoice), this needs to be clearly labelled and linked to its source.

**Risk Level:** P1 – UX and trust issue.

---

### 🟡 Medium Severity Issues

#### 7. Middle Initial (MI) Field — Questionable Value *(Usability – P2)*
**Observation:** The Cardholder Name section includes a separate "MI" (Middle Initial) field, marked as optional.

**Impact:** Payment processors match the cardholder name against the name on the bank's record as a single string. Splitting first name, MI, and last name into three fields introduces a concatenation risk (e.g., does the system produce `"Alexandra B. Bennett"` or `"Alexandra Bennett"`?). This can cause unnecessary AVS (Address Verification System) mismatches and declined transactions.

**Risk Level:** P2 – Medium. Recommend replacing with a single "Full Name as it appears on card" field.

---

#### 8. No Field-Level Validation Feedback Specified *(Functionality – P2)*
**Observation:** The mock-up does not show any inline validation states (e.g., red border on invalid input, helper text such as "Card number must be 16 digits").

**Impact:** Without clear, immediate validation feedback, users submitting incorrect data will only discover their mistake after a round-trip to the server — or worse, receive a generic error page. This dramatically harms the self-serve experience expected in a SaaS billing context.

**Risk Level:** P2.

---

#### 9. No "Save Payment Method" / Accessibility Options Visible *(Usability – P3)*
**Observation:** There is no option to save the card for future use, nor are there any accessibility considerations noted (e.g., ARIA labels, screen-reader-friendly error regions).

**Risk Level:** P3 – Low/enhancement, but worth raising for a SaaS billing context where repeat billing is common.

---

## Part 2b — Sample Test Cases

---

### TC-001: Happy Path – Successful Payment Submission

| Field | Detail |
|---|---|
| **Test Case ID** | TC-001 |
| **Title** | Valid payment details submitted successfully |
| **Type** | Functional – Happy Path |
| **Priority** | P0 |

**Preconditions:**
- User is authenticated and navigated to the billing payment screen.
- The form is in its default, empty state.
- A valid test Visa card is available (e.g., `4111 1111 1111 1111`, Exp: `12/26`, CVV: `123` — *once CVV field is added*).

**Test Steps:**

| Step | Action | Expected Result |
|---|---|---|
| 1 | Select **"VISA"** from the Card Type dropdown | Dropdown updates to display "VISA" |
| 2 | Observe the Payment Amount field | Field displays `$30.00` (or appropriate currency) and is read-only |
| 3 | Enter `4111111111111111` in the Card Number field | 16-digit number is accepted; optionally auto-formatted as `4111 1111 1111 1111` |
| 4 | Enter `123` in the CVV field *(field to be added)* | 3-digit value is accepted and masked |
| 5 | Select **"12"** from the Expiration Month dropdown | Month is selected |
| 6 | Select **"2026"** from the Expiration Year dropdown | Year is selected |
| 7 | Enter **"Alexandra"** in the First Name field | Text is accepted |
| 8 | Enter **"B"** in the MI field (optional) | Single character is accepted |
| 9 | Enter **"Bennett"** in the Last Name field | Text is accepted |
| 10 | Enter **"123 Main Street"** in the Billing Street Address field | Text is accepted |
| 11 | Enter **"San Francisco"** in the City field | Text is accepted |
| 12 | Select **"CA"** from the State/Province dropdown | State is selected |
| 13 | Enter **"94105"** in the Postal Code field | 5-digit ZIP code is accepted |
| 14 | Click the **"Continue"** button | Page navigates to a payment confirmation/receipt screen |

**Expected Outcome:** Payment is processed successfully. User sees a confirmation screen with a reference number and summary of the transaction.

---

### TC-002: Negative Path – Missing Mandatory Fields (Required Field Validation)

| Field | Detail |
|---|---|
| **Test Case ID** | TC-002 |
| **Title** | Form submission blocked when all required fields are empty |
| **Type** | Functional – Negative Path |
| **Priority** | P0 |

**Preconditions:**
- User is on the billing payment screen with all fields empty.

**Test Steps:**

| Step | Action | Expected Result |
|---|---|---|
| 1 | Leave all form fields completely blank | All fields remain empty |
| 2 | Click the **"Continue"** button | Form submission is **blocked** |
| 3 | Observe the state of each required field | All required fields (Card Type, Card Number, CVV, Expiration, First Name, Last Name, Address, City, State, Postal Code) display a visible validation error |
| 4 | Observe the error messages | Each error clearly describes what is required (e.g., "Card number is required", not a generic "Please fix errors") |
| 5 | Observe page URL | URL remains on the payment form; no navigation occurs |

**Expected Outcome:** The form does not submit. All required fields surface distinct, clear, inline error messages. No network request is made to the payment processor.

---

### TC-003: Negative Path – Invalid Card Number Format

| Field | Detail |
|---|---|
| **Test Case ID** | TC-003 |
| **Title** | Invalid card number rejected with descriptive error |
| **Type** | Functional – Negative Path / Boundary |
| **Priority** | P0 |

**Preconditions:**
- User is on the billing payment screen.
- All other fields are filled with valid data.

**Test Steps:**

| Step | Action | Expected Result |
|---|---|---|
| 1 | Enter **"1234"** (too short, 4 digits) in the Card Number field | Input is accepted by the field |
| 2 | Click **"Continue"** | Submission is blocked |
| 3 | Observe the Card Number field | An inline error is shown: e.g., *"Card number must be 13–16 digits"* |
| 4 | Clear the field and enter **"9999999999999999"** (16 digits but fails Luhn check) | Input is accepted by the field |
| 5 | Click **"Continue"** | Submission is blocked |
| 6 | Observe the Card Number field | Inline error: e.g., *"Please enter a valid card number"* |
| 7 | Enter a valid 16-digit number: **"4111111111111111"** | Field accepts the value; error clears |
| 8 | Click **"Continue"** | Form proceeds to the next step |

**Expected Outcome:** Client-side Luhn algorithm validation rejects invalid card numbers immediately, without a server round-trip. Error messaging is specific and actionable.

---

## Part 2c — Product Solution for the Most Severe Bug

### Bug: Missing CVV / CVC Field

**Severity:** P0 — Critical. This is the most severe issue because it simultaneously makes the form **non-functional** (payments will be declined) and **insecure** (removes a required authentication factor for CNP transactions).

---

### Recommended Solution

#### 1. Add a CVV/CVC Input Field

Insert a clearly labelled, required `CVV / Security Code` field immediately after the Card Number field. This ordering mirrors the physical layout of a payment card (number, then the code on the signature strip or front) and matches the pattern users have learned from other checkout flows (Amazon, Stripe, PayPal, etc.).

**Field Specification:**

| Attribute | Value |
|---|---|
| Label | `CVV / Security Code` |
| Required | Yes |
| Input type | `password` or masked text |
| Max length | 4 characters (to accommodate Amex's 4-digit CID) |
| Validation | Numeric only; 3 digits for Visa/Mastercard/Discover, 4 for Amex (derive from selected Card Type) |
| Helper text | *"3 digits on the back of your card (4 digits for American Express)"* |
| Tooltip/icon | A small `?` icon alongside the label that reveals an image showing where the CVV is located on the card |

#### 2. Implement Client-Side Masking

The input should be `type="password"` or use a controlled component that masks the value after entry. This prevents shoulder-surfing.

#### 3. Never Store the CVV

Transmit the CVV only to the payment processor (Stripe, Braintree, etc.) via their client-side SDK (e.g., Stripe.js). The CVV **must never be stored** on Jones' own servers — this is a hard PCI-DSS requirement (Requirement 3.2.2). The recommended architecture is:

```
User Browser
     │  (HTTPS, CVV in Stripe.js iframe / tokenised)
     ▼
Payment Processor (Stripe / Braintree)
     │  (Returns a payment method token)
     ▼
Jones Backend  ←── stores only the token, never raw card data
```

#### 4. Adjust the Card Type Dropdown to Drive Validation
When the user selects **American Express**, the CVV field label should automatically update to **"CID (4 digits)"** and its `maxlength` attribute should change to `4`. This can be achieved with a simple `onChange` listener on the Card Type dropdown — no back-end involvement required.

#### 5. Updated Acceptance Criteria (Definition of Done)

- [ ] CVV field is present, visible, and marked as required.
- [ ] CVV field accepts only numeric input.
- [ ] CVV field is masked (characters hidden after entry).
- [ ] For Visa / Mastercard / Discover: max 3 digits; for Amex: max 4 digits.
- [ ] A helper tooltip shows the user where to find their CVV on their card.
- [ ] CVV value is transmitted exclusively through the payment processor's secure SDK.
- [ ] CVV value is never logged, stored, or echoed back in any API response.
- [ ] TC-001 (Happy Path) passes end-to-end with CVV included.
- [ ] Submitting with an empty CVV field surfaces the error: *"Security code is required."*
- [ ] Submitting with a non-numeric CVV surfaces: *"Security code must be numeric."*
- [ ] Submitting with a CVV of incorrect length surfaces: *"Security code must be 3 digits (4 for Amex)."*
