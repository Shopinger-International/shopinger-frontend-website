import { useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
// types
import type { FC } from "react";

// local components
import SearchBar from "@/components/header/search-bar/search-bar.component";
import Cart from "@/components/common/icons/cart.icon";
import CategorySection from "@/components/header/category-section.component";
import AccountDropdown from "@/components/header/account-dropdown.component";
import FilterSortBar from "@/components/categories/filter-sort-bar.component";
import CampaignTimer from "@/components/header/campaign-timer.component";

// icons
import { Menu, ChevronRight } from "lucide-react";

// helpers
import { clsx } from "clsx";

// hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useCart from "@/hooks/axios/cart/use-cart.hook";
import { useMegaMenuContext } from "@/provider/mega-menu-provider";
import { useAddressDrawerContext } from "@/provider/selected-address-provider.component";

const LocationBlock: FC<{
  className: string;
}> = ({ className }) => {
  const { address_id, openDrawer } = useAddressDrawerContext();
  const { data: user_details } = useUserDetails();
  const user_address = user_details?.user_addresses?.find(
    (address) => address.id == address_id,
  );

  return (
    <button
      onClick={openDrawer}
      className={clsx("items-center gap-2 text-white", className)}
      aria-label={
        user_address
          ? `Update delivery location. Current location: ${user_address.state} ${user_address.pincode}`
          : "Add delivery location"
      }
    >
      <div className="flex min-w-0 items-center gap-2 lg:flex-col lg:items-start lg:gap-0">
        {user_address ? (
          <>
            <span className="hidden text-sm font-semibold lg:block">
              Delivery in minutes*
            </span>
            <span className="w-fit truncate text-xs lg:max-w-48">
              {user_address.house_number ?? ""}, {user_address.area},{" "}
              {user_address.city ?? ""}, {user_address.state},{" "}
              {user_address.pincode}
            </span>
          </>
        ) : (
          <>
            {/* Mobile */}
            <span className="text-sm lg:hidden">Choose delivery location</span>

            {/* Desktop */}
            <>
              <span className="hidden text-sm font-semibold lg:block">
                Delivery in minutes*
              </span>
              <span className="hidden text-xs lg:block">Add your location</span>
            </>
          </>
        )}
      </div>

      <ChevronRight className="size-4 shrink-0 lg:hidden" aria-hidden />
    </button>
  );
};
const Header: FC<{
  show_filter_sort_bar?: boolean;
  disable_side_filter?: boolean;
  is_bottom_navigation_showing: boolean;
}> = ({
  show_filter_sort_bar,
  disable_side_filter = false,
  is_bottom_navigation_showing,
}) => {
  const { openDrawer: openMegaMenuDrawer } = useMegaMenuContext();
  const { data: cart_details } = useCart();

  useLayoutEffect(() => {
    const header = document.getElementById("app-header");
    if (!header) return;

    const setHeight = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${header.offsetHeight + 12}px`,
      );
    };

    setHeight();

    const observer = new ResizeObserver(setHeight);
    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-0 z-30 w-full" id="app-header">
      <div
        className={clsx(
          "mx-auto grid w-full items-center bg-black",
          "grid-cols-[auto_1fr_auto]",
          "gap-2 px-4 py-1.5",
          // "lg:max-w-8xl",
          "lg:grid-cols-[auto_minmax(0,1fr)_auto]",
          "lg:gap-4",
        )}
      >
        {/* LEFT: Menu + Logo */}
        <div className="order-1 flex items-center gap-2">
          <button onClick={openMegaMenuDrawer}>
            <Menu className="inline h-6 w-6 text-white lg:hidden" />
          </button>
          {/** LOGO SECTION */}
          <Link
            href="/"
            title="Shopinger Home"
            aria-label="Shopinger Home"
            className="relative flex h-8 w-34 shrink-0 items-center justify-center lg:h-13 lg:w-57"
          >
            <Image
              src="/light-logo.png"
              alt="Shopinger"
              fill
              priority
              sizes="(max-width: 640px) 112px, (max-width: 1024px) 160px, 216px"
              className="object-contain"
            />
          </Link>
        </div>

        {/* CENTER: Location + Searchbar */}
        <div className="order-3 col-span-3 flex flex-col gap-2 lg:order-2 lg:col-span-1 lg:flex-row lg:items-center lg:gap-4">
          {/* Mobile view of LocationBlock */}
          <LocationBlock className="flex lg:hidden" />

          {/* Desktop view of LocationBlock placed to the left of SearchBar */}
          <LocationBlock className="hidden shrink-0 lg:flex" />

          <div className="flex w-full items-center gap-3">
            <SearchBar />
            {!is_bottom_navigation_showing && (
              <Link
                href="/cart-checkout"
                className="shrink-0 lg:hidden"
                aria-label={`Cart with ${cart_details?.items.length ?? 0} items. Total ₹${cart_details?.total_amount ?? 0}. Go to checkout`}
              >
                <span className="relative inline-block">
                  <Cart width={36} height={30} />

                  <span className="pointer-events-none absolute top-[35%] left-1/2 -translate-x-1/3 -translate-y-1/2 text-xs leading-none font-bold text-white">
                    {cart_details?.total_items ?? 0}
                  </span>
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="order-2 flex items-center justify-end gap-4 lg:order-3">
          <div className="hidden lg:inline">
            <AccountDropdown />
          </div>
          <Link
            href="/cart-checkout"
            className="hidden items-center gap-2 font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white lg:flex"
            aria-label={`Cart with ${cart_details?.items.length ?? 0} items. Total ₹${cart_details?.total_amount ?? 0}. Go to checkout`}
          >
            <span className="relative inline-block">
              <Cart width={36} height={30} />

              <span className="pointer-events-none absolute top-[35%] left-1/2 -translate-x-1/3 -translate-y-1/2 text-xs leading-none font-bold text-white">
                {cart_details?.total_items ?? 0}
              </span>
            </span>
            <span aria-hidden="true">₹{cart_details?.total_amount ?? 0}</span>
          </Link>
        </div>
      </div>
      <CategorySection />
      <CampaignTimer />
      {show_filter_sort_bar && (
        <FilterSortBar disable_side_filter={disable_side_filter} />
      )}
    </header>
  );
};

export default Header;
