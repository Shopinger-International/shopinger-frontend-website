import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

// local components
import PromoBanner from "@/components/home/promo-banner.component";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="space-y-10 px-4 pt-(--header-height)">
      <PromoBanner />
    </div>
  );
}
