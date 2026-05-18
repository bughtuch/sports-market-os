import SportHubServer from "@/components/SportHubServer";

export const revalidate = 3600;

export const metadata = {
  title: "UFC Markets — Sports Market OS",
  description: "Polymarket UFC market intelligence. Coverage building — signals activate as liquidity builds.",
};

export default function UFCPage() {
  return <SportHubServer sportSlug="ufc" />;
}
