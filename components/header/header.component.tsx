import { useLayoutEffect, useEffect, useRef, useState } from "react";
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

// icons
import { Menu, ChevronRight } from "lucide-react";

// helpers
import { clsx } from "clsx";

// hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useCart from "@/hooks/axios/cart/use-cart.hook";
import { useMegaMenuContext } from "@/provider/mega-menu-provider";
import { useAddressDrawerContext } from "@/provider/selected-address-provider.component";
import useIsMobile from "@/hooks/common/use-is-mobile.hook";

// icons
import { CircleUserIcon, MapPin } from "lucide-react";

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
            <div className="flex w-full max-w-xs items-center gap-1 text-left text-xs">
              <MapPin
                aria-hidden={true}
                className="size-3 shrink-0 text-white"
              />
              <span className="block truncate lg:hidden">
                {user_address.house_number
                  ? `${user_address.house_number}, `
                  : ""}
                {user_address.area}
              </span>

              <span className="hidden truncate lg:inline-block lg:max-w-44">
                {user_address.house_number
                  ? `${user_address.house_number}, `
                  : ""}
                {user_address.area}
              </span>
            </div>
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
  show_login_tooltip?: boolean;
  on_login_click?: () => void;
}> = ({
  show_filter_sort_bar,
  disable_side_filter = false,
  is_bottom_navigation_showing,
  show_login_tooltip = false,
  on_login_click,
}) => {
  const is_mobile = useIsMobile();
  const header_ref = useRef<HTMLElement>(null);
  const { openDrawer: openMegaMenuDrawer } = useMegaMenuContext();
  const { data: cart_details } = useCart();
  const [is_login_tooltip_visible, set_is_login_tooltip_visible] =
    useState(false);
  useEffect(() => {
    set_is_login_tooltip_visible(false);

    if (!show_login_tooltip || is_mobile) return;

    set_is_login_tooltip_visible(true);

    const timeout_id = window.setTimeout(() => {
      set_is_login_tooltip_visible(false);
    }, 11000);

    return () => window.clearTimeout(timeout_id);
  }, [show_login_tooltip, is_mobile]);

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

  useEffect(() => {
    let prev_scroll_pos = window.pageYOffset;
    function handleScroll() {
      const current_scroll_pos = window.pageYOffset;
      if (header_ref.current) {
        if (current_scroll_pos > prev_scroll_pos) {
          header_ref.current.style.top = "-64px";
        } else {
          header_ref.current.style.top = "0";
        }
      }
      prev_scroll_pos = current_scroll_pos;
    }
    if (is_mobile) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [is_mobile]);

  return (
    <header
      ref={header_ref}
      className="fixed top-0 z-30 w-full transition-all duration-200 ease-in"
      id="app-header"
    >
      {!is_mobile && is_login_tooltip_visible && (
        <div className="login-tooltip-jerk absolute top-14 right-[108px] z-50 w-24 rounded-lg bg-white p-2 shadow-lg">
          <button
            onClick={on_login_click}
            className="h-10 w-full rounded-lg bg-orange-500 text-sm font-semibold text-white"
          >
            Login
          </button>
        </div>
      )}
      <style jsx>{`
        .login-tooltip-jerk {
          position: absolute;
        }

        .login-tooltip-jerk::before {
          content: "";
          position: absolute;
          top: -8px;
          right: 24px;
          border-right: 8px solid transparent;
          border-bottom: 8px solid white;
          border-left: 8px solid transparent;
        }

        @keyframes login-tooltip-jerk {
          0%,
          100% {
            transform: translateY(0);
          }

          25% {
            transform: translateY(-4px);
          }

          50% {
            transform: translateY(3px);
          }

          75% {
            transform: translateY(-2px);
          }
        }

        .login-tooltip-jerk {
          animation: login-tooltip-jerk 1.2s ease-in-out infinite;
        }
      `}</style>
      <div className="flex flex-col gap-1 bg-black px-4 py-1.5 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-8">
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
            className="relative flex h-8 w-34 shrink-0 items-center justify-center lg:h-11 lg:w-48"
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
          <Link
            href="/account"
            aria-label="Account"
            className="ml-auto lg:hidden"
          >
            <CircleUserIcon aria-hidden={true} className="size-6 text-white" />
          </Link>
        </div>

        
        {/* CENTER: Location + Searchbar */}
        <div className="order-3 col-span-3 flex flex-col gap-2 lg:order-2 lg:col-span-1 lg:flex-row lg:items-center lg:gap-8">
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
        <div className="order-2 flex items-center justify-end gap-8 lg:order-3">
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
      {show_filter_sort_bar && (
        <FilterSortBar disable_side_filter={disable_side_filter} />
      )}
    </header>
  );
};

export default Header;
