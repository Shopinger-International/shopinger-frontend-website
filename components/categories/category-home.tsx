// types
import type { FC } from "react";

// local components
import SubCategorySection from "./sub-category-section.component";
import { CategoryBannerSection } from "./category-banner.component";

const CategoryHome: FC = () => {
  const banners = [
    {
      id: "banner-1",
      image:
        "https://cdn.shopinger.co.in/uploads/campaigns/1785328742937-a9983506-1fc4-4101-b33e-1bc86fade25d.png",
      href: "/categories/Appliances",
      alt: "Appliances sale",
    },
    {
      id: "banner-2",
      image:
        "https://cdn.shopinger.co.in/uploads/campaigns/1785328218159-effdcd2f-f93c-46f2-b75f-1323ac098cb9.png",
      href: "/categories/Appliances",
      alt: "Home appliances",
    },
    {
      id: "banner-3",
      image:
        "https://cdn.shopinger.co.in/uploads/campaigns/1785328742937-a9983506-1fc4-4101-b33e-1bc86fade25d.png",
      href: "/categories/Appliances",
      alt: "Appliances offers",
    },
  ];

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
