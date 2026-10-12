import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";

const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PALMO — The real source of every sip",
  description: "PALMO premium coconut water. Pressed from a single young coconut, nothing added.",
};

export const viewport: Viewport = {
  themeColor: "#fbfaf6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anton.variable} ${manrope.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  );
}
