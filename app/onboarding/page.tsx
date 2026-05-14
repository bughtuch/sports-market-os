import type { Metadata } from "next";
import OnboardingFlow from "@/components/OnboardingFlow";

export const metadata: Metadata = {
  title: "Setup — Personalise Your Intelligence | Sports Market OS",
  description:
    "Configure your sports markets, intelligence focus, alert preferences, and creator workflows " +
    "to personalise the Sports Market OS intelligence terminal.",
};

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
