// Browser-side API client — calls Next.js /api/* routes
// Safe to import from client components

export interface SubmitPayload {
  name: string;
  phone: string;
  userId?: string;
  email?: string;
  examCategory: string;
  platform: string;
  followers?: string;
  videoLink?: string;
  videoFile?: File | null;
  socialHandle?: string;
  caption?: string;
  upiConfirm: boolean;
  consent: boolean;
}

export interface EventPayload {
  eventName: string;
  userId?: string;
  phone?: string;
  page?: string;
  platform?: string;
  payload?: Record<string, unknown>;
}

export interface Submission {
  submissionId: string;
  submittedAt: string;
  name: string;
  phone: string;
  examCategory: string;
  platform: string;
  videoLink: string;
  cdnUrl?: string;
  socialHandle: string;
  status: string;
  rejectionReason: string;
  metrics: { views: number; likes: number; comments: number; target: number };
  payout: { eligibility: string; amount: number; status: string; razorpayId: string };
}

// ── Submit a video ────────────────────────────────────────────
export async function submitVideo(data: SubmitPayload): Promise<{ success: boolean; submissionId?: string; videoLink?: string; cdnUrl?: string; error?: string }> {
  if (data.videoFile) {
    const form = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "videoFile" || value === undefined || value === null) return;
      form.append(key, String(value));
    });
    form.append("videoFile", data.videoFile);

    const res = await fetch("/api/submit", {
      method: "POST",
      body: form,
    });
    return res.json();
  }

  const res = await fetch("/api/submit", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  });
  return res.json();
}

// ── Fire an event (best-effort, never throws) ─────────────────
export async function trackEvent(data: EventPayload): Promise<void> {
  try {
    await fetch("/api/event", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });
  } catch {
    // Events are non-critical — swallow all errors
  }
}

// ── Fetch submission status ───────────────────────────────────
export async function fetchStatus(phone: string, userId?: string): Promise<Submission | null> {
  const qs = new URLSearchParams();
  if (phone)  qs.set("phone",  phone);
  if (userId) qs.set("userId", userId);

  try {
    const res  = await fetch(`/api/status?${qs}`);
    const data = await res.json();
    return data?.submission ?? null;
  } catch {
    return null;
  }
}

// ── Fetch UPI / VPA for a phone number ───────────────────────
export async function fetchUpi(phone: string): Promise<{ vpa: string | null; found: boolean; name?: string }> {
  try {
    const res  = await fetch(`/api/fetch-upi?phone=${phone}`);
    const data = await res.json();
    return { vpa: data.vpa ?? null, found: !!data.found, name: data.name };
  } catch {
    return { vpa: null, found: false };
  }
}

// ── Event name constants ──────────────────────────────────────
export const EV = {
  PAGE_OPENED:      "UGC_Page_Opened",
  LOGIN_STARTED:    "UGC_Login_Started",
  OTP_REQUESTED:    "UGC_OTP_Requested",
  OTP_VERIFIED:     "UGC_OTP_Verified",
  HOME_VIEWED:      "UGC_Home_Viewed",
  SOP_VIEWED:       "UGC_SOP_Viewed",
  FORM_STARTED:     "UGC_Form_Started",
  VIDEO_SUBMITTED:  "UGC_Video_Submitted",
  DASHBOARD_VIEWED: "UGC_Dashboard_Viewed",
  VIDEO_APPROVED:   "UGC_Video_Approved",
  VIDEO_REJECTED:   "UGC_Video_Rejected",
  PAYOUT_ELIGIBLE:  "UGC_Payout_Eligible",
  PAYOUT_COMPLETED: "UGC_Payout_Completed",
} as const;
