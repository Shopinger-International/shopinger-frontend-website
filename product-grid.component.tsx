import Link from "next/link";
// types
import type { FC } from "react";

// local components
import ProductCard from "@/components/product/related-products/product-card.component";

type IProps = {
  heading: string;
  data: any;
  aria_label: string;
};
const ProductGridSection: FC<IProps> = ({ heading, data, aria_label }) => {
  if (data.length === 0) return null;
  return (
    <section className="mb-8" aria-labelledby="similar-products">
      <div className="mx-auto max-w-6xl space-y-4 px-4 lg:space-y-6">
        <h2 className="font-semibold lg:text-xl" id="similar-products">
          {heading}
        </h2>
        <div
          className="relative mx-auto"
          role="region"
          aria-label={`${aria_label}` + "Region"}
        >
          <div>
            <div className="grid grid-cols-2 place-items-center gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {data?.map(
                (
                  { title, src, variant_medias_with_title, selling_price, mrp },
                  index: number,
                ) => (
                  <Link key={index} href={src} className="my-4">
                    <ProductCard
                      title={title}
                      thumbnail={variant_medias_with_title[0].media}
                      thumbnail_title={variant_medias_with_title[0].image_title}
                      selling_price={selling_price}
                      mrp={mrp}
                    />
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ProductGridSection;
