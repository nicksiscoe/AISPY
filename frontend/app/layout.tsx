import "./globals.css";
import type { Metadata } from "next";
import { Unbounded } from "next/font/google";
import { GameProvider } from "./contexts/GameContext";

const unbounded = Unbounded({
  weight: ["500", "800"],
  subsets: ["latin"],
  variable: "--unbounded-font",
  display: "swap",
});

export const metadata: Metadata = {
  title: "A.I. SPY",
  description: "ELIMINATE ARTIFICIAL INTELLIGENCE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={unbounded.className}>
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
