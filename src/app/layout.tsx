import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { InfectionProvider } from '@/contexts/InfectionContext';
import { GlitchProvider } from '@/contexts/GlitchContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mothership Terminal",
  description: "A terminal interface for the Mothership game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <InfectionProvider>
          <GlitchProvider>
            <div className="scan-line" />
            {children}
          </GlitchProvider>
        </InfectionProvider>
      </body>
    </html>
  );
}
