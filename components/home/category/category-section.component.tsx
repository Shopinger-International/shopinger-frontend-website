import type { FC } from "react";
import type { ICategoryRecommendation } from "@/hooks/axios/home/use-feed.hook";

// local components
import HomeProductRow from "@/components/home/home-product-row.component";
import HomeProductCard from "@/components/home/home-product-card.component";

const CategorySection: FC<{
  category_recommendations: Array<ICategoryRecommendation>;
}> = ({ category_recommendations }) => {
  if (!category_recommendations || category_recommendations.length === 0) {
    return null;
  }

  // Filter out any category recommendation that does not have products
  const valid_categories = category_recommendations.filter(
    (cat) => cat.products && cat.products.length > 0,
  );

  if (valid_categories.length === 0) {
    return null;
  }

  return (
    <div className="max-w-8xl mx-auto w-full space-y-6 px-4">
      {valid_categories.map((cat, index) => {
        const {
          category_name,
          category_type,
          main_category_slug,
          sub_category_slug,
          sub_sub_category_slug,
          products,
        } = cat;

        const category_url = `categories/${main_category_slug}${
          ["SUB", "SUB_SUB"].includes(category_type) ? "/" + sub_category_slug : ""
        }${category_type === "SUB_SUB" ? "/" + sub_sub_category_slug : ""}`;

        return (
          <HomeProductRow
            key={`category-rec-${category_name}-${index}`}
            title={category_name}
            products={products}
            view_all_href={category_url}
            CardComponent={HomeProductCard}
          />
        );
      })}
    </div>
  );
};

export default CategorySection;
