/**
 * resendClient.ts — Lazy Resend client singleton.
 *
 * Returns null when RESEND_API_KEY is not configured — all callers
 * must handle the null case and fall back gracefully.
 * Never expose the API key or client instance client-side.
 */

import { Resend } from "resend";

let _client: Resend | null = null;

export function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_client) _client = new Resend(process.env.RESEND_API_KEY);
  return _client;
}

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

export function getFromAddress(): string {
  return process.env.EMAIL_FROM ?? "Sports Market OS <noreply@sportsmarketos.com>";
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "https://sportsmarketos.com";
}
