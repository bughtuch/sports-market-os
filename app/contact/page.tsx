import type { Metadata } from "next";
import Link from "next/link";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { SUPPORT_EMAIL, API_EMAIL, PARTNER_EMAIL } from "@/lib/constants/contact";

export const metadata: Metadata = {
  title: "Contact — Sports Market OS",
  description:
    "Get in touch with the Sports Market OS team. General enquiries, Partner Program, API access, and enterprise support.",
};

const INFO_CARDS = [
  {
    title: "General Support",
    desc: "Questions about the terminal, your account, or platform access.",
    email: SUPPORT_EMAIL,
    label: "support",
    dot: "bg-zinc-400",
  },
  {
    title: "Partner Program",
    desc: "Creator distribution network, branded exports, and partner analytics enquiries.",
    email: PARTNER_EMAIL,
    label: "partner",
    dot: "bg-amber-400",
  },
  {
    title: "API Access",
    desc: "Structured data feeds, integration questions, and developer access.",
    email: API_EMAIL,
    label: "api",
    dot: "bg-blue-400",
  },
  {
    title: "Enterprise",
    desc: "Custom plans, white-label infrastructure, and institutional access.",
    email: SUPPORT_EMAIL,
    label: "enterprise",
    dot: "bg-purple-400",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <MarketTicker />
      <TerminalHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 py-12 md:py-16 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Sports Market OS · Support
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Contact</h1>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
              Reach the Sports Market OS team. We respond to all enquiries
              within 1–2 business days.
            </p>
          </div>
        </section>

        {/* Contact channels */}
        <section className="px-6 py-8 border-b border-zinc-900/80 bg-zinc-950/40">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {INFO_CARDS.map((card) => (
              <div
                key={card.title}
                className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${card.dot}`} />
                  <p className="text-zinc-200 text-[11px] font-semibold">
                    {card.title}
                  </p>
                </div>
                <p className="text-zinc-500 text-[10px] leading-relaxed mb-3">
                  {card.desc}
                </p>
                <a
                  href={`mailto:${card.email}`}
                  className="text-zinc-400 text-[10px] font-mono hover:text-white transition-colors"
                >
                  {card.email}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Main content — form + info */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-10">
            {/* Form */}
            <div className="md:col-span-3">
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
                Send a message
              </p>
              <ContactForm />
            </div>

            {/* Info panel */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
                  Response times
                </p>
                <div className="space-y-2">
                  {[
                    { label: "General enquiries", value: "1–2 business days" },
                    { label: "Partner enquiries",  value: "Same business day" },
                    { label: "API / Enterprise",   value: "Same business day" },
                    { label: "Press / Media",      value: "2–3 business days" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between py-2 border-b border-zinc-900/60"
                    >
                      <span className="text-zinc-500 text-[11px]">{row.label}</span>
                      <span className="text-zinc-300 text-[10px] font-mono">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
                  Enterprise
                </p>
                <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4">
                  <p className="text-zinc-300 text-[11px] font-semibold mb-2">
                    Custom infrastructure
                  </p>
                  <p className="text-zinc-500 text-[10px] leading-relaxed mb-3">
                    Need white-label tooling, custom data feeds, or institutional
                    access? We work directly with serious operators.
                  </p>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}?subject=Enterprise%20Enquiry`}
                    className="text-zinc-400 text-[10px] font-mono hover:text-white transition-colors"
                  >
                    Enterprise enquiry →
                  </a>
                </div>
              </div>

              <div>
                <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-3">
                  Quick links
                </p>
                <div className="space-y-1.5">
                  {[
                    { label: "View pricing",    href: "/pricing" },
                    { label: "Partner Program", href: "/partner-program" },
                    { label: "API Access",      href: "/api-access" },
                    { label: "Open Terminal",   href: "/terminal" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-zinc-500 text-[11px] hover:text-white transition-colors"
                    >
                      {link.label} →
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
