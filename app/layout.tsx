import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CommandPalette } from "@/components/command-palette";
import { Nav } from "@/components/nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "yukhyShell5 | Web3 Security Researcher",
  description: "Blockchain security researcher specializing in EVM smart contract auditing, DeFi security, and Web3 vulnerability research.",
  keywords: ["Web3", "Security", "Blockchain", "EVM", "Smart Contract Audit", "DeFi", "Vulnerability Research"],
  authors: [{ name: "yukhyShell5" }],
  openGraph: {
    title: "yukhyShell5 | Web3 Security Researcher",
    description: "Blockchain security researcher specializing in EVM smart contract auditing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Nav />
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}
