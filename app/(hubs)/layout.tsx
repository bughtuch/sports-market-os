import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";

export default function HubsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <MarketTicker />
      <TerminalHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
