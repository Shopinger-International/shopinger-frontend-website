import { useLayoutEffect, useEffect, useRef } from "react";
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
import LocationTooltip from "@/components/header/location/location-tooltip.component";

// icons
import { Menu, CircleUserIcon } from "lucide-react";

// hooks
import useCart from "@/hooks/axios/cart/use-cart.hook";
import { useMegaMenuContext } from "@/provider/mega-menu-provider";
import useIsMobile from "@/hooks/common/use-is-mobile.hook";
import useIsMounted from "@/hooks/common/use-is-mounted.hook";

const Header: FC<{
  show_filter_sort_bar?: boolean;
  disable_side_filter?: boolean;
  is_bottom_navigation_showing: boolean;
}> = ({
  show_filter_sort_bar,
  disable_side_filter = false,
  is_bottom_navigation_showing,
}) => {
  const is_mounted = useIsMounted();
  const is_mobile = useIsMobile();
  const header_ref = useRef<HTMLElement>(null);
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
  useEffect(() => {
    if (!is_mobile) return;

    let prev_scroll_pos = window.scrollY;

    const handleScroll = () => {
      const current_scroll_pos = window.scrollY;

      if (!header_ref.current) return;

      // iOS rubber-band / pull-to-refresh
      // Always keep the header visible at the top.
      if (current_scroll_pos <= 0) {
        header_ref.current.style.top = "0";
        prev_scroll_pos = 0;
        return;
      }

      if (current_scroll_pos > prev_scroll_pos) {
        // Scrolling down
        header_ref.current.style.top = "-96px";
      } else if (current_scroll_pos < prev_scroll_pos) {
        // Scrolling up
        header_ref.current.style.top = "0";
      }

      prev_scroll_pos = current_scroll_pos;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [is_mobile]);
  return (
    <header
      ref={header_ref}
      className="fixed top-0 z-30 w-full transition-all duration-200 ease-in"
      id="app-header"
    >
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
          {is_mounted && (
            <LocationTooltip
              className={
                is_mobile ? "flex lg:hidden" : "hidden shrink-0 lg:flex"
              }
            />
          )}

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
