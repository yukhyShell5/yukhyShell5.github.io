import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CommandPalette } from "@/components/command-palette";
import { Nav } from "@/components/nav";
import { LanguageProvider } from "@/components/i18n";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMonoMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "yukhyShell5",
  description:
    "Blockchain security researcher specializing in EVM smart contract auditing, DeFi security, and Web3 vulnerability research.",
  keywords: [
    "Web3",
    "Security",
    "Blockchain",
    "EVM",
    "Smart Contract Audit",
    "DeFi",
    "Vulnerability Research",
  ],
  authors: [{ name: "yukhyShell5" }],
  openGraph: {
    title: "yukhyShell5",
    description:
      "Blockchain security researcher specializing in EVM smart contract auditing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${jetbrainsMono.variable} ${jetbrainsMonoMono.variable} antialiased`}
      >
        <LanguageProvider>
          <Nav />
          <CommandPalette />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
