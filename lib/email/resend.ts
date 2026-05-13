// Placeholder — Resend integration activates in a future sprint.
// Install: npm install resend
// Docs: https://resend.com/docs

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * TODO: Replace with real Resend client when billing/email sprint activates.
 *
 * import { Resend } from "resend";
 * const resend = new Resend(process.env.RESEND_API_KEY);
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  // Simulated send — logs to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("[resend placeholder] Email would be sent:", {
      to: options.to,
      subject: options.subject,
      replyTo: options.replyTo,
    });
  }
  return { success: true, id: `sim-${Date.now()}` };
}
