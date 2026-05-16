import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const SUPPORT_TO = process.env.CONTACT_EMAIL ?? "support@sportsmarketos.com";
const FROM       = process.env.EMAIL_FROM      ?? "noreply@sportsmarketos.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name?: string;
      email?: string;
      inquiryType?: string;
      subject?: string;
      message?: string;
    };

    const { name, email, inquiryType, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // Resend not configured — log and return success so the form UX
      // isn't broken in dev/preview environments without the key set.
      console.warn("[api/contact] RESEND_API_KEY not set — submission not delivered");
      return NextResponse.json({ success: true, delivered: false });
    }

    const resend  = new Resend(apiKey);
    const channel = inquiryType ?? "general";
    const subjectLine = subject
      ? `[SMO · ${channel}] ${subject}`
      : `[SMO · ${channel}] New enquiry from ${name}`;

    await resend.emails.send({
      from:    FROM,
      to:      SUPPORT_TO,
      replyTo: email,
      subject: subjectLine,
      html: `
        <p style="font-family:monospace;color:#71717a;font-size:12px;margin:0 0 24px">
          Sports Market OS — Contact Form Submission
        </p>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;max-width:520px">
          <tr><td style="padding:6px 0;color:#a1a1aa;width:110px">Name</td><td style="padding:6px 0;color:#ffffff">${name}</td></tr>
          <tr><td style="padding:6px 0;color:#a1a1aa">Email</td><td style="padding:6px 0;color:#ffffff">${email}</td></tr>
          <tr><td style="padding:6px 0;color:#a1a1aa">Channel</td><td style="padding:6px 0;color:#ffffff">${channel}</td></tr>
          ${subject ? `<tr><td style="padding:6px 0;color:#a1a1aa">Subject</td><td style="padding:6px 0;color:#ffffff">${subject}</td></tr>` : ""}
        </table>
        <hr style="border:none;border-top:1px solid #27272a;margin:20px 0"/>
        <p style="font-family:sans-serif;font-size:14px;color:#e4e4e7;white-space:pre-wrap;line-height:1.6">${message}</p>
        <p style="font-family:monospace;font-size:11px;color:#52525b;margin-top:32px">
          Reply-To is set to the sender — hit reply to respond directly.
        </p>
      `,
    });

    return NextResponse.json({ success: true, delivered: true });
  } catch (err) {
    console.error("[api/contact]", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
