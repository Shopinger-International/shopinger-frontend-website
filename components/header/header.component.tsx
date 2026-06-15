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

// icons
import {
  EllipsisVertical,
  Menu,
  Bell,
  CircleQuestionMark,
  Megaphone,
  MapPin,
} from "lucide-react";

// helpers
import { clsx } from "clsx";

// data

// hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useCart from "@/hooks/axios/cart/use-cart.hook";

// context
import { AddressDrawerState } from "@/context";

const Header: FC<{
  show_filter_sort_bar?: boolean;
  disable_side_filter?: boolean;
}> = ({ show_filter_sort_bar, disable_side_filter = false }) => {
  const { address_id, is_modal_open, updateState } =
    useContext(AddressDrawerState);
  const { data: user_details } = useUserDetails();
  const user_address = user_details?.user_addresses?.find(
    (address) => address.id == address_id,
  );
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
    <header className="fixed top-0 z-30 w-full bg-black" id="app-header">
      <div
        className={clsx(
          "mx-auto grid w-full items-center",
          "grid-cols-[auto_1fr_auto]",
          "gap-3 px-4 py-1.5",
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
            aria-label="Shopinger Home"
            className="relative flex h-8 w-34 shrink-0 items-center justify-center lg:h-13 lg:w-57"
          >
            <Image
              src="/light-logo.png"
              alt="Shopinger – Online Shopping Platform"
              fill
              priority
              sizes="(max-width: 640px) 112px, (max-width: 1024px) 160px, 216px"
              className="object-contain"
            />
          </Link>
        </div>
        {/* CENTER: Searchbar */}
        <div className="order-3 col-span-3 lg:order-2 lg:col-span-1">
          <SearchBar />
        </div>
        {/* RIGHT: Actions */}
        <div className="order-2 -mr-3 flex items-center justify-end gap-4 lg:order-3 lg:-mr-8">
          <button
            onClick={() =>
              updateState?.({
                address_id,
                is_modal_open,
                open: true,
              })
            }
            className="hidden cursor-pointer rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white lg:inline-block"
            aria-label={
              user_address
                ? `Update delivery location. Current location: ${user_address.state} ${user_address.pincode}`
                : "Add delivery location"
            }
          >
            <div className="flex gap-2">
              <MapPin className="mt-1 size-6 text-white" aria-hidden={true} />
              <div className="flex flex-col items-start text-white">
                {user_address ? (
                  <>
                    <span className="text-xs">
                      Delivering to {user_address.state} {user_address.pincode}
                    </span>
                    <span className="text-sm font-semibold">
                      Update Location
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-xs">
                      No delivery address selected
                    </span>
                    <span className="text-sm font-semibold">
                      Add your location
                    </span>
                  </>
                )}
              </div>
            </div>
          </button>
          {/* <button className="hidden items-center gap-1.5 text-white lg:flex">
            <span className="text-xl">
              {countries.find(({ name }) => name == "India")?.flag}
            </span>
            <span className="font-semibold underline">EN</span>
            <span>
              <Triangle
                className={clsx(
                  "size-2.5 fill-white transition-transform",
                  false ? "rotate-0" : "rotate-180",
                )}
              />
            </span>
          </button> */}
          <div className="hidden lg:inline">
            <AccountDropdown />
          </div>
          <Link
            href="/cart-checkout"
            className="hidden items-center gap-2 font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white lg:flex"
            aria-label={`Cart with ${cart_details?.items.length ?? 0} items. Total ₹${cart_details?.total_amount ?? 0}. Go to checkout`}
          >
            <span className="relative">
              <span
                className="absolute left-1/2 -translate-x-1/3 -translate-y-1/3 font-bold"
                aria-hidden="true"
              >
                {cart_details?.total_items ?? 0}
              </span>

              <Cart width={30} height={23} aria-hidden="true" />
            </span>

            <span aria-hidden="true">₹{cart_details?.total_amount ?? 0}</span>
          </Link>
          {/* <div className="hidden lg:inline">
            <Tooltip
              content={() => <AIAssistant />}
              className="z-100"
              placement="bottom"
            >
              {({ open }) => (
                <div className="flex flex-col items-center gap-1">
                  <div className="relative h-5 w-5">
                    <Sparkles className="absolute top-0 left-0 animate-pulse text-yellow-300" />
                  </div>

                  <span className="hidden text-xs font-medium text-white capitalize sm:block">
                    Barsati
                  </span>
                </div>
              )}
            </Tooltip>
          </div> */}
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
                  {
                    label: "Notification Setting",
                    href: "notification-setting",
                    icon: Bell,
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
              <button>
                <EllipsisVertical className="size-6 text-white" />
              </button>
            )}
          </Tooltip>
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
