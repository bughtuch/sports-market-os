// Placeholder email templates — activate when Resend integration is live.

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryType: string;
}

export function contactNotificationTemplate(data: ContactSubmission): string {
  return `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${data.name}</p>
<p><strong>Email:</strong> ${data.email}</p>
<p><strong>Inquiry type:</strong> ${data.inquiryType}</p>
<p><strong>Subject:</strong> ${data.subject}</p>
<hr />
<p>${data.message.replace(/\n/g, "<br />")}</p>
  `.trim();
}

export function contactAutoReplyTemplate(name: string): string {
  return `
<p>Hi ${name},</p>
<p>Thanks for reaching out to Sports Market OS. We've received your message and will respond within 1–2 business days.</p>
<p>In the meantime, you can explore the terminal at <a href="https://sportsmarketos.com/terminal">sportsmarketos.com/terminal</a>.</p>
<p>— Sports Market OS Team</p>
  `.trim();
}
