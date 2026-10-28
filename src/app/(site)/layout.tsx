import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col bg-ink-950 text-foreground">
      <div className="gradient-mesh" aria-hidden="true" />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
