import { forwardRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import type { ReactNode } from "react";

// icons
import { CircleUserIcon } from "lucide-react";
import GroceryIcon from "@/components/common/icons/grocery.icon";
import PharmacyIcon from "@/components/common/icons/pharmacy.icon";
import ShopingerIcon from "@/components/common/icons/shopinger.icon";

// local components
import LocationTooltip from "@/components/header/location/location-tooltip.component";
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

const MobileHeader = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => {
    const is_mobile = useIsMobile();
    const router = useRouter();
    const { data: user_details } = useUserDetails();
    const is_mounted = useIsMounted();
    const delivery_time = user_details ? "45" : "10";

  const is_grocery =
    categories.find(({ label }) => label == "Grocery")?.href == router.asPath ||
    router.asPath.toLowerCase().includes("grocery");

  const is_pharmacy =
    categories.find(({ label }) => label == "Pharmacy" || label == "Medicine")?.href == router.asPath ||
    router.asPath.toLowerCase().includes("pharmacy") ||
    router.asPath.toLowerCase().includes("personal-care");

  return (
    <div ref={ref} className={cn("flex flex-col lg:hidden w-full", className)}>
      {/* Scrollable Top Section (Store banner, delivery info & quick-commerce categories scroll up naturally) */}
      <div
        className={cn(
          "flex flex-col gap-2 px-4 transition-colors",
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
            <p className="text-base font-semibold sm:text-lg mt-2">
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
                  "flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors overflow-hidden",
                  is_active
                    ? is_cat_grocery ? "bg-green-100 text-green-700" : is_cat_pharmacy ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-brand"
                    : "bg-white text-gray-900 shadow-xs hover:bg-gray-50",
                ].join(" ")}
              >
                {icon}
                {href !== "/" && (
                  <span className="text-sm font-medium leading-none">
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        </div>
      </div>
    );
  },
);

MobileHeader.displayName = "MobileHeader";

export default MobileHeader;
