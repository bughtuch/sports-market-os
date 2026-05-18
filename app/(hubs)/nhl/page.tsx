import SportHubServer from "@/components/SportHubServer";

export const revalidate = 300;

export const metadata = {
  title: "NHL Markets — Sports Market OS",
  description: "Live NHL market intelligence from Polymarket. Puck line pressure, volume anomalies, and moneyline signals.",
};

export default function NHLPage() {
  return <SportHubServer sportSlug="nhl" />;
}
