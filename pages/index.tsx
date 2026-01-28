
// local components
import PromoBanner from "@/components/home/promo-banner.component";
import SaleLiveSection from "@/components/home/sale-live-section.component";
import WatchLiveSection from "@/components/home/watch-live-section.component";
import ProductMarquee from "@/components/home/product-marquee.component";

export default function Home() {
  return (
    <div className="px-4 pt-(--header-height)">
      <div className="max-w-8xl mx-auto w-full space-y-4">
        <PromoBanner />
        <ProductMarquee />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[60%_1fr]">
          {/* Sale Live Section */}
          <SaleLiveSection />
          <WatchLiveSection />
        </div>
      </div>
    </div>
  );
}
