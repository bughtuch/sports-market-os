import SportHubServer from "@/components/SportHubServer";

export const revalidate = 300;

export const metadata = {
  title: "Football Markets — Sports Market OS",
  description: "Live football market intelligence from Polymarket. European match markets, value identification across top leagues.",
};

export default function FootballPage() {
  return <SportHubServer sportSlug="football" />;
}
