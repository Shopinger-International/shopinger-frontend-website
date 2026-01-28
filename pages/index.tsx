import { Geist, Geist_Mono } from "next/font/google";

// local components
import PromoBanner from "@/components/home/promo-banner.component";
import SaleLiveSection from "@/components/home/sale-live-section.component";
import WatchLiveSection from "@/components/home/watch-live-section.component";

export default function Home() {
  return (
    <div className="space-y-4 px-4 pt-(--header-height)">
      <PromoBanner />
      <div className="max-w-8xl mx-auto grid grid-cols-1 gap-6 lg:grid-cols-[60%_1fr]">
        {/* Sale Live Section */}
        <SaleLiveSection />
        <WatchLiveSection />
      </div>
    </div>
  );
}
