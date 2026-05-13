// Placeholder support queue — activate when CRM/ticketing integration is live.
// Future: integrate with Linear, Intercom, or a custom queue backed by Supabase.

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryType: string;
  createdAt: number;
  status: "open" | "in_progress" | "resolved";
}

/**
 * TODO: Persist to Supabase `support_tickets` table when schema is applied.
 */
export async function enqueueTicket(
  data: Omit<SupportTicket, "id" | "createdAt" | "status">
): Promise<SupportTicket> {
  const ticket: SupportTicket = {
    ...data,
    id: `ticket-${Date.now()}`,
    createdAt: Date.now(),
    status: "open",
  };

  if (process.env.NODE_ENV === "development") {
    console.log("[supportQueue placeholder] Ticket enqueued:", ticket.id);
  }

  return ticket;
}
