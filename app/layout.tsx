import type { Metadata } from "next";
import { National_Park, Bricolage_Grotesque, Alan_Sans, Fredoka} from "next/font/google";
import "./globals.css";

const nationalPark = National_Park({
  variable: "--font-national-park",
  subsets: ["latin"],
  fallback: ['system-ui', 'arial'],
});

const neoBrutalist = Fredoka({
  variable: "--font-neobrutalist",
  subsets: ["latin"],
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  title: "Jazz Utilities",
  description: "Utilities for jazz practicing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nationalPark.variable} ${neoBrutalist.variable} antialiased bg-rose-200 bg-[url('/chord-utility/svg/grid.svg')] bg-repeat bg-size-[80px_80px]`}
      >
        {children}
      </body>
    </html>
  );
}
