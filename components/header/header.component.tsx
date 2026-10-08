import { useLayoutEffect, useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
// types
import type { FC } from "react";

// local components
import SearchBar from "@/components/header/search-bar/search-bar.component";
import Cart from "@/components/common/icons/cart.icon";
import CategorySection from "@/components/header/category-section.component";
import AccountDropdown from "@/components/header/account-dropdown.component";
import LocationTooltip from "@/components/header/location/location-tooltip.component";
import MobileHeader from "@/components/header/mobile-header.component";
import StoreClosedBanner from "@/components/header/store-closed-banner.component";

// icons
import { Menu, CircleUserIcon } from "lucide-react";

// hooks
import useCart from "@/hooks/axios/cart/use-cart.hook";
import { useMegaMenuContext } from "@/provider/mega-menu-provider";
import useIsMobile from "@/hooks/common/use-is-mobile.hook";
import useIsMounted from "@/hooks/common/use-is-mounted.hook";

// helpers
import { cn } from "@/lib/utils";

let cached_visible_height = -1;
let cached_header_height = -1;
let cached_hide_offset = 106;
let cached_expanded_bottom = -1;

const updateGeometryCache = (header: HTMLElement) => {
  const h = header.offsetHeight;
  if (cached_header_height !== h) {
    cached_header_height = h;
    document.documentElement.style.setProperty(
      "--header-height",
      `${h}px`,
    );
  }
  const search_container = document.getElementById(
    "mobile-header-search-container",
  );
  const search_block = search_container?.parentElement;

  if (search_block && search_block.offsetHeight > 0 && search_container) {
    cached_expanded_bottom = search_block.offsetTop + search_block.offsetHeight;
    cached_hide_offset = Math.max(0, search_container.offsetTop - 8);
  } else {
    cached_expanded_bottom = h;
    cached_hide_offset = 106;
  }
};

const applyHeaderVisibleHeight = (is_shrunk: boolean) => {
  const top_offset = is_shrunk ? -cached_hide_offset : 0;
  const visible = Math.max(0, Math.round(cached_expanded_bottom + top_offset));
  if (cached_visible_height !== visible) {
    cached_visible_height = visible;
    document.documentElement.style.setProperty(
      "--header-visible-height",
      `${visible}px`,
    );
  }
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
  const router = useRouter();
  const is_product_page =
    router.pathname.includes("/p/") || router.asPath.includes("/p/");

  const is_mounted = useIsMounted();
  const is_mobile = useIsMobile();
  const header_ref = useRef<HTMLElement>(null);
  const { openDrawer: openMegaMenuDrawer } = useMegaMenuContext();
  const { data: cart_details } = useCart();

  useLayoutEffect(() => {
    const header = header_ref.current || document.getElementById("app-header");
    if (!header) return;

    const onResize = () => {
      updateGeometryCache(header);
      const is_shrunk = is_mobile ? window.scrollY >= 180 : false;
      applyHeaderVisibleHeight(is_shrunk);
    };

    onResize();

    const observer = new ResizeObserver(onResize);
    observer.observe(header);

    return () => observer.disconnect();
  }, [is_mobile]);

  useEffect(() => {
    if (!is_mobile) {
      if (header_ref.current) {
        header_ref.current.style.transform = "translate3d(0, 0px, 0)";
      }
      applyHeaderVisibleHeight(false);
      return;
    }

    let ticking = false;
    let is_shrunk_state: boolean | null = null;
    const SHRINK_THRESHOLD = 180;

    const updateHeaderScroll = () => {
      ticking = false;
      if (!header_ref.current) return;

      const current_scroll_pos = window.scrollY;
      const should_shrink = current_scroll_pos >= SHRINK_THRESHOLD;

      if (is_shrunk_state !== should_shrink) {
        is_shrunk_state = should_shrink;
        header_ref.current.style.transform = should_shrink
          ? `translate3d(0, -${cached_hide_offset}px, 0)`
          : "translate3d(0, 0px, 0)";
        applyHeaderVisibleHeight(should_shrink);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeaderScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    updateHeaderScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [is_mobile]);

  return (
    <header
      ref={header_ref}
      className={cn(
        "fixed top-0 left-0 z-30 w-full transform-gpu transition-transform duration-300 ease-in-out will-change-transform",
        is_product_page && "hidden lg:block",
      )}
      id="app-header"
    >
      <MobileHeader />

      {/* Desktop Store Closed Banner */}
      <div className="hidden lg:block">
        <StoreClosedBanner is_desktop_header />
      </div>
      <div className="hidden flex-col gap-1 bg-background-header px-4 py-1.5 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-8">
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
              src="/shopinger-logo.svg"
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
            className="hidden items-center gap-2 font-semibold text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white lg:flex"
            aria-label={`Cart with ${cart_details?.items.length ?? 0} items. Total ₹${cart_details?.total_amount ?? 0}. Go to checkout`}
          >
            <span className="relative inline-block">
              <Cart width={36} height={30} fill="black" />

              <span className="pointer-events-none absolute top-[35%] left-1/2 -translate-x-1/3 -translate-y-1/2 text-xs leading-none font-bold text-black">
                {cart_details?.total_items ?? 0}
              </span>
            </span>
            <span aria-hidden="true">₹{cart_details?.total_amount ?? 0}</span>
          </Link>
        </div>
      </div>

      <CategorySection />
    </header>
  );
};

export default Header;
