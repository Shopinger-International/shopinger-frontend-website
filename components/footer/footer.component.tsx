import Image from "next/image";
// types
import type { FC } from "react";

// local components
import FooterLinks from "@/components/footer/footer-links.component";
import FooterAddress from "@/components/footer/footer-address.component";
import FooterBottom from "@/components/footer/footer-bottom.component";
import CitiesWeServe from "@/components/footer/cities-we-serve.component";
import FooterCategories from "@/components/footer/footer-categories.component";

// icons
import { ArrowUp } from "lucide-react";

// data
import { payment_methods } from "@/components/footer/footer-bottom.component";
import { useLocationTooltipStateContext } from "@/provider/location-tooltip.provider";

const Footer: FC = () => {
  const { selected_address } = useLocationTooltipStateContext();

  return (
    <>
      <section className="flex w-full items-center justify-center py-3.5">
        {selected_address && (
          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="group bg-brand text-brand-foreground border-brand/20 flex cursor-pointer items-center justify-center gap-2.5 rounded-full border px-5 py-1.5 text-xs font-bold shadow-xs transition-all hover:opacity-90 sm:text-sm"
            aria-label="back to top"
          >
            <span>Back to top</span>
            <span className="bg-brand-foreground rounded-full p-1 transition-colors">
              <ArrowUp strokeWidth={2.5} className="text-brand size-3.5" />
            </span>
          </button>
        )}
      </section>
      <footer className="bg-background text-background-foreground mb-(--buy-cta-container-height) w-full text-sm lg:mb-0">
        <FooterCategories />
        <div className="mb-8 flex flex-wrap items-center gap-3 px-4 lg:hidden">
          {payment_methods.map((icon) => (
            <Image
              key={icon}
              src={`/footer/payment-method/${icon}.png`}
              alt={icon}
              width={40}
              height={24}
              className="h-6 w-auto rounded bg-white p-1"
            />
          ))}
        </div>
        <CitiesWeServe />
        <div className="max-w-8xl mx-auto grid w-full grid-cols-2 gap-8 border-t border-orange-200 px-4 py-8 md:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_1fr_1.5fr] lg:px-12">
          <FooterLinks />
          <FooterAddress />
        </div>
        <FooterBottom />
      </footer>
    </>
  );
};

export default Footer;
