import SportHubServer from "@/components/SportHubServer";

export const revalidate = 300;

export const metadata = {
  title: "NBA Markets — Sports Market OS",
  description: "Live NBA market intelligence from Polymarket. Volume surges, spread compression, and sharp flow signals.",
};

export default function NBAPage() {
  return <SportHubServer sportSlug="nba" />;
}
