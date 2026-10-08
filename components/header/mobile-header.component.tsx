import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
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
  },
  {
    label: "Medicine",
    href: "/categories/Health-and-Personal-Care",
  },
];

const MobileHeader: FC = () => {
  const is_mobile = useIsMobile();
  const router = useRouter();
  const { data: user_details } = useUserDetails();
  const is_mounted = useIsMounted();
  const delivery_time = user_details ? "45" : "10";
  const mobile_top_ref = useRef<HTMLDivElement>(null);
  const [is_search_fixed, setIsSearchFixed] = useState(false);

  const is_grocery =
    categories.find(({ label }) => label == "Grocery")?.href == router.asPath ||
    router.asPath.toLowerCase().includes("grocery");

  const is_pharmacy =
    categories.find(({ label }) => label == "Pharmacy" || label == "Medicine")?.href == router.asPath ||
    router.asPath.toLowerCase().includes("pharmacy") ||
    router.asPath.toLowerCase().includes("personal-care");

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const mobileTopHeight = mobile_top_ref.current?.offsetHeight || 120;
          const shouldFix = window.scrollY >= mobileTopHeight;
          setIsSearchFixed((prev) => (prev !== shouldFix ? shouldFix : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col lg:hidden w-full">
      {/* Scrollable Top Section (Store banner, delivery info & categories scroll up naturally) */}
      <div
        ref={mobile_top_ref}
        className={cn(
          "flex flex-col gap-2 px-4 py-2.5 transition-colors",
          is_grocery
            ? "bg-green-50"
            : is_pharmacy
              ? "bg-blue-50"
              : "bg-orange-50",
        )}
      >
        {/* Store Closed Banner */}
        <StoreClosedBanner className="w-full -mt-1 mb-1" />

        {/* Delivery & Account Header */}
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-base font-semibold sm:text-lg">
              Delivery in{" "}
              <span
                className={cn(
                  "font-bold",
                  is_grocery ? "text-secondary" : is_pharmacy ? "text-blue-600" : "text-brand",
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
          className="no-scrollbar flex items-center gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap py-0.5"
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
                  "flex h-9 shrink-0 items-center justify-center gap-1 rounded-md px-3 text-xs sm:text-sm transition-colors overflow-hidden",
                  is_active
                    ? is_cat_grocery
                      ? "bg-green-100 text-green-700 font-semibold"
                      : is_cat_pharmacy
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "bg-orange-100 text-brand font-semibold"
                    : "bg-white text-gray-900 shadow-xs hover:bg-gray-50 font-medium",
                ].join(" ")}
              >
                {icon}
                {href !== "/" && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Spacer div when search bar is fixed on mobile to prevent content shift */}
      {is_search_fixed && <div className="h-[56px] w-full" />}

      {/* Search Bar Container (Fixes on screen at top:0 when top section scrolls out) */}
      <div
        className={cn(
          "w-full px-4 py-2.5 transition-all duration-200",
          is_search_fixed
            ? "fixed top-0 left-0 z-30 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
            : "relative bg-white shadow-xs border-b border-gray-100",
        )}
      >
        <div id="mobile-header-search-container" className="w-full">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
