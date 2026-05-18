import SportHubServer from "@/components/SportHubServer";

export const revalidate = 3600;

export const metadata = {
  title: "Tennis Markets — Sports Market OS",
  description: "Polymarket tennis market intelligence. Coverage building — signals activate as liquidity builds.",
};

export default function TennisPage() {
  return <SportHubServer sportSlug="tennis" />;
}
