import { notFound } from "next/navigation";
import { getHub } from "@/lib/markets/data";
import { hubMetadata } from "@/lib/seo/metadata";
import SportHubContent from "@/components/SportHubContent";

export async function generateMetadata() {
  const hub = getHub("horse-racing");
  if (!hub) return {};
  return hubMetadata(hub);
}

export default function HorseRacingPage() {
  const hub = getHub("horse-racing");
  if (!hub) notFound();
  return <SportHubContent hub={hub} />;
}
