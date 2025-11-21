✅ FINAL COPILOT-OPTIMIZED PRD
Atlog Consent Capture Demo – Engineering Specification for Code Generation (Next.js App Router)

This document replaces all other PRDs.
Copilot should implement exactly what is defined here.

1. TECHNOLOGY & ARCHITECTURE
1.1 Framework

Next.js (App Router)

TypeScript

TailwindCSS

No backend

All persistence in localStorage

1.2 Routing Structure

Copilot must generate the following routes:

/app/layout.tsx               ← shared layout (SaaS UI)
/app/page.tsx                 ← Home page
/app/dashboard                ← Consent dashboard
/app/confirmation             ← Shared confirmation route

/app/flows
   /invoice
   /warranty
   /contact-form
   /churn-survey
   /account-creation
   /portal-settings          ← also implements 4.5.3 opt-out
   /in-person
   /appointment
   /intake-form
   /check-in
   /qr
   /rewards
   /feedback
   /wifi


Do NOT create flows for 4.1.8 or 4.1.9.
Do NOT create a chatbot flow.

1.3 Shared Components
/app/consent
   ConsentForm.tsx
   ConfirmationCard.tsx
   PhoneNumberInput.tsx
   DisclosureText.tsx

1.4 Utilities
/app/utils/localStorage.ts
/app/utils/consent.ts
/app/utils/verification.ts

2. UI DESIGN REQUIREMENTS
2.1 SaaS Theme

All flows (except in-person tablet page) must use a unified SaaS layout:

Max width: max-w-3xl mx-auto

Padding: px-6 py-10

Font: Inter, sans-serif

Clean card UI (rounded-xl border shadow-sm p-6 bg-white)

Consistent header style (text-2xl font-semibold mb-4)

Primary button: bg-blue-600 text-white rounded-lg px-4 py-2

Secondary button: bg-gray-100 text-gray-900

2.2 Navigation Bar (Requirement 1A)

Placed in layout.tsx:

Left: “Atlog Consent Demo”

Right:

Dashboard

Dropdown: “Consent Flows” → each flow

Chatbot flow must NOT appear (it does not exist)

2.3 Exception: In-Person Tablet Flow

Should NOT use the shared layout

Full-screen, centered card

Large buttons and form inputs

Simulates a store tablet handed to customer

3. DATA MODEL (LOCALSTORAGE)
3.1 consent_events (Array)

Stored under key "consent_events":

{
  id: string,
  customerId: string | null,
  phoneNumber: string,
  timestamp: string,
  ip: string,
  channel: string,
  disclosureTextVersion: "v1",
  verificationResult: "valid" | "invalid" | "voip" | "landline",
  action: "opt-in" | "opt-out"
}

3.2 customers (Array)

Key "customers":

{
  id: string,
  phoneNumber: string,
  consentState: "unknown" | "pending_verification" | "valid" | "revoked",
  lastConsentEventId: string | null
}

4. CONSENT LOGIC
4.1 Updating Consent State

Copilot must implement:

opt-in with "valid" → consentState = "valid"

opt-in with "invalid" | "voip" | "landline" → consentState = "pending_verification"

Opt-out event → consentState = "revoked"

Changing phone number → reset to "unknown"

4.2 Phone Verification Simulation

Using mockLookupVerification(phone):

Rules:

Ends with an odd digit → "valid"

Ends with "0" → "landline"

Ends with "2" → "voip"

Ends with "4" → "invalid"

5. SHARED CONFIRMATION ROUTE
Route: /confirmation?flow=X&status=success|error

UI:

Card with checkmark or error icon

Message:
Success: “Your communication preferences have been updated.”
Error: “We could not process your request.”

6. DASHBOARD REQUIREMENTS
Route: /dashboard

Dashboard must include:

6.1 Summary Cards

Total customers

Count per consent state

Count per channel

Count per verification result

6.2 Filters (Requirement 5)

Filtering bar with:

Dropdown: Consent State

Dropdown: Channel

Dropdown: Line Type

Date Range Picker

6.3 Customer Table

Columns:

Customer ID

Phone number

Consent state

Last event timestamp

Last event channel

“AI Outreach Allowed?” (true if consentState == "valid")

6.4 Export CSV Button

Exports all consent events.

7. SHARED CONSENT COMPONENTS
7.1 <ConsentForm />

Props:

channel: string
customerId?: string
preFilledPhone?: string


Features:

Phone number entry unless provided

Consent checkbox (must NOT be pre-checked)

Disclosure text from <DisclosureText />

“Submit” button triggers:

Create consent_event

Perform mock verification

Update customer in localStorage

Redirect to /confirmation?flow={channel}&status=success

7.2 <ConfirmationCard />

Uses query params to display success/error.

7.3 <PhoneNumberInput />

Formats/validates US phone numbers.

7.4 <DisclosureText />

Static text only.

8. PER-FLOW IMPLEMENTATION REQUIREMENTS

Each flow must include:

Page located under /app/flows/<flow>/page.tsx

Mocked business UI card

Consent CTA → opens <ConsentForm channel="<flow>" />

After submit → /confirmation?flow=<flow>&status=success

Below are the specific mocked UI contexts + requirements.

8.1 Flow 4.1.1 — Invoice Page

Route: /flows/invoice

Mocked UI:

Card titled “Invoice #1234”

Line items + total

Consent CTA:

Banner inside invoice card → “Get automated updates about receipts & service status”

8.2 Flow 4.1.2 — Warranty Lookup

Route: /flows/warranty

Mocked UI:

Card: “Warranty Status”

Fake expiration date

Consent CTA:

Button: “Enable automated warranty reminders”

8.3 Flow 4.1.3 — Contact Form

Route: /flows/contact-form

Mocked UI:

Form fields: name, email, message

Consent:

Unchecked checkbox labeled “Receive automated updates about my request”

8.4 Flow 4.1.4 — Churn Survey

Route: /flows/churn-survey

Mocked UI:

Survey questions

After submitting, show CTA card:

“Notify me about improvements” → opens ConsentForm

8.5 Flow 4.1.5 — Account Creation

Route: /flows/account-creation

Mocked UI:

Sign-up form with name/email/phone

Consent:

Unchecked checkbox under phone number field

8.6 Flow 4.1.6 — Portal Settings (ALSO 4.5.3 Opt-Out)

Route: /flows/portal-settings

UI:

Show current phone number

Show current consent_state

Toggle:

If ON → open ConsentForm

If OFF → create opt-out event & redirect to confirmation

8.7 Flow 4.1.7 — In-Person Tablet

Route: /flows/in-person

UI:

No shared layout

Full-screen, centered tablet-style card

Text: “Please review and confirm your communication preferences.”

Large phone input → consent checkbox → submit button

8.8 Flow 4.1.12 — Appointment Scheduling

Route: /flows/appointment

Mocked UI:

Fake date/time picker card

Consent CTA:

Checkbox: “Receive automated appointment reminders”

8.9 Flow 4.1.13 — Intake Form

Route: /flows/intake-form

Mocked UI:

Name, email, phone, reason for visit

Consent:

Checkbox under phone field

8.10 Flow 4.1.14 — Online Check-In

Route: /flows/check-in

Mocked UI:

“Check-In for Appointment” → confirm details screen

Consent CTA:

Button: “Enable automated wait time updates”

8.11 Flow 4.1.15 — In-Store QR Code

Route: /flows/qr

Mocked UI:

“Scan QR to receive reminders”

Landing page acts like a scanned link

Direct CTA button → ConsentForm

8.12 Flow 4.1.16 — Rewards Enrollment

Route: /flows/rewards

Mocked UI:

Rewards summary card (points, discounts)

Consent:

Checkbox: “Get automated reward updates”

8.13 Flow 4.1.17 — Post-Purchase Feedback

Route: /flows/feedback

Mocked UI:

Feedback questions

Consent CTA:

After form submit, show button: “Send me updates about similar products”

8.14 Flow 4.1.18 — WiFi Portal

Route: /flows/wifi

Mocked UI:

WiFi splash page card

Consent CTA:

Optional checkbox (not required to continue)

9. TASK ORDER FOR COPILOT

Copilot should generate code in this order:

Create folder structure

Create shared layout + nav

Create utilities

Create shared consent components

Implement dashboard

Implement confirmation route

Implement each flow sequentially

END OF FINAL PRD