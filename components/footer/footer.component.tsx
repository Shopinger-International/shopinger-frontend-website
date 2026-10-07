import Image from "next/image";
// types
import type { FC } from "react";

// local components
import FooterLinks from "@/components/footer/footer-links.component";
import FooterAddress from "@/components/footer/footer-address.component";
import FooterBottom from "@/components/footer/footer-bottom.component";
import CitiesWeServe from "@/components/footer/cities-we-serve.component";

// icons
import { ArrowUp } from "lucide-react";

// data
import { payment_methods } from "@/components/footer/footer-bottom.component";

const Footer: FC = () => {
  return (
    <>
      <section className="flex w-full items-center justify-center py-3.5">
        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="group flex items-center justify-center gap-2.5 rounded-full bg-brand px-5 py-1.5 text-xs sm:text-sm font-bold text-brand-foreground border border-brand/20 shadow-xs hover:opacity-90 transition-all cursor-pointer"
          aria-label="back to top"
        >
          <span>Back to top</span>
          <span className="rounded-full bg-brand-foreground p-1 transition-colors">
            <ArrowUp strokeWidth={2.5} className="size-3.5 text-brand" />
          </span>
        </button>
      </section>
      <footer className="mb-(--buy-cta-container-height) w-full bg-background text-sm text-background-foreground lg:mb-0">
        <div className="max-w-8xl mx-auto grid w-full grid-cols-2 gap-8 px-4 py-8 md:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_1fr_1.5fr] lg:px-12">
          <FooterLinks />
          <FooterAddress />
        </div>
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
        <FooterBottom />
      </footer>
    </>
  );
};

export default Footer;
