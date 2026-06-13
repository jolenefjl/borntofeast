const SHEET_ID = "1ZK-DKG3i-hvUFBubTMt3ZWYttSg6p_-CF6I7j-YydqM";
const SHEET_NAME = "Sheet1";
const NOTIFICATION_EMAIL = "jo@borntofeast.co";

function setup() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet =
    spreadsheet.getSheetByName(SHEET_NAME) ||
    spreadsheet.insertSheet(SHEET_NAME);
  const secret = Utilities.getUuid() + Utilities.getUuid();

  ensureHeaders(sheet);
  PropertiesService.getScriptProperties().setProperty(
    "NEWSLETTER_SECRET",
    secret,
  );
  MailApp.getRemainingDailyQuota();

  console.log("NEWSLETTER_SECRET=" + secret);
}

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents);
    const expectedSecret =
      PropertiesService.getScriptProperties().getProperty("NEWSLETTER_SECRET");

    if (!expectedSecret || payload.secret !== expectedSecret) {
      return jsonResponse({ok: false, error: "Unauthorized"});
    }

    const firstName = String(payload.firstName || "").trim();
    const email = String(payload.email || "").trim().toLowerCase();
    const locale = payload.locale === "no" ? "no" : "en";

    if (
      !firstName ||
      firstName.length > 80 ||
      !isValidEmail(email) ||
      payload.consent !== true
    ) {
      return jsonResponse({ok: false, error: "Invalid signup"});
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      const sheet =
        spreadsheet.getSheetByName(SHEET_NAME) ||
        spreadsheet.insertSheet(SHEET_NAME);

      ensureHeaders(sheet);

      if (emailExists(sheet, email)) {
        return jsonResponse({ok: true, duplicate: true});
      }

      const signedUpAt = payload.signedUpAt
        ? new Date(payload.signedUpAt)
        : new Date();

      sheet.appendRow([firstName, email, signedUpAt, locale, "Yes"]);

      MailApp.sendEmail({
        to: NOTIFICATION_EMAIL,
        subject: "New Born to Feast newsletter signup",
        body:
          "A new reader joined the Born to Feast newsletter.\n\n" +
          "First name: " +
          firstName +
          "\n" +
          "Email: " +
          email +
          "\nLanguage: " +
          locale +
          "\nSigned up: " +
          signedUpAt.toISOString(),
      });

      return jsonResponse({ok: true});
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error(error);
    return jsonResponse({ok: false, error: "Internal error"});
  }
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "First name",
      "Email",
      "Signed up at",
      "Language",
      "Consent",
    ]);
    sheet.setFrozenRows(1);
    return;
  }

  const headers = sheet
    .getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1))
    .getDisplayValues()[0];

  if (headers[0] === "Email" && !headers.includes("First name")) {
    sheet.insertColumnBefore(1);
    sheet.getRange(1, 1).setValue("First name");
  }
}

function emailExists(sheet, email) {
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return false;
  }

  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getDisplayValues()[0];
  const emailColumn = headers.indexOf("Email") + 1;

  if (emailColumn === 0) {
    throw new Error("Email column is missing.");
  }

  return sheet
    .getRange(2, emailColumn, lastRow - 1, 1)
    .getDisplayValues()
    .some(function (row) {
      return String(row[0]).trim().toLowerCase() === email;
    });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
