import PublicNavBar from "@/components/PublicNavBar";
import Footer from "@/components/Footer";

export default function MarketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <PublicNavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
