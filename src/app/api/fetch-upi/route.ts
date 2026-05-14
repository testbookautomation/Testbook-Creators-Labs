import { NextRequest, NextResponse } from "next/server";

const LMS_EMAIL    = process.env.LMS_EMAIL    || "learning@testbook.com";
const LMS_PASSWORD = process.env.LMS_PASSWORD || "learning!@#book";
const LOGIN_URL    = "https://lms-api.testbook.com/api/v2/admin/login";

const FIELDS = "_id,status,email,name,mobile,vpa,mobileVerified";

const STUDENT_FIELDS = [
  "_id","status","email","name","gender","locale","location","dob","username",
  "mobileVerified","mobile","social","confirm","currentCourse","enrollments","image",
  "createdOn","streaks","referral","referrer","tests","college_details","tblang","cart",
  "calang","preferences","meta","cobrandingInfo","passes","globalPassExpiry",
  "currLearningPass","currentPassExpiryBackup","coinsExpensedBackup","cashbacks",
  "coinsExpensed","sub","specificExams","cur_exam","lang","isPaidUser","goalSubs",
  "passProExpiry","passOneExpiry","intlSubs","enrollmentsSaved","currentGoal",
  "goalSubs","targetInfo","activeTargetIds","activeGoalIds","classes",
  "activeSuperGroupIds","preferredQuizLang","vpa","superPassGoal",
  "isSelectUser","isUpdatedToPassOne",
].join(",");

async function lmsLogin(): Promise<string> {
  const body = new URLSearchParams({ email: LMS_EMAIL, password: LMS_PASSWORD });
  const res = await fetch(LOGIN_URL, {
    method: "POST",
    headers: {
      "Accept": "*/*",
      "Content-Type": "application/x-www-form-urlencoded",
      "x-tb-client": "lm",
      "User-Agent": "Mozilla/5.0",
    },
    body: body.toString(),
    cache: "no-store",
  });
  const data = await res.json();
  const token = data?.data?.token || data?.token;
  if (!token) throw new Error("lms_login_failed");
  return token;
}

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone")?.replace(/\D/g, "") || "";

  if (phone.length < 10) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  const mobile = phone.startsWith("91") && phone.length === 12 ? phone : `91${phone.slice(-10)}`;

  try {
    // ── Step 1: login to get admin token ──────────────────────
    const adminToken = await lmsLogin();
    const authHeader = { Authorization: `Bearer ${adminToken}` };

    // ── Step 2: find student by mobile ────────────────────────
    const filter  = encodeURIComponent(JSON.stringify({ mobile }));
    const listUrl = `https://lms-api.testbook.com/api/v2/admin/students?language=All&skip=0&limit=10&export=false&filter=${filter}&fields=${FIELDS}`;

    const listRes  = await fetch(listUrl, { headers: { ...authHeader }, cache: "no-store" });
    const listData = await listRes.json();

    const student = listData?.data?.students?.[0] || listData?.students?.[0];
    if (!student?._id) {
      return NextResponse.json({ vpa: null, found: false, reason: "student_not_found" });
    }

    const studentId = student._id;

    // ── Step 3: generate auth token for that student ──────────
    const tokenUrl  = `https://lms-api.testbook.com/api/v2/admin/students/${studentId}/gentoken?language=All`;
    const tokenRes  = await fetch(tokenUrl, { method: "GET", headers: { ...authHeader }, cache: "no-store" });
    const tokenData = await tokenRes.json();

    const authCode = tokenData?.data?.token || tokenData?.token || tokenData?.auth_code;
    if (!authCode) {
      return NextResponse.json({ vpa: null, found: false, reason: "token_failed" });
    }

    // ── Step 4: fetch student profile (includes vpa) ──────────
    const meUrl  = `https://api-new.testbook.com/api/v2.2/students/me?auth_code=${authCode}&fields=${STUDENT_FIELDS}&X-Tb-Client=web,1.3`;
    const meRes  = await fetch(meUrl, { cache: "no-store" });
    const meData = await meRes.json();

    const vpa  = meData?.data?.vpa || meData?.vpa || null;
    const name = meData?.data?.name || meData?.name || student.name || null;

    return NextResponse.json({ vpa, found: true, studentId, name });

  } catch (err) {
    const msg = err instanceof Error ? err.message : "fetch_error";
    return NextResponse.json({ vpa: null, found: false, reason: msg }, { status: 500 });
  }
}
