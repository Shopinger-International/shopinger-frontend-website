import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
// types
import type { FC } from "react";
import type { IFormattedCategoryMapping } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";

// local components
import ProductCard from "@/components/product/related-products/product-card.component";

// icons
import { ChevronLeft, ChevronRight } from "lucide-react";

// helpers
import { generateSlug } from "@/helpers/product.helper";

// api hooks
import useRelatedProducts from "@/hooks/axios/product/use-related-products.hook";
import useEmblaCarousel from "embla-carousel-react";

type IProps = {
  product_id: number;
  category_mappings: Array<IFormattedCategoryMapping>;
};
const RelatedProducts: FC<IProps> = ({ product_id, category_mappings }) => {
  const { data: related_products = [] } = useRelatedProducts(product_id);
    const [embla_ref, embla_api] = useEmblaCarousel({ loop: false, align: "start" })
    const [can_scroll_prev, setCanScrollPrev] = useState(false);
   const [can_scroll_next, setCanScrollNext] = useState(false);
const goToPrev = useCallback(() => {
  embla_api?.scrollPrev();
}, [embla_api]);

const goToNext = useCallback(() => {
  embla_api?.scrollNext();
}, [embla_api]);
  const formatted_related_products = related_products.flatMap((product) => {
    const { variants, title, brand, product_medias } = product;
    return variants.map((variant) => {
      const updated_title =
        !brand ||
        brand.toLocaleLowerCase() == "generic" ||
        title.includes(brand)
          ? title
          : `${brand} ${title}`;

      const visual_values = variant.variant_attribute_values
        .filter(
          ({ attribute }) =>
            category_mappings.find(
              (mapping) => mapping.attribute_id == attribute.id,
            )?.is_visual,
        )
        .map(({ value }) => value);
      const main_title = visual_values.length
        ? `${updated_title} in ${visual_values.join(", ")}`
        : `${updated_title}`;

      let variant_medias = variant.variant_medias.map(({ media }) => media);

      let variant_medias_with_title = (
        variant_medias.length
          ? variant_medias
          : product_medias.map(({ media }) => media)
      ).map((media, index) => {
        const image_title = visual_values.length
          ? `${updated_title} in ${visual_values.join(", ")} - Image ${index + 1}`
          : `${updated_title} - Image ${index + 1}`;

        return {
          media,
          image_title,
        };
      });
      const product_slug = generateSlug(product.title);
      return {
        title: main_title,
        src: `/${product_slug}/p/${product.id}/${variant?.id}`,
        variant_medias_with_title,
        selling_price: variant.variant_pricing.selling_price_with_commission,
        mrp: variant.variant_pricing.mrp,
      };
    });
  });

  useEffect(() => {
  if (!embla_api) return;

  const updateScrollButtons = () => {
    setCanScrollPrev(embla_api.canScrollPrev());
    setCanScrollNext(embla_api.canScrollNext());
  };

  updateScrollButtons();

  embla_api.on("select", updateScrollButtons);
  embla_api.on("reInit", updateScrollButtons);

  return () => {
    embla_api.off("select", updateScrollButtons);
    embla_api.off("reInit", updateScrollButtons);
  };
}, [embla_api]);
if(related_products.length === 0) return null;
  return (
    <section className="mb-8" aria-labelledby="similar-products">
      <div className="mx-auto max-w-6xl space-y-4 px-4 lg:space-y-6" >
        <h2 className="font-semibold lg:text-xl" id="similar-products">
          Similar Products
        </h2>
        {/* Left arrow */}
        <div
          className="relative mx-auto"
          role="region"
          aria-label="Related Products Region"
          
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

          <div
          className="embla__viewport overflow-hidden"
          ref={embla_ref}
          >
            <div className="embla__container flex gap-6">
            {formatted_related_products.map(
              (
                { title, src, variant_medias_with_title, selling_price, mrp },
                index,
              ) => (

                  <Link href={src} className="embla__slide">
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
export default RelatedProducts;
