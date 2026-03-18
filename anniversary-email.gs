/**
 * Work Anniversary Email Automation
 * Chicago Public Media — CEO Melissa Bell
 *
 * Setup:
 *   1. Open your Google Sheet with employee data
 *   2. Go to Extensions > Apps Script
 *   3. Paste this entire script and save
 *   4. Run sendAnniversaryEmails() once manually to grant permissions
 *   5. Set up a daily trigger (see createDailyTrigger below)
 *
 * Expected spreadsheet columns (Row 1 = headers):
 *   A: First Name
 *   B: Last Name
 *   C: Email Address
 *   D: Start Date (any date format Google Sheets recognizes)
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
