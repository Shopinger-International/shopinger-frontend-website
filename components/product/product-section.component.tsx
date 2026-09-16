import Link from "next/link";
// types
import type { FC } from "react";

// local components
import ProductCard from "@/components/product/related-products/product-card.component";

// icons
import { ChevronLeft, ChevronRight } from "lucide-react";

// api hooks
import { useCarousel } from "@/hooks/common/use-carousel";
import { IVariantMediaWithTitle } from "@/hoc/product/with-product-gallery-functionality.hoc";

type IProps = {
  heading: string;
  data: {
    title: string;
    src: string;
    variant_medias_with_title: IVariantMediaWithTitle[];
    selling_price: number;
    mrp: number;
  }[];
  aria_label: string;
};
const ProductSection: FC<IProps> = ({ heading, data, aria_label }) => {
  const {
    goToNext,
    goToPrev,
    can_scroll_next,
    can_scroll_prev,
    ref: embla_ref,
  } = useCarousel();

  if (data.length === 0) return null;
  return (
    <section className="mb-8" aria-labelledby="similar-products">
      <div className="mx-auto max-w-6xl space-y-4 px-4 lg:space-y-6">
        <h2 className="font-semibold lg:text-xl" id="similar-products">
          {heading}
        </h2>
        {/* Left arrow */}
        <div
          className="relative mx-auto"
          role="region"
          aria-label={`${aria_label}` + "Region"}
        >
          {/* Left arrow */}
          <button
            disabled={!can_scroll_prev}
            aria-label="Show previous products"
            onClick={goToPrev}
            className="absolute top-1/2 -left-5 z-10 hidden -translate-y-3/4 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white p-2 shadow-sm hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300 disabled:hover:bg-gray-50 md:flex"
          >
            <ChevronLeft aria-hidden={true} />
          </button>

          <div className="embla__viewport overflow-hidden" ref={embla_ref}>
            <div className="embla__container flex gap-6">
              {data?.map(
                (
                  { title, src, variant_medias_with_title, selling_price, mrp },
                  index: number,
                ) => (
                  <Link key={index} href={src} className="embla__slide">
                    <ProductCard
                      title={title}
                      thumbnail={variant_medias_with_title[0].media}
                      thumbnail_title={variant_medias_with_title[0].image_title}
                      selling_price={selling_price}
                      mrp={mrp}
                      className="w-64"
                    />
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* Right arrow */}
          <button
            disabled={!can_scroll_next}
            aria-label="Show more products"
            onClick={goToNext}
            className="absolute top-1/2 -right-5 z-10 hidden -translate-y-3/4 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white p-2 shadow-sm hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300 disabled:hover:bg-gray-50 md:flex"
          >
            <ChevronRight aria-hidden={true} />
          </button>
        </div>
      </div>
    </section>
  );
};
export default ProductSection;
