import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
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

  const is_grocery =
    router.asPath === "/categories/Grocery" ||
    router.asPath.toLowerCase().includes("grocery");

  const is_pharmacy =
    router.asPath === "/categories/Health-and-Personal-Care" ||
    router.asPath.toLowerCase().includes("pharmacy") ||
    router.asPath.toLowerCase().includes("personal-care");

  const is_mounted = useIsMounted();
  const is_mobile = useIsMobile();
  const { openDrawer: openMegaMenuDrawer } = useMegaMenuContext();
  const { data: cart_details } = useCart();

  const [is_fixed, setIsFixed] = useState(false);
  const [container_height, setContainerHeight] = useState(0);

  const top_banner_ref = useRef<HTMLDivElement>(null);
  const mobile_top_ref = useRef<HTMLDivElement>(null);
  const fixed_container_ref = useRef<HTMLDivElement>(null);

  // Measure natural height of fixed container for the spacer and CSS variables
  useEffect(() => {
    const updateHeaderDimensions = () => {
      if (fixed_container_ref.current) {
        const height = fixed_container_ref.current.offsetHeight;
        if (height > 0) {
          setContainerHeight((prev) => (!is_fixed ? height : prev || height));
          document.documentElement.style.setProperty(
            "--header-visible-height",
            `${height}px`,
          );
        }
      }
    };

    updateHeaderDimensions();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = Math.round(
          entry.borderBoxSize?.[0]?.blockSize ||
            entry.contentRect?.height ||
            fixed_container_ref.current?.offsetHeight ||
            0,
        );
        if (h > 0) {
          if (!is_fixed) {
            setContainerHeight(h);
          }
          document.documentElement.style.setProperty(
            "--header-visible-height",
            `${h}px`,
          );
        }
      }
    });

    if (fixed_container_ref.current) {
      resizeObserver.observe(fixed_container_ref.current);
    }

    window.addEventListener("resize", updateHeaderDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeaderDimensions);
    };
  }, [is_fixed]);

  useEffect(() => {
    // Keep --header-height at 0px so document layout flows naturally below header at scrollY=0
    document.documentElement.style.setProperty("--header-height", "0px");

    const updateHeaderVisibleHeight = () => {
      if (fixed_container_ref.current) {
        const h = fixed_container_ref.current.offsetHeight;
        if (h > 0) {
          document.documentElement.style.setProperty(
            "--header-visible-height",
            `${h}px`,
          );
        }
      }
    };

    updateHeaderVisibleHeight();

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const isDesktop = window.innerWidth >= 1024;
          let threshold = 0;
          if (isDesktop) {
            threshold = top_banner_ref.current?.offsetHeight || 0;
          } else {
            threshold = mobile_top_ref.current?.offsetHeight || 120;
          }
          const shouldFix =
            threshold > 0 ? window.scrollY >= threshold : window.scrollY > 0;
          setIsFixed((prev) => (prev !== shouldFix ? shouldFix : prev));
          updateHeaderVisibleHeight();
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

  const fallbackHeight = is_mobile ? 120 : 128;
  const activeSpacerHeight =
    container_height > 0 ? container_height : fallbackHeight;

  return (
    <header
      id="app-header"
      className={cn(
        "relative w-full bg-white text-gray-900 z-40",
        is_product_page && "hidden lg:block",
      )}
    >
      {/* Mobile Top Section: Store banner, delivery info & quick-commerce categories (Scrolls naturally) */}
      <MobileHeader ref={mobile_top_ref} />

      {/* Desktop Store Closed Banner (Scrolls naturally with page) */}
      <div ref={top_banner_ref} className="hidden lg:block">
        <StoreClosedBanner is_desktop_header />
      </div>

      {/* Spacer placeholder when Search Bar + CategorySection are fixed on screen */}
      {is_fixed && (
        <div
          style={{ height: `${activeSpacerHeight}px` }}
          className="w-full shrink-0 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Unified Fixed Container: Search Bar Row + CategorySection */}
      <div
        ref={fixed_container_ref}
        className={cn(
          "w-full transition-shadow duration-200",
          is_fixed
            ? "fixed top-0 left-0 z-40 w-full shadow-md bg-white"
            : "relative w-full z-40",
        )}
      >
        {/* Mobile Search Bar Row (Fixed under top:0 on mobile) */}
        <div
          className={cn(
            "w-full lg:hidden px-4 py-2 border-b border-gray-100/60 shadow-xs transition-colors",
            is_grocery
              ? "bg-green-50"
              : is_pharmacy
                ? "bg-blue-50"
                : "bg-background-header",
          )}
        >
          <div id="mobile-header-search-container" className="w-full">
            <SearchBar />
          </div>
        </div>

        {/* Desktop Main Header & Search Bar Row */}
        <div className="hidden lg:grid flex-col gap-1 bg-background-header px-4 py-2.5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-8 border-b border-gray-100/20 shadow-xs">
          {/* LEFT: Menu + Logo */}
          <div className="order-1 flex items-center gap-2">
            <button onClick={openMegaMenuDrawer} aria-label="Open menu">
              <Menu className="inline h-6 w-6 text-white lg:hidden" />
            </button>

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
              <CircleUserIcon className="size-6 text-white" aria-hidden={true} />
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

        {/* Category Navigation Bar (Fixed directly under Search Bar: All, Mobiles, Appliances, etc.) */}
        <div className="w-full bg-white border-b border-gray-100/60 shadow-xs">
          <CategorySection />
        </div>
      </div>
    </header>
  );
};

export default Header;
