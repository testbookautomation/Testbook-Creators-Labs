# Google Apps Script Webhook — Setup Guide

## Step 1 — Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a **new blank spreadsheet**
2. Name it: `Testbook Student Creator`
3. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/  ← YOUR SHEET ID HERE →  /edit
   ```

## Step 2 — Open Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete any existing code in the editor
3. Copy the **entire contents of `Code.gs`** and paste it in
4. Change the `SECRET_TOKEN` at the top to a strong secret of your choice:
   ```js
   const SECRET_TOKEN = "TB_UGC_SECRET_2025"; // ← change this
   ```
5. (Optional) Add your WebEngage API key and account ID if you have one

## Step 3 — Run Setup

1. In the Apps Script editor, select function **`setupSheets`** from the dropdown
2. Click **Run**
3. Grant permissions when prompted (the script needs to edit your spreadsheet)
4. You should see all 4 sheets created: Submissions, Events, Users, Payout

## Step 4 — Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ next to "Type" and choose **Web app**
3. Fill in:
   - **Description:** Testbook UGC Webhook v1
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. Copy the **Web app URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbXXXXXXXXXXXXXX/exec
   ```

## Step 5 — Connect to Next.js

1. In your Next.js project, copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Open `.env.local` and fill in:
   ```env
   WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   WEBHOOK_SECRET=TB_UGC_SECRET_2025
   ```
   Use the exact same secret as `SECRET_TOKEN` in Code.gs.

3. Restart your dev server:
   ```bash
   npm run dev
   ```

## Step 6 — Test the connection

Open your browser and visit:
```
http://localhost:3000/api/ping
```
You should see:
```json
{ "success": true, "message": "Testbook UGC Webhook OK" }
```

---

## Google Sheet Structure

After setup, 4 sheets are auto-created:

### Submissions
| Column | What it stores |
|--------|----------------|
| Submission ID | Unique ID like `TB-ABC1234` |
| Status | Under Review / Approved / Rejected / etc. |
| Rejection Reason | Filled by reviewer |
| Views / Likes / Comments | Updated by reviewer or API |
| Payout Status | Pending / Processing / Completed / Failed |

**For reviewers:** Use the **Status** column dropdown to approve/reject. The student dashboard updates in real time.

### Events
Every user action on the website is logged here — page opens, OTP sent, video submitted, dashboard viewed, etc.

### Users
One row per unique phone number. Tracks first seen, last seen, submission count.

### Payout
Razorpay payout tracking — one row per payout attempt.

---

## Re-deploy after code changes

Any time you change `Code.gs`:
1. Click **Deploy → Manage deployments**
2. Click the edit ✏️ icon
3. Change version to **New version**
4. Click **Deploy**

The URL stays the same — no need to update `.env.local`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Unauthorized` response | Check `WEBHOOK_SECRET` in `.env.local` matches `SECRET_TOKEN` in Code.gs |
| Sheet not found | Run `setupSheets()` from Apps Script editor |
| CORS error | Never call the webhook directly from browser — always go through `/api/*` routes |
| `Script is running` delay | First request after idle can take 3–5s (cold start). Normal behaviour. |
| 403 after re-deploy | Make sure **Who has access** is set to **Anyone** (not "Anyone with Google account") |

// end here..