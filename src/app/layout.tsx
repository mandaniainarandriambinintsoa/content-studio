import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Content Studio — Manda",
  description: "Pipeline vidéo solo pour TikTok, Reels, Shorts et LinkedIn",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
