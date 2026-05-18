import SportHubServer from "@/components/SportHubServer";

export const revalidate = 3600;

export const metadata = {
  title: "NFL Markets — Sports Market OS",
  description: "Polymarket NFL market intelligence. Coverage building — signals activate as liquidity builds.",
};

export default function NFLPage() {
  return <SportHubServer sportSlug="nfl" />;
}
