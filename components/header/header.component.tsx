import { useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
// types
import type { FC } from "react";

// local components
import Searchbar from "@/components/header/searchbar.component";
import Cart from "@/components/common/icons/cart.icon";
import CategorySection from "@/components/header/category-section.component";
import Tooltip from "@/components/common/tooltip.component";
import AIAssistant from "../common/ai-chat-box.component";

// icons
import {
  CircleUserRound,
  Triangle,
  EllipsisVertical,
  User,
  Handbag,
  Heart,
  Gift,
  Menu,
  Bell,
  CircleQuestionMark,
  Megaphone,
  MapPin,
  Sparkles,
} from "lucide-react";

// helpers
import { clsx } from "clsx";

// data
import { countries } from "@/data/countries.data";

// hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useCart from "@/hooks/axios/cart/use-cart.hook";

interface HeaderProps {
  // Add your props here
}

const Header: FC<HeaderProps> = () => {
  const { data: user } = useUserDetails();
  const user_address = user?.user_addresses.find(
    (address) => address.is_default,
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
          "lg:gap-8",
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
          <Searchbar />
        </div>
        {/* RIGHT: Actions */}
        <div className="order-2 -mr-3 flex items-center justify-end gap-6 lg:order-3 lg:-mr-8">
          {/* <Link
            href="/"
            className="hidden rounded-full border-2 border-white bg-orange-500 px-6 py-1.5 text-[15px] font-medium text-white lg:inline"
          >
            Seller
          </Link> */}
          <button
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
          <button className="hidden items-center gap-1.5 text-white lg:flex">
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
          </button>
          <div className="hidden lg:inline">
            {user ? (
              <button
                className={clsx(
                  "flex items-center gap-2 rounded-full px-3 py-2 font-semibold text-white",
                  "transition hover:bg-white/10 focus:outline-none",
                )}
              >
                <CircleUserRound className="size-6" />
                <span className="max-w-28 truncate">{user.name}</span>
              </button>
            ) : (
              <Tooltip
                placement="bottom"
                offset_distance={6}
                className="z-50 w-48 rounded-xl border border-neutral-300 bg-white shadow-lg"
                content={
                  <div>
                    {/* Auth section */}
                    <div className="flex flex-col gap-3 px-3 py-3">
                      <Link
                        href="/login"
                        className="rounded-lg bg-orange-500 py-2 text-center font-semibold text-white transition hover:bg-orange-600"
                      >
                        Login
                      </Link>

                      <p className="text-sm">
                        New User?{" "}
                        <Link
                          href="/sign-up"
                          className="font-semibold text-orange-500 hover:underline"
                        >
                          Sign Up
                        </Link>
                      </p>
                    </div>

                    {/* Menu section */}
                    <div className="border-t border-gray-300">
                      {[
                        {
                          label: "My Profile",
                          href: "/profile",
                          icon: User,
                        },
                        {
                          label: "Orders",
                          href: "/orders",
                          icon: Handbag,
                        },
                        {
                          label: "Wishlist",
                          href: "/wishlist",
                          icon: Heart,
                        },
                        {
                          label: "Rewards",
                          href: "/rewards",
                          icon: Gift,
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
                          <Icon className="size-5" />
                          <span>{label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                }
              >
                {({ open }) => (
                  <button
                    className={clsx(
                      "flex items-center gap-2 rounded-full px-3 py-2 text-white",
                      "transition hover:bg-white/10 focus:outline-none",
                    )}
                  >
                    <CircleUserRound className="size-6" strokeWidth={1.5} />
                    <span className="font-semibold">Login</span>
                    <Triangle
                      className={clsx(
                        "size-2.5 fill-white transition-transform",
                        open ? "rotate-0" : "rotate-180",
                      )}
                    />
                  </button>
                )}
              </Tooltip>
            )}
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
                {cart_details?.items.length ?? 0}
              </span>

              <Cart width={30} height={23} aria-hidden="true" />
            </span>

            <span aria-hidden="true">₹{cart_details?.total_amount}</span>
          </Link>
          <div className="hidden lg:inline">
            <Tooltip
              content={<AIAssistant />}
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
          </div>
          <Tooltip
            placement="bottom"
            className="z-100"
            content={
              <div className="z-50 w-max rounded-xl border border-neutral-300 bg-white py-2 shadow-lg">
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
            }
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
    </header>
  );
};

export default Header;
