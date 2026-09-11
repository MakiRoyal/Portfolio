import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import CustomCursor from "@/components/CustomCursor";
import GrainOverlay from "@/components/GrainOverlay";
import IndexNav from "@/components/IndexNav";
import KonamiListener from "@/components/KonamiListener";
import Loader from "@/components/Loader";
import ReaderShell from "@/components/ReaderShell";
import ScrollProgress from "@/components/ScrollProgress";
import { ScrollShellProvider } from "@/components/ScrollShell";
import SceneGate from "@/components/three/SceneGate";
import { siteUrl } from "@/lib/data";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Mika Ramanantsoa — Développeur Full-Stack & Mobile",
  description:
    "Portfolio de Mika Ramanantsoa, développeur full-stack et mobile (React, React Native, Spring Boot, FastAPI). Basé à Paris, disponible en septembre 2026.",
  openGraph: {
    title: "Mika Ramanantsoa — Développeur Full-Stack & Mobile",
    description:
      "Développeur full-stack et mobile — React, React Native, Spring Boot, FastAPI. Basé à Paris, disponible en septembre 2026.",
    url: siteUrl,
    siteName: "Mika Ramanantsoa",
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0d10",
  colorScheme: "dark",
};

/* Exécuté avant la peinture : si le boot a déjà tourné cette session,
   le loader est masqué par CSS avant même l’hydratation. */
const bootedScript =
  "try{if(sessionStorage.getItem('booted'))document.documentElement.dataset.booted='1'}catch(e){}";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bg font-sans text-fg antialiased">
        <script dangerouslySetInnerHTML={{ __html: bootedScript }} />
        <a href="#contenu" className="skip-link">
          Aller au contenu
        </a>
        <AppShell>
          <Loader />
          <ScrollShellProvider>
            <SceneGate />
            <IndexNav />
            <ReaderShell>{children}</ReaderShell>
            <ScrollProgress />
          </ScrollShellProvider>
          <GrainOverlay />
          <CustomCursor />
          <KonamiListener />
        </AppShell>
      </body>
    </html>
  );
}
