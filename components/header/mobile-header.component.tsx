import { useRouter } from "next/router";
import Link from "next/link";
// types
import type { FC, ReactNode } from "react";

// icons
import { CircleUserIcon } from "lucide-react";
import GroceryIcon from "@/components/common/icons/grocery.icon";
import PharmacyIcon from "@/components/common/icons/pharmacy.icon";
import ShopingerIcon from "@/components/common/icons/shopinger.icon";

// local components
import LocationTooltip from "@/components/header/location/location-tooltip.component";
import SearchBar from "@/components/header/search-bar/search-bar.component";

// hooks
import useIsMounted from "@/hooks/common/use-is-mounted.hook";
import useIsMobile from "@/hooks/common/use-is-mobile.hook";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useCategories from "@/hooks/axios/common/use-categories";

//context
import { useCategoryContext } from "@/provider/selected-category-provider";

// helpers
import { cn } from "@/lib/utils";
import clsx from "clsx";

type ICategory = {
  label: string;
  href: string;
  icon: ReactNode;
};

const categories: ICategory[] = [
  {
    label: "Shopinger",
    href: "/",
    icon: <ShopingerIcon size={100} />,
  },
  {
    label: "Grocery",
    href: "/categories/Grocery",
    icon: <GroceryIcon size={28} />,
  },
  {
    label: "Pharmacy",
    href: "/categories/Health-and-Personal-Care",
    icon: <PharmacyIcon size={28} />,
  },
];

const MobileHeader: FC = () => {
  const is_mobile = useIsMobile();
  const router = useRouter();
  const { data: user_details } = useUserDetails();
  const { setSelectedCategory, is_grocery, is_medicine } = useCategoryContext();
  const { data: all_categoreis } = useCategories(true);
  const is_mounted = useIsMounted();

  const delivery_time = user_details ? "45" : "10";

  const is_pharmacy =
    categories.find(({ label }) => label == "Pharmacy")?.href == router.asPath;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 bg-orange-50 px-4 py-3 transition-all duration-500 ease-in lg:hidden",
        is_grocery && "bg-green-100",
        is_pharmacy && "border-b-3 border-blue-500",
      )}
    >
      {/* Delivery & Account */}
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-lg font-semibold">
            Delivery in{" "}
            <span
              className={clsx(
                "font-bold",
                is_grocery
                  ? "text-green-500"
                  : is_medicine
                    ? "text-blue-500"
                    : "text-orange-500",
              )}
            >
              {delivery_time} minutes
            </span>
          </p>

          {is_mounted && is_mobile && (
            <LocationTooltip className="flex lg:hidden" />
          )}
        </div>

        <Link href="/account" aria-label="Account" className="ml-3 shrink-0">
          <CircleUserIcon className="size-6" aria-hidden />
        </Link>
      </div>

      {/* Quick Commerce Categories */}
      <nav
        aria-label="Shopinger categories"
        className="no-scrollbar flex items-center gap-2 overflow-x-auto"
      >
        {categories.map((category) => {
          const { label, href, icon } = category;
          const is_active = href == router.asPath;
          const selected_category =
            all_categoreis?.find((cat) => cat.name === category.label) ?? null;

          return (
            <Link
              onClick={() => setSelectedCategory(selected_category)}
              key={label}
              href={href}
              className={[
                "flex h-10 shrink-0 items-center gap-1 rounded-md px-3 text-sm transition-colors",
                !is_active
                  ? "bg-white text-gray-900 shadow-xs hover:bg-gray-50"
                  : is_grocery
                    ? "bg-green-100 text-green-500"
                    : is_medicine
                      ? "bg-blue-100 bg-blue-500"
                      : "bg-orange-100 text-orange-500",
              ].join(" ")}
            >
              {icon}

              {href !== "/" && (
                <span className={is_active ? "font-semibold" : "font-medium"}>
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Search */}
      <SearchBar is_grocery={is_grocery} is_medicine={is_medicine} />
    </div>
  );
};

export default MobileHeader;
