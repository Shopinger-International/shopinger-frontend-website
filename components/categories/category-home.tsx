// types
import type { FC } from "react";

// local components
import SubCategorySection from "./sub-category-section.component";
import useAllCamapigns from "@/hooks/axios/campaign/use-campaigns.hook";
import CategoryProducts from "./category-products.component";
import Campaign from "../home/campaign.component";
import CampaignTimer from "../header/campaign-timer.component";

const CategoryHome: FC<{
  category_slug: string;
}> = ({ category_slug }) => {
  const { data: campaigns = [] } = useAllCamapigns({
    display_scope: "CATEGORY",
    category_slug: category_slug,
  });

  return (
    <>
      <div className="max-w-8xl mx-auto w-full space-y-4 px-4">
        <Campaign campaigns={campaigns} />
        <CampaignTimer />
        <SubCategorySection />
      </div>

      <CategoryProducts category_slug={category_slug} category_type={"main"} />
    </>
  );
};

export default CategoryHome;
