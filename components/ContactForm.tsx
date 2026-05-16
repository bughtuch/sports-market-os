"use client";

import { useState } from "react";
import { SUPPORT_EMAIL } from "@/lib/constants/contact";

type InquiryType = "general" | "partner" | "api" | "enterprise" | "press";

const INQUIRY_OPTIONS: { value: InquiryType; label: string }[] = [
  { value: "general",    label: "General enquiry" },
  { value: "partner",   label: "Partner Program" },
  { value: "api",       label: "API Access" },
  { value: "enterprise", label: "Enterprise" },
  { value: "press",     label: "Press / Media" },
];

type FormState = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  inquiryType: InquiryType;
  subject: string;
  message: string;
}

const EMPTY: FormData = {
  name: "",
  email: "",
  inquiryType: "general",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [state, setState] = useState<FormState>("idle");

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");

    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:        form.name,
          email:       form.email,
          inquiryType: form.inquiryType,
          subject:     form.subject,
          message:     form.message,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-emerald-400 text-[10px] font-mono uppercase tracking-widest">
            Message Sent
          </span>
        </div>
        <h3 className="text-white text-base font-semibold mb-2">
          We&apos;ve received your message.
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
          Expect a reply to{" "}
          <span className="text-zinc-300 font-mono">{form.email}</span> within
          1–2 business days.
        </p>
        <button
          onClick={() => { setForm(EMPTY); setState("idle"); }}
          className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Send another message →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
            Name
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your name"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-3 py-2 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-3 py-2 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>
      </div>

      {/* Inquiry type */}
      <div>
        <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
          Inquiry type
        </label>
        <select
          value={form.inquiryType}
          onChange={(e) => update("inquiryType", e.target.value as InquiryType)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors"
        >
          {INQUIRY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
          Subject
        </label>
        <input
          type="text"
          required
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          placeholder="Brief subject line"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-3 py-2 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
          Message
        </label>
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Tell us how we can help…"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-3 py-2 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
        />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-zinc-700 text-[9px] font-mono">
          Or email us directly:{" "}
          <span className="text-zinc-500">{SUPPORT_EMAIL}</span>
        </p>
        <button
          type="submit"
          disabled={state === "loading"}
          className="shrink-0 text-sm font-medium text-black bg-white px-6 py-2.5 rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === "loading" ? "Sending…" : "Send message"}
        </button>
      </div>

      {state === "error" && (
        <p className="text-red-400 text-xs font-mono">
          Something went wrong. Please email us directly at {SUPPORT_EMAIL}.
        </p>
      )}
    </form>
  );
}
