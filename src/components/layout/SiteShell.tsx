import { Header } from "./Header";
import { Footer } from "./Footer";
import { RevealController } from "@/components/motion/RevealController";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <RevealController />
    </>
  );
}
