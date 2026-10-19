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
import StoreClosedBanner from "@/components/header/store-closed-banner.component";

// hooks
import useIsMounted from "@/hooks/common/use-is-mounted.hook";
import useIsMobile from "@/hooks/common/use-is-mobile.hook";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

// helpers
import { cn } from "@/lib/utils";
import { useLocationTooltipStateContext } from "@/provider/location-tooltip.provider";

type ICategory = {
  label: string;
  href: string;
  icon?: ReactNode;
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
    // icon: <GroceryIcon size={28} />,
  },
  {
    label: "Medicine",
    href: "/categories/Health-and-Personal-Care",
    // icon: <PharmacyIcon size={28} />,
  },
];

const MobileHeader: FC = () => {
  const is_mobile = useIsMobile();
  const router = useRouter();
  const { data: user_details } = useUserDetails();
  const { delivery_time, distance, selected_address } =
    useLocationTooltipStateContext();

  const is_mounted = useIsMounted();
  const is_grocery =
    categories.find(({ label }) => label == "Grocery")?.href == router.asPath ||
    router.asPath.toLowerCase().includes("grocery");

  const is_pharmacy =
    categories.find(({ label }) => label == "Pharmacy" || label == "Medicine")
      ?.href == router.asPath ||
    router.asPath.toLowerCase().includes("pharmacy") ||
    router.asPath.toLowerCase().includes("personal-care");

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 overflow-hidden px-4 py-3",
        "border-b border-amber-200/70 lg:hidden",
        "bg-[#fff8eb]",
      )}
      style={{
        backgroundImage: "url('/diwali-bg.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Store Closed Banner */}
      <StoreClosedBanner className="-mt-1 mb-1 w-full" />

      {/* Delivery & Account Header */}
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-lg font-semibold">
            Delivery in{" "}
            <span
              className={cn(
                "font-bold",
                is_grocery
                  ? "text-secondary"
                  : is_pharmacy
                    ? "text-blue-600"
                    : "text-brand",
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
          <CircleUserIcon className="size-6 text-gray-900" aria-hidden />
        </Link>
      </div>

      {/* Quick Commerce Categories */}
      <nav
        aria-label="Shopinger categories"
        className="no-scrollbar flex items-center gap-2 overflow-x-auto overflow-y-hidden py-0.5 whitespace-nowrap"
      >
        {categories.map(({ label, href, icon }) => {
          const is_active = href == router.asPath;
          const is_cat_grocery = label === "Grocery";
          const is_cat_pharmacy = label === "Pharmacy" || label === "Medicine";
          return (
            <Link
              key={label}
              href={href}
              className={[
                "flex h-10 shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md px-3 text-sm transition-colors",
                is_active
                  ? is_cat_grocery
                    ? "bg-green-100 text-green-700"
                    : is_cat_pharmacy
                      ? "bg-blue-100 text-blue-700"
                      : "text-brand bg-orange-100"
                  : "bg-white text-gray-900 shadow-xs hover:bg-gray-50",
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

      {/* Sticky Search */}
      {/* <div
        id="mobile-header-search-container"
        className="sticky top-0 z-50 -mx-4 px-4 py-2"
      >
        <SearchBar />
      </div> */}
    </div>
  );
};

export default MobileHeader;
