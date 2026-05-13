// ─────────────────────────────────────────────────────────────
//  Testbook Student Creator — Google Apps Script Webhook
//
//  HOW TO SET UP:
//  1. Open your Google Sheet
//  2. Click Extensions → Apps Script
//  3. Delete all existing code and paste THIS file
//  4. Run setupSheets() → click Allow when prompted
//  5. Deploy → New deployment → Web app
//     Execute as: Me | Who has access: Anyone
//  6. Copy the /exec URL into .env.local as WEBHOOK_URL
// ─────────────────────────────────────────────────────────────

const SECRET_TOKEN     = "TB_UGC_SECRET_2025"; // Must match .env.local
const WEBENGAGE_API_KEY    = ""; // Optional
const WEBENGAGE_ACCOUNT_ID = ""; // Optional

const SHEETS = {
  SUBMISSIONS: "Submissions",
  EVENTS:      "Events",
  USERS:       "Users",
  PAYOUT:      "Payout",
};

// ── ENTRY POINTS ─────────────────────────────────────────────

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.token !== SECRET_TOKEN) {
      return respond({ success: false, error: "Unauthorized" });
    }
    if (body.type === "submit") return respond(handleSubmit(body));
    if (body.type === "event")  return respond(handleEvent(body));
    return respond({ success: false, error: "Unknown type" });
  } catch (err) {
    return respond({ success: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    const p = e.parameter;
    if (p.token !== SECRET_TOKEN) {
      return respond({ success: false, error: "Unauthorized" });
    }
    if (p.type === "ping")   return respond({ success: true, message: "Testbook UGC Webhook OK" });
    if (p.type === "status") return respond(getStatus(p.phone || "", p.userId || ""));
    return respond({ success: false, error: "Unknown type" });
  } catch (err) {
    return respond({ success: false, error: String(err) });
  }
}

// ── SUBMIT HANDLER ────────────────────────────────────────────

function handleSubmit(data) {
  const sheet = getOrCreate(SHEETS.SUBMISSIONS, [
    "Submission ID","Submitted At","User ID","Phone","Name","Email",
    "Exam Category","Platform","Video Link","Social Handle","Caption",
    "UPI Confirm","Status","Rejection Reason","Approved By","Approved At",
    "Views","Likes","Comments","Payout Eligibility","Payout Amount",
    "Payout Status","Razorpay ID","Drive Link"
  ]);

  // Block duplicate: same phone OR same video link
  const existing = sheet.getDataRange().getValues();
  for (let i = 1; i < existing.length; i++) {
    if (String(existing[i][3]) === String(data.phone) ||
        String(existing[i][8]) === String(data.videoLink)) {
      return { success: false, error: "duplicate" };
    }
  }

  const id  = makeId("TB");
  const now = new Date().toISOString();

  sheet.appendRow([
    id, now,
    data.userId       || "",
    data.phone        || "",
    data.name         || "",
    data.email        || "",
    data.examCategory || "",
    data.platform     || "",
    data.videoLink    || "",
    data.socialHandle || "",
    data.caption      || "",
    data.upiConfirm ? "Yes" : "No",
    "Under Review", "", "", "",   // Status, Rejection, Approved by, Approved at
    0, 0, 0,                      // Views, Likes, Comments
    "Not Eligible", 0, "Pending", "", ""  // Payout fields
  ]);

  upsertUser(data);

  // Fire WebEngage event if configured
  if (WEBENGAGE_API_KEY) {
    weEvent("UGC_Video_Submitted", {
      userId: data.userId, phone: data.phone,
      submissionId: id, platform: data.platform,
    });
  }

  return { success: true, submissionId: id, status: "Under Review" };
}

// ── EVENT HANDLER ─────────────────────────────────────────────

function handleEvent(data) {
  const sheet = getOrCreate(SHEETS.EVENTS, [
    "Event ID","Timestamp","User ID","Phone","Event Name",
    "Page","Platform","Payload","WE Forwarded","WE Response"
  ]);

  const id  = makeId("EVT");
  const now = new Date().toISOString();
  let weStatus = "Skipped", weResp = "";

  if (WEBENGAGE_API_KEY && WEBENGAGE_ACCOUNT_ID) {
    const r = weEvent(data.eventName, data.payload || {});
    weStatus = r.ok ? "OK" : "Failed";
    weResp   = JSON.stringify(r);
  }

  sheet.appendRow([
    id, now,
    data.userId    || "",
    data.phone     || "",
    data.eventName || "",
    data.page      || "",
    data.platform  || "",
    JSON.stringify(data.payload || {}),
    weStatus, weResp
  ]);

  return { success: true, eventId: id };
}

// ── STATUS HANDLER ────────────────────────────────────────────

function getStatus(phone, userId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.SUBMISSIONS);
  if (!sheet) return { success: true, submission: null };

  const rows  = sheet.getDataRange().getValues();
  const heads = rows[0];
  const col   = (name) => heads.indexOf(name);

  for (let i = rows.length - 1; i >= 1; i--) {
    const r = rows[i];
    if ((phone  && String(r[col("Phone")])   === String(phone)) ||
        (userId && String(r[col("User ID")]) === String(userId))) {
      return {
        success: true,
        submission: {
          submissionId:    r[col("Submission ID")],
          submittedAt:     r[col("Submitted At")],
          name:            r[col("Name")],
          phone:           r[col("Phone")],
          examCategory:    r[col("Exam Category")],
          platform:        r[col("Platform")],
          videoLink:       r[col("Video Link")],
          socialHandle:    r[col("Social Handle")],
          status:          r[col("Status")],
          rejectionReason: r[col("Rejection Reason")] || "",
          metrics: {
            views:    Number(r[col("Views")])    || 0,
            likes:    Number(r[col("Likes")])    || 0,
            comments: Number(r[col("Comments")]) || 0,
            target:   5000,
          },
          payout: {
            eligibility: r[col("Payout Eligibility")] || "Not Eligible",
            amount:      Number(r[col("Payout Amount")]) || 0,
            status:      r[col("Payout Status")]   || "Pending",
            razorpayId:  r[col("Razorpay ID")]     || "",
          },
        },
      };
    }
  }
  return { success: true, submission: null };
}

// ── SHEET HELPERS ─────────────────────────────────────────────

function getOrCreate(name, headers) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet(); // Works because this is a container-bound script
  let   sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    const r = sheet.getRange(1, 1, 1, headers.length);
    r.setValues([headers]);
    r.setFontWeight("bold");
    r.setBackground("#0f1c4d");
    r.setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, headers.length, 155);
  }
  return sheet;
}

function upsertUser(data) {
  const sheet = getOrCreate(SHEETS.USERS, [
    "User ID","Phone","Name","Email","Exam Category",
    "First Seen","Last Seen","Submission Count"
  ]);
  const rows = sheet.getDataRange().getValues();
  const now  = new Date().toISOString();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][1]) === String(data.phone)) {
      sheet.getRange(i + 1, 7).setValue(now);
      sheet.getRange(i + 1, 8).setValue((Number(rows[i][7]) || 0) + 1);
      return;
    }
  }
  sheet.appendRow([data.userId||"", data.phone, data.name, data.email||"",
                   data.examCategory||"", now, now, 1]);
}

// ── WEBENGAGE ─────────────────────────────────────────────────

function weEvent(name, attrs) {
  if (!WEBENGAGE_API_KEY || !WEBENGAGE_ACCOUNT_ID) return { ok: false };
  try {
    const res = UrlFetchApp.fetch(
      "https://api.webengage.com/v1/accounts/" + WEBENGAGE_ACCOUNT_ID + "/events",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + WEBENGAGE_API_KEY,
        },
        payload: JSON.stringify({
          userId: attrs.userId || attrs.phone,
          eventName: name,
          eventTime: new Date().toISOString(),
          eventData: attrs,
        }),
        muteHttpExceptions: true,
      }
    );
    return { ok: res.getResponseCode() === 201, code: res.getResponseCode() };
  } catch (err) {
    return { ok: false, reason: String(err) };
  }
}

// ── UTILITIES ─────────────────────────────────────────────────

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function makeId(prefix) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = prefix + "-";
  for (let i = 0; i < 7; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

// ── RUN ONCE FROM EDITOR ──────────────────────────────────────

function setupSheets() {
  getOrCreate(SHEETS.SUBMISSIONS, [
    "Submission ID","Submitted At","User ID","Phone","Name","Email",
    "Exam Category","Platform","Video Link","Social Handle","Caption",
    "UPI Confirm","Status","Rejection Reason","Approved By","Approved At",
    "Views","Likes","Comments","Payout Eligibility","Payout Amount",
    "Payout Status","Razorpay ID","Drive Link"
  ]);
  getOrCreate(SHEETS.EVENTS,  ["Event ID","Timestamp","User ID","Phone","Event Name","Page","Platform","Payload","WE Forwarded","WE Response"]);
  getOrCreate(SHEETS.USERS,   ["User ID","Phone","Name","Email","Exam Category","First Seen","Last Seen","Submission Count"]);
  getOrCreate(SHEETS.PAYOUT,  ["Payout ID","Submission ID","User ID","Phone","UPI ID","Amount","Status","Razorpay ID","Failure Reason","Created At","Updated At"]);
  SpreadsheetApp.getActiveSpreadsheet().toast("All sheets created!", "Testbook UGC ✅", 5);
}

function testPost() {
  // Run this from the editor to verify doPost works
  const fake = {
    postData: {
      contents: JSON.stringify({
        type: "submit", token: SECRET_TOKEN,
        name: "Test User", phone: "9999999998",
        userId: "test001", examCategory: "SSC CGL",
        platform: "YouTube Shorts",
        videoLink: "https://youtube.com/shorts/test",
        upiConfirm: true, consent: true,
      })
    }
  };
  const result = JSON.parse(doPost(fake).getContent());
  Logger.log(JSON.stringify(result));
  if (result.success) {
    SpreadsheetApp.getActiveSpreadsheet().toast("Test submission saved! ✅", "Test OK", 5);
  } else {
    SpreadsheetApp.getActiveSpreadsheet().toast("Error: " + result.error, "Test Failed ❌", 8);
  }
}
