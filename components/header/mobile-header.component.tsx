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
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

// helpers
import { cn } from "@/lib/utils";

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
  const router = useRouter();
  const { data: user_details } = useUserDetails();
  const is_mounted = useIsMounted();

  const delivery_time = user_details ? "45" : "10";
  const is_grocery =
    categories.find(({ label }) => label == "Grocery")?.href == router.asPath;

  const is_pharmacy =
    categories.find(({ label }) => label == "Pharmacy")?.href == router.asPath;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-none bg-orange-50 px-4 py-3 lg:hidden",
        is_grocery && "border-b-3 border-green-500",
        is_pharmacy && "border-b-3 border-blue-500",
      )}
    >
      {/* Delivery & Account */}
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-lg font-semibold">
            Delivery in{" "}
            <span className="font-bold text-orange-500">
              {delivery_time} minutes
            </span>
          </p>

          {is_mounted && <LocationTooltip className="flex lg:hidden" />}
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
        {categories.map(({ label, href, icon }) => {
          const is_active = href == router.asPath;
          return (
            <Link
              key={label}
              href={href}
              className={[
                "flex h-10 shrink-0 items-center gap-1 rounded-md px-3 text-sm transition-colors",
                is_active
                  ? "bg-orange-100 text-orange-500"
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

      {/* Search */}
      <SearchBar />
    </div>
  );
};

export default MobileHeader;
