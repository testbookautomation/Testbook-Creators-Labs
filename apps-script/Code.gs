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
const LMS_EMAIL        = "learning@testbook.com";
const LMS_PASSWORD     = "learning!@#book";
const LMS_LOGIN_URL    = "https://lms-api.testbook.com/api/v2/admin/login";
const LMS_PRESIGNED_URL_API = "https://lms-api.testbook.com/api/v2/pre-signed-upload?language=All";
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
    "Payout Status","Razorpay ID","CDN URL"
  ]);
  ensureHeaders(sheet, [
    "Submission ID","Submitted At","User ID","Phone","Name","Email",
    "Exam Category","Platform","Video Link","Social Handle","Caption",
    "UPI Confirm","Status","Rejection Reason","Approved By","Approved At",
    "Views","Likes","Comments","Payout Eligibility","Payout Amount",
    "Payout Status","Razorpay ID","CDN URL"
  ]);

  // Block duplicate: same phone OR same video link
  const existing = sheet.getDataRange().getValues();
  for (let i = 1; i < existing.length; i++) {
    if (String(existing[i][3]) === String(data.phone) ||
        (data.videoLink && String(existing[i][8]) === String(data.videoLink))) {
      return { success: false, error: "duplicate" };
    }
  }

  const id  = makeId("TB");
  const now = new Date().toISOString();
  const uploadResult = uploadStudentVideoToLms(data, id);
  const cdnUrl = uploadResult ? uploadResult.cdnUrl : "";
  const videoLink = data.videoLink || cdnUrl || "";

  sheet.appendRow([
    id, now,
    data.userId       || "",
    data.phone        || "",
    data.name         || "",
    data.email        || "",
    data.examCategory || "",
    data.platform     || "",
    videoLink,
    data.socialHandle || "",
    data.caption      || "",
    data.upiConfirm ? "Yes" : "No",
    "Under Review", "", "", "",   // Status, Rejection, Approved by, Approved at
    0, 0, 0,                      // Views, Likes, Comments
    "Not Eligible", 0, "Pending", "", cdnUrl  // Payout fields
  ]);

  upsertUser(data);

  // Fire WebEngage event if configured
  if (WEBENGAGE_API_KEY) {
    weEvent("UGC_Video_Submitted", {
      userId: data.userId, phone: data.phone,
      submissionId: id, platform: data.platform,
    });
  }

  return {
    success: true,
    submissionId: id,
    status: "Under Review",
    videoLink: videoLink,
    cdnUrl: cdnUrl,
    uploadStatus: uploadResult ? uploadResult.status : "SKIPPED"
  };
}

function uploadStudentVideoToLms(data, submissionId) {
  const base64 = data.videoBase64 || data.videoUploadBase64 || "";
  if (!base64) return null;

  const name = data.videoFileName || data.videoUploadName || (submissionId + ".mp4");
  const mimeType = data.videoMimeType || data.videoUploadMimeType || "video/mp4";
  const filename = cleanFileName(submissionId + "-" + (data.phone || "student") + "-" + name);
  const bytes = Utilities.base64Decode(base64);
  const blob = Utilities.newBlob(bytes, mimeType, filename);
  return uploadBlobToLms(blob, filename);
}

function uploadBlobToLms(blob, filename) {
  const cleanName = cleanFileName(filename);
  const prefix = new Date().getTime() + "-" + cleanName;
  const fileExt = getFileExt(cleanName);
  const token = lmsLogin();
  const presignedData = getLmsPresignedUrl(token, prefix, fileExt);
  const uploadUrl = presignedData.data.uploadUrl;
  const cdnUrl = fixUrl(presignedData.data.cdnUrl);

  const uploadResponse = UrlFetchApp.fetch(uploadUrl, {
    method: "post",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Origin": "https://lms.testbook.com",
      "Referer": "https://lms.testbook.com/",
      "User-Agent": "Mozilla/5.0"
    },
    payload: { file: blob.setName(cleanName) },
    muteHttpExceptions: true
  });

  const uploadStatus = uploadResponse.getResponseCode();
  const uploadText = uploadResponse.getContentText();

  if ([200, 201, 204].indexOf(uploadStatus) === -1) {
    throw new Error("LMS CDN upload failed. Status: " + uploadStatus + " | " + uploadText);
  }

  return {
    filename: cleanName,
    cdnUrl: cdnUrl,
    status: "SUCCESS",
    statusCode: uploadStatus,
    response: uploadText
  };
}

function lmsLogin() {
  const response = UrlFetchApp.fetch(LMS_LOGIN_URL, {
    method: "post",
    headers: {
      "Accept": "*/*",
      "Content-Type": "application/x-www-form-urlencoded",
      "x-tb-client": "lm",
      "User-Agent": "Mozilla/5.0"
    },
    payload: { email: LMS_EMAIL, password: LMS_PASSWORD },
    muteHttpExceptions: true
  });

  const statusCode = response.getResponseCode();
  const text = response.getContentText();
  let data;

  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new Error("LMS login response is not JSON. Status: " + statusCode + " | " + text);
  }

  if (!data.success) {
    throw new Error("LMS login failed. Status: " + statusCode + " | " + JSON.stringify(data));
  }
  if (!data.data || !data.data.token) {
    throw new Error("LMS login token missing. Response: " + JSON.stringify(data));
  }

  return data.data.token;
}

function getLmsPresignedUrl(token, prefix, fileExt) {
  const response = UrlFetchApp.fetch(LMS_PRESIGNED_URL_API, {
    method: "post",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer " + token,
      "x-tb-client": "lm",
      "Origin": "https://lms.testbook.com",
      "Referer": "https://lms.testbook.com/",
      "User-Agent": "Mozilla/5.0"
    },
    payload: { prefix: prefix, fileExt: fileExt },
    muteHttpExceptions: true
  });

  const statusCode = response.getResponseCode();
  const text = response.getContentText();
  let data;

  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new Error("LMS pre-signed response is not JSON. Status: " + statusCode + " | " + text);
  }

  if (!data.success) {
    throw new Error("LMS pre-signed URL failed. Status: " + statusCode + " | " + JSON.stringify(data));
  }
  if (!data.data || !data.data.uploadUrl || !data.data.cdnUrl) {
    throw new Error("LMS upload/CDN URL missing. Response: " + JSON.stringify(data));
  }

  return data;
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
          cdnUrl:          col("CDN URL") >= 0 ? r[col("CDN URL")] : "",
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

function ensureHeaders(sheet, headers) {
  const lastColumn = Math.max(sheet.getLastColumn(), headers.length);
  const existing = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  let changed = false;

  for (let i = 0; i < headers.length; i++) {
    if (existing[i] !== headers[i]) {
      existing[i] = headers[i];
      changed = true;
    }
  }

  if (!changed) return;

  const r = sheet.getRange(1, 1, 1, headers.length);
  r.setValues([headers]);
  r.setFontWeight("bold");
  r.setBackground("#0f1c4d");
  r.setFontColor("#ffffff");
  sheet.setFrozenRows(1);
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

function cleanFileName(filename) {
  return String(filename).trim().replace(/[^\w.\-() ]/g, "_").slice(0, 160) || "student-video.mp4";
}

function getFileExt(filename) {
  const i = filename.lastIndexOf(".");
  return i === -1 ? "" : filename.substring(i);
}

function fixUrl(url) {
  if (!url) return "";
  if (url.startsWith("//")) return "https:" + url;
  return url;
}

// ── RUN ONCE FROM EDITOR ──────────────────────────────────────

function setupSheets() {
  getOrCreate(SHEETS.SUBMISSIONS, [
    "Submission ID","Submitted At","User ID","Phone","Name","Email",
    "Exam Category","Platform","Video Link","Social Handle","Caption",
    "UPI Confirm","Status","Rejection Reason","Approved By","Approved At",
    "Views","Likes","Comments","Payout Eligibility","Payout Amount",
    "Payout Status","Razorpay ID","CDN URL"
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

// end here..