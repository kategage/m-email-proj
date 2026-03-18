# Work Anniversary Email Automation — Setup Guide

## Overview

This script automatically sends a personalized work anniversary email from **Melissa Bell, CEO of Chicago Public Media** to each employee on the anniversary of their start date, every year.

It runs entirely in Google's cloud — no server, no installs, completely free.

---

## Step 1: Prepare Your Google Sheet

Make sure your spreadsheet has these four columns (starting in Row 1 as headers):

| A | B | C | D |
|---|---|---|---|
| **First Name** | **Last Name** | **Email Address** | **Start Date** |
| Jane | Doe | jane@chicagopublicmedia.org | 6/15/2020 |
| John | Smith | john@chicagopublicmedia.org | 3/18/2019 |

- The **Start Date** can be any format Google Sheets recognizes (e.g., `6/15/2020`, `2020-06-15`, `June 15, 2020`)
- The tab must be named **Sheet1** (or update the `sheetName` value in the script's CONFIG section)

---

## Step 2: Add the Script

1. Open your Google Sheet
2. Click **Extensions → Apps Script**
3. Delete any existing code in the editor
4. Copy and paste the entire contents of `anniversary-email.gs` into the editor
5. Click the **Save** icon (💾) or press `Ctrl+S`

---

## Step 3: Authorize Permissions

1. In the Apps Script editor, select **sendAnniversaryEmails** from the function dropdown at the top
2. Click **Run** (▶)
3. Google will ask you to authorize the script — click **Review Permissions**
4. Choose your Google account
5. If you see "Google hasn't verified this app," click **Advanced → Go to (project name)**
6. Click **Allow**

> This first run will also check today's date for any anniversaries, so it's safe to run.

---

## Step 4: Set Up the Daily Trigger

1. In the function dropdown, select **createDailyTrigger**
2. Click **Run** (▶)
3. Done! The script will now run automatically every morning between 8–9 AM

---

## Testing

To test without sending real emails:

1. In the script, change `testMode: false` to `testMode: true` in the CONFIG section
2. Run **sendAnniversaryEmails**
3. Click **View → Execution log** to see what would have been sent
4. Change `testMode` back to `false` when you're ready to go live

**Quick test tip:** Temporarily change an employee's start date to today's date (keeping the original year) to verify the email sends correctly.

---

## Customization

| Setting | Where | Default |
|---------|-------|---------|
| Sheet tab name | `CONFIG.sheetName` | `"Sheet1"` |
| Column layout | `CONFIG.firstNameCol`, etc. | A, B, C, D |
| Sender display name | `CONFIG.senderName` | `"Melissa Bell"` |
| Trigger time | `createDailyTrigger()` → `.atHour(8)` | 8–9 AM |
| Email wording | `buildEmailBody()` function | See script |

---

## Stopping the Emails

Run the **removeDailyTrigger** function from the Apps Script editor to turn off automatic emails.
