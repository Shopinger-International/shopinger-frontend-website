import { useLayoutEffect, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
// types
import type { FC } from "react";

// local components
import SearchBar from "@/components/header/search-bar/search-bar.component";
import Cart from "@/components/common/icons/cart.icon";
import CategorySection from "@/components/header/category-section.component";
import Tooltip from "@/components/common/tooltip.component";
import AccountDropdown from "@/components/header/account-dropdown.component";
import FilterSortBar from "@/components/categories/filter-sort-bar.component";
import CampaignTimer from "@/components/header/campaign-timer.component";

// icons
import {
  EllipsisVertical,
  Menu,
  CircleQuestionMark,
  Megaphone,
  MapPin,
  ChevronRight,
} from "lucide-react";

// helpers
import { clsx } from "clsx";

// hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useCart from "@/hooks/axios/cart/use-cart.hook";

// context
import { AddressDrawerState } from "@/context";

const LocationBlock: FC<{
  className: string;
}> = ({ className }) => {
  const { address_id, is_modal_open, updateState } =
    useContext(AddressDrawerState);
  const { data: user_details } = useUserDetails();
  const user_address = user_details?.user_addresses?.find(
    (address) => address.id == address_id,
  );
  return (
    <button
      onClick={() => {
        window.history.pushState({ drawer: true }, "");
        updateState?.({
          address_id,
          is_modal_open,
          open: true,
        });
      }}
      className={clsx("items-center gap-2 text-white", className)}
      aria-label={
        user_address
          ? `Update delivery location. Current location: ${user_address.state} ${user_address.pincode}`
          : "Add delivery location"
      }
    >
      <MapPin className="size-4 shrink-0 lg:mt-1 lg:size-6" aria-hidden />

      <div className="flex min-w-0 items-center gap-2 lg:flex-col lg:items-start lg:gap-0">
        {user_address ? (
          <>
            <span className="w-fit truncate text-xs">
              Delivering to {user_address.state} {user_address.pincode}
            </span>
            <span className="hidden text-sm font-semibold lg:block">
              Update Location
            </span>
          </>
        ) : (
          <>
            {/* Mobile */}
            <span className="text-sm lg:hidden">Choose delivery location</span>

            {/* Desktop */}
            <>
              <span className="hidden text-xs lg:block">
                No delivery address selected
              </span>
              <span className="hidden text-sm font-semibold lg:block">
                Add your location
              </span>
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
          "lg:grid-cols-[auto_minmax(0,1fr)_auto_auto]",
          "lg:gap-4",
        )}
      >
        {/* LEFT: Menu + Logo */}
        <div className="order-1 flex items-center gap-2">
          <Menu className="inline h-6 w-6 text-white lg:hidden" />
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
        {/* CENTER: Searchbar */}
        <div className="order-3 col-span-3 flex flex-col gap-2 lg:order-2 lg:col-span-1">
          <LocationBlock className="flex lg:hidden" />
          <div className="flex items-center gap-3">
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
        <div className="order-2 -mr-3 flex items-center justify-end gap-4 lg:order-3 lg:-mr-8">
          <LocationBlock className="hidden lg:flex" />
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

          <Tooltip
            placement="bottom"
            className="z-100"
            content={({ handleClose }) => (
              <div className="z-50 w-max rounded-xl border border-neutral-300 bg-white py-2 shadow-sm">
                {[
                  {
                    label: "Support",
                    href: "/support",
                    icon: CircleQuestionMark,
                  },
                  {
                    label: "Advertise",
                    href: "/advertise",
                    icon: Megaphone,
                  },
                ].map(({ label, href, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-3 text-sm",
                      "transition hover:font-semibold hover:text-orange-500",
                    )}
                  >
                    <Icon className="size-5" strokeWidth={1.5} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            )}
          >
            {({ open }) => (
              <button aria-label="More options">
                <EllipsisVertical className="size-6 text-white" />
              </button>
            )}
          </Tooltip>
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
