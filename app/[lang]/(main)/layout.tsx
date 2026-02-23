import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";
import { SkipLink } from "@/components/ui/SkipLink";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <SkipLink />
      <Navbar />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>

      <Footer />
    </div>
  );
}
