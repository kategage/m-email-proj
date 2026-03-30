/**
 * ============================================================
 *   WORK ANNIVERSARY EMAIL AUTOMATION
 *   Chicago Public Media — CEO Melissa Bell
 * ============================================================
 *
 * HOW TO SET UP (one-time, takes ~5 minutes):
 *
 *   STEP 1 — PREPARE YOUR GOOGLE SHEET
 *     • Open (or create) a Google Sheet
 *     • Set up 4 columns with these exact headers in Row 1:
 *         A: First Name
 *         B: Last Name
 *         C: Email Address
 *         D: Start Date
 *     • Fill in your employee data below the headers
 *     • Make sure Start Date is formatted as a date
 *       (select column D → Format → Number → Date)
 *
 *   STEP 2 — OPEN THE SCRIPT EDITOR
 *     • In your Google Sheet, click Extensions → Apps Script
 *     • Delete any code already there
 *     • Paste this ENTIRE file and press Ctrl+S (or Cmd+S) to save
 *
 *   STEP 3 — GRANT PERMISSIONS
 *     • At the top of the script editor, make sure the dropdown
 *       next to the Run button says "sendAnniversaryEmails"
 *     • Click the Run button (▶)
 *     • A popup will ask you to authorize — click "Review Permissions"
 *     • Choose your Google account
 *     • You may see "Google hasn't verified this app" —
 *       click "Advanced" → "Go to Untitled project (unsafe)"
 *     • Click "Allow"
 *     • This first run won't send anything unless someone's
 *       anniversary happens to be today — that's fine!
 *
 *   STEP 4 — SET UP THE DAILY TRIGGER (so it runs automatically)
 *     • Change the dropdown next to Run to "createDailyTrigger"
 *     • Click the Run button (▶)
 *     • That's it! The script will now check for anniversaries
 *       every morning between 8–9 AM automatically.
 *
 *   ✅ YOU'RE DONE! The script runs on its own from here.
 *
 * ────────────────────────────────────────────────────────────
 *   WANT TO CUSTOMIZE THE EMAIL?
 *     • Scroll down to the "Email Template" section below
 *     • You can change the greeting, the message, milestone
 *       messages (1 year, 5 years, etc.), colors, and sign-off
 *     • To test without sending real emails, change testMode
 *       to true in CONFIG below, run it, then check the
 *       Execution Log (View → Execution log) to preview
 * ────────────────────────────────────────────────────────────
 *
 *   WANT TO STOP THE EMAILS?
 *     • Change the dropdown to "removeDailyTrigger" and click Run
 * ============================================================
 */

// ─── Configuration ──────────────────────────────────────────────────────────

var CONFIG = {
  sheetName: "Sheet1",        // Name of the tab with employee data
  firstNameCol: 1,            // Column A
  lastNameCol: 2,             // Column B
  emailCol: 3,                // Column C
  startDateCol: 4,            // Column D
  headerRows: 1,              // Number of header rows to skip
  senderName: "Melissa Bell", // Display name on outgoing emails
  testMode: false             // Set to true to log emails instead of sending
};

// ─── Main Function ──────────────────────────────────────────────────────────

function sendAnniversaryEmails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.sheetName);
  if (!sheet) {
    Logger.log("ERROR: Sheet '" + CONFIG.sheetName + "' not found.");
    return;
  }

  var today = new Date();
  var todayMonth = today.getMonth();
  var todayDay = today.getDate();
  var todayYear = today.getFullYear();

  var data = sheet.getDataRange().getValues();
  var sentCount = 0;

  for (var i = CONFIG.headerRows; i < data.length; i++) {
    var firstName = data[i][CONFIG.firstNameCol - 1];
    var lastName = data[i][CONFIG.lastNameCol - 1];
    var email = data[i][CONFIG.emailCol - 1];
    var startDate = new Date(data[i][CONFIG.startDateCol - 1]);

    // Skip rows with missing data
    if (!firstName || !email || !startDate || isNaN(startDate.getTime())) {
      continue;
    }

    // Check if today matches the month and day of their start date
    if (startDate.getMonth() === todayMonth && startDate.getDate() === todayDay) {
      var years = todayYear - startDate.getFullYear();

      // Don't send on their actual first day (0 years)
      if (years <= 0) {
        continue;
      }

      var subject = "Happy Work Anniversary, " + firstName + "! 🎉";
      var body = buildEmailBody(firstName, lastName, years);

      if (CONFIG.testMode) {
        Logger.log("TEST — Would send to: " + email);
        Logger.log("Subject: " + subject);
        Logger.log("Body:\n" + body);
      } else {
        GmailApp.sendEmail(email, subject, "", {
          htmlBody: body,
          name: CONFIG.senderName
        });
        Logger.log("Sent anniversary email to " + firstName + " " + lastName + " (" + email + ") — " + years + " year(s)");
      }

      sentCount++;
    }
  }

  Logger.log("Done. Sent " + sentCount + " anniversary email(s) today.");
}

// ─── Email Template ─────────────────────────────────────────────────────────

function buildEmailBody(firstName, lastName, years) {
  var yearWord = years === 1 ? "year" : "years";
  var milestone = "";

  if (years === 1) {
    milestone = "Your first year has flown by!";
  } else if (years === 5) {
    milestone = "Five years — what an incredible milestone!";
  } else if (years === 10) {
    milestone = "A whole decade together — that is truly extraordinary!";
  } else if (years === 20) {
    milestone = "Twenty years! Your dedication is absolutely legendary.";
  } else {
    milestone = years + " " + yearWord + " — what an amazing journey!";
  }

  var html = ""
    + "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>"
    + "  <div style='background-color: #1a3c5e; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;'>"
    + "    <h1 style='color: #ffffff; margin: 0; font-size: 28px;'>🎉 Happy Work Anniversary! 🎉</h1>"
    + "  </div>"
    + "  <div style='background-color: #ffffff; padding: 30px; border: 1px solid #e0e0e0;'>"
    + "    <p style='font-size: 18px; color: #333333;'>Dear " + firstName + ",</p>"
    + "    <p style='font-size: 16px; color: #333333; line-height: 1.6;'>"
    + "      Happy work anniversary! Today marks <strong>" + years + " " + yearWord + "</strong> since you joined "
    + "      the Chicago Public Media family. " + milestone
    + "    </p>"
    + "    <p style='font-size: 16px; color: #333333; line-height: 1.6;'>"
    + "      We are so glad you work here. Your contributions, energy, and dedication make "
    + "      Chicago Public Media a better place every single day. Thank you for everything you bring to our team."
    + "    </p>"
    + "    <p style='font-size: 16px; color: #333333; line-height: 1.6;'>"
    + "      Here's to many more great years ahead! 🥂"
    + "    </p>"
    + "    <p style='font-size: 16px; color: #333333; margin-top: 30px;'>"
    + "      With gratitude,<br>"
    + "      <strong>Melissa Bell</strong><br>"
    + "      CEO, Chicago Public Media"
    + "    </p>"
    + "  </div>"
    + "  <div style='background-color: #f5f5f5; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;'>"
    + "    <p style='font-size: 12px; color: #999999; margin: 0;'>Chicago Public Media</p>"
    + "  </div>"
    + "</div>";

  return html;
}

// ─── Trigger Setup ──────────────────────────────────────────────────────────

/**
 * Run this function ONCE to create a daily trigger that checks for
 * anniversaries every morning between 8–9 AM.
 */
function createDailyTrigger() {
  // Remove any existing triggers for this function first
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "sendAnniversaryEmails") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  ScriptApp.newTrigger("sendAnniversaryEmails")
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();

  Logger.log("Daily trigger created. Emails will be checked each morning between 8–9 AM.");
}

/**
 * Run this to remove the daily trigger if you ever want to stop the emails.
 */
function removeDailyTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  var removed = 0;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "sendAnniversaryEmails") {
      ScriptApp.deleteTrigger(triggers[i]);
      removed++;
    }
  }
  Logger.log("Removed " + removed + " trigger(s).");
}
