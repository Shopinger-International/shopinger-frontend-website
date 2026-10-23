import { useContext, useEffect, useState } from "react";
// types
import type { FC } from "react";
import { Stethoscope } from "lucide-react";

// local components
import SubCategorySection from "./sub-category-section.component";
import useAllCamapigns from "@/hooks/axios/campaign/use-campaigns.hook";
import CategoryProducts from "./category-products.component";
import Campaign from "../home/campaign.component";
import CampaignTimer from "../header/campaign-timer.component";
import MedicalCategorySubHeader, {
  MedicalHeaderTab,
} from "./medical-category-sub-header.component";
import { FooterStateContext } from "@/context";

const CategoryHome: FC<{
  category_slug: string;
}> = ({ category_slug }) => {
  const [active_tab, setActiveTab] = useState<MedicalHeaderTab>("all");
  const { data: campaigns = [] } = useAllCamapigns({
    display_scope: "CATEGORY",
    category_slug: category_slug,
  });
  const { updateShow: updateShowFooter } = useContext(FooterStateContext);

  const slug_lower = (category_slug || "").toLowerCase();
  const is_medical =
    slug_lower.includes("health") ||
    slug_lower.includes("personal-care") ||
    slug_lower.includes("medical") ||
    slug_lower.includes("pharmacy") ||
    slug_lower.includes("medicine");

  useEffect(() => {
    if (is_medical) {
      updateShowFooter?.(true);
    }
  }, [is_medical, updateShowFooter]);

  return (
    <>
      {is_medical && (
        <>
          <MedicalCategorySubHeader
            active_tab={active_tab}
            onTabChange={setActiveTab}
          />
          <div className="mx-auto mb-6 flex w-[calc(100%-2rem)] max-w-2xl flex-col items-center rounded-2xl border border-blue-100 bg-linear-to-b from-blue-50/70 to-white px-5 py-8 text-center shadow-sm sm:py-10">
            <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-blue-100 text-blue-500">
              <Stethoscope className="size-7" aria-hidden="true" />
            </span>
            <span className="mb-3 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              Shopinger Medical
            </span>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Medical services coming soon
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-600">
              We’re working to bring healthcare services to you. Please check
              back soon.
            </p>
          </div>
        </>
      )}

      <div className="max-w-8xl mx-auto w-full space-y-4 px-4">
        <Campaign campaigns={campaigns} />
        <CampaignTimer />
        {!is_medical && <SubCategorySection />}
      </div>

      {!is_medical && (
        <CategoryProducts
          category_slug={category_slug}
          category_type={"main"}
        />
      )}
    </>
  );
};

export default CategoryHome;
