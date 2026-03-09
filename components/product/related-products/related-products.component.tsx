import { useRef } from "react";
// types
import type { FC } from "react";
import type IProduct from "@/types/product";
import type { IMediaGroup } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";
import type ICategoryAttributeMapping from "@/types/category-attribute-mapping";

// local components
import ProductCard from "@/components/product/related-products/product-card.component";

// external components
import { Swiper, SwiperSlide } from "swiper/react";

// hooks
import useIsMobile from "@/hooks/common/use-is-mobile.hook";

// swiper modules
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// icons
import { ChevronLeft, ChevronRight } from "lucide-react";

type IProps = {
  related_products: IProduct[];
  category_mappings: ICategoryAttributeMapping[];
};
const RelatedProducts: FC<IProps> = ({
  related_products,
  category_mappings,
}) => {
  const is_mobile = useIsMobile();
  const swiper_ref = useRef<any>(null);
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
              ({ attribute: mapping_attribute }) =>
                mapping_attribute.id == attribute.id,
            )?.is_visual,
        )
        .map(({ value }) => value);
      const main_title = visual_values.length
        ? `${updated_title} in ${visual_values.join(", ")} | Shopinger`
        : `${updated_title} | Shopinger`;

      const media_group =
        product.variant_visual_attribute_medias.reduce<IMediaGroup>(
          (acc, item) => {
            const { attribute_id, attribute_value } = item;
            const updated_attribute_value = attribute_value.toLowerCase();

            if (!acc[attribute_id]) {
              acc[attribute_id] = {};
            }

            if (!acc[attribute_id][updated_attribute_value]) {
              acc[attribute_id][updated_attribute_value] = [];
            }

            acc[attribute_id][updated_attribute_value].push(item.media);

            return acc;
          },
          {},
        );

      let variant_medias = variant.variant_attribute_values
        .filter(
          ({ attribute }) =>
            category_mappings.find(
              ({ attribute: mapping_attribute }) =>
                mapping_attribute.id == attribute.id,
            )?.is_visual,
        )
        .flatMap(
          ({ attribute, value }) =>
            media_group[attribute.id as number]?.[value.toLowerCase()] ?? [],
        );

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
      return {
        title: main_title,
        variant_medias_with_title,
        selling_price: variant.variant_pricing.selling_price_with_commission,
        mrp: variant.variant_pricing.mrp,
      };
    });
  });
  console.log("value of formatted products", formatted_related_products);
  return (
    <section className="mb-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Left arrow */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => swiper_ref.current?.slidePrev()}
            className="absolute top-1/2 -left-2 z-10 hidden -translate-y-10 items-center justify-center rounded-full bg-orange-500 p-3 text-white shadow-lg transition-all hover:scale-110 hover:bg-orange-600 md:flex"
          >
            <ChevronLeft />
          </button>

          <Swiper
            modules={[Navigation]}
            spaceBetween={is_mobile ? 16 : 40}
            slidesPerView={"auto"}
            slidesPerGroup={is_mobile ? 1 : 4}
            grabCursor
            onSwiper={(swiper) => (swiper_ref.current = swiper)}
          >
            {formatted_related_products.map(
              (
                { title, variant_medias_with_title, selling_price, mrp },
                index,
              ) => (
                <SwiperSlide
                  key={`related-product-${index}`}
                  className="w-auto!"
                >
                  <ProductCard
                    title={title}
                    thumbnail={variant_medias_with_title[0].media}
                    thumbnail_title={variant_medias_with_title[0].image_title}
                    selling_price={selling_price}
                    mrp={mrp}
                  />
                </SwiperSlide>
              ),
            )}
          </Swiper>

          {/* Right arrow */}
          <button
            onClick={() => swiper_ref.current?.slideNext()}
            className="absolute top-1/2 -right-2 z-10 hidden -translate-y-10 items-center justify-center rounded-full bg-orange-500 p-3 text-white shadow-lg transition-all hover:scale-110 hover:bg-orange-600 md:flex"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};
export default RelatedProducts;
