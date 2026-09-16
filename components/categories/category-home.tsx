// types
import type { FC } from "react";

// local components
import SubCategorySection from "./sub-category-section.component";
import { CategoryBannerSection } from "./category-banner.component";
import useAllCamapigns from "@/hooks/axios/campaign/use-campaigns.hook";

const CategoryHome: FC<{ category_slug: string }> = ({ category_slug }) => {
  const { data: campaigns = [] } = useAllCamapigns({
    display_scope: "CATEGORY",
    category_slug: category_slug,
  });

  const banners = campaigns.map((campaign) => ({
    id: campaign.id.toString(),
    image: campaign.banner,
    href: campaign.slug,
    alt: campaign.title,
  }));

  return (
    <>
      <CategoryBannerSection banners={banners} />
      <div className="flex space-x-4 px-4">
        <div className="min-w-0 flex-1 space-y-4">
          <SubCategorySection />
        </div>
      </div>
    </>
  );
};

export default CategoryHome;
