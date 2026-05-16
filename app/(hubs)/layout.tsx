import PublicNavBar from "@/components/PublicNavBar";
import Footer from "@/components/Footer";

export default function HubsLayout({
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
