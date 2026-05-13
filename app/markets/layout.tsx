import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Footer from "@/components/Footer";

export default function MarketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <MarketTicker />
      <TerminalHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
