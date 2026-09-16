// types
import type { FC } from "react";

// local components
import ProductCard from "./components/categories/product-card/product-card.component";
import useTopProducts from "./hooks/axios/product/use-top-products.hook";
import { generateSlug, isNewProduct } from "./helpers/product.helper";

type IProps = {
  heading: string;
  aria_label: string;
  product_id: number;
};

const ProductGridSection: FC<IProps> = ({
  heading,
  aria_label,
  product_id,
}) => {
  const { data: top_products } = useTopProducts(product_id);
  if (!top_products) return null;

  const formatted_top_products = top_products
    ?.map((product) => {
      const {
        id: product_id,
        variants,
        title,
        brand,
        created_at,
        product_medias,
        reviews_count,
        avg_rating,
        sub_sub_category_id,
        bought_last_month,
      } = product;
      const updated_title =
        !brand ||
        brand.toLocaleLowerCase() == "generic" ||
        title.includes(brand)
          ? title
          : `${brand} ${title}`;

      const product_slug = generateSlug(product.title);
      const sortedVariants = (variants || []).sort(
        ({ variant_pricing: a }, { variant_pricing: b }) =>
          a.selling_price_with_commission - b.selling_price_with_commission,
      );

      const first_variant = sortedVariants[0];

      if (!first_variant) return null;
      const { id: variant_id, variant_medias, variant_pricing } = first_variant;
      const { mrp, selling_price_with_commission } = variant_pricing;

      const discount_percentage = Math.round(
        ((mrp - selling_price_with_commission) / mrp) * 100,
      );
      const product_reviews_link = `/${product_slug}/p/${product_id}/reviews`;
      const is_new = isNewProduct(created_at);
      return {
        product_id,
        variant_id,
        title: updated_title,
        src: `/${product_slug}/p/${product.id}/${variant_id}`,
        product_thumbnail: variant_medias[0]?.media ?? product_medias[0].media,
        selling_price: selling_price_with_commission,
        mrp,
        discount_percentage,
        is_new,
        have_variants: variants.length > 1,
        total_reviews: reviews_count,
        product_reviews_link,
        avg_rating,
        bought_last_month,
        is_wishlisted: !!first_variant._count?.wishlists,
        sub_sub_category_id,
      };
    })
    .filter(Boolean);

  return (
    <section className="mb-8" aria-labelledby="similar-products ">
      <div className="mx-auto max-w-6xl space-y-4 px-4 lg:space-y-6">
        <h2 className="font-semibold lg:text-xl" id="similar-products">
          {heading}
        </h2>
        <div
          className="relative mx-auto"
          role="region"
          aria-label={`${aria_label}` + "Region"}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {formatted_top_products?.map((product, index) =>
              product ? (
                <ProductCard
                  {...product}
                  index={index}
                  key={`category-product-${product?.variant_id}`}
                />
              ) : null,
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default ProductGridSection;
