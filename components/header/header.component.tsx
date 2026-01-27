import Link from "next/link";
import Image from "next/image";
// types
import type { FC } from "react";

// local components
import Searchbar from "@/components/header/searchbar.component";
import Cart from "@/components/common/icons/cart.icon";
import CategorySection from "@/components/header/category-section.component";
import Tooltip from "@/components/common/tooltip.component";

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
} from "lucide-react";

// helpers
import { clsx } from "clsx";

// data
import { countries } from "@/data/countries.data";

interface HeaderProps {
  // Add your props here
}

const Header: FC<HeaderProps> = () => {
  return (
    <header className="fixed top-0 z-30 w-full bg-black">
      <div
        className={clsx(
          "mx-auto grid w-full",
          "grid-cols-[auto_1fr_auto]",
          "gap-3 px-4 py-3",
          "lg:max-w-8xl",
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
              src="/logo.png"
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
        <div className="order-2 -mr-3 flex items-center justify-end gap-10 lg:order-3 lg:-mr-8">
          <button className="hidden items-center gap-1.5 text-white lg:flex">
            <span className="text-xl">
              {countries.find(({ name }) => name == "India")?.flag}
            </span>
            <span className="font-semibold underline">EN</span>
            <span>
              <Triangle
                className={clsx(
                  "size-3 fill-white transition-transform",
                  false ? "rotate-0" : "rotate-180",
                )}
              />
            </span>
          </button>
          <Link
            href="/"
            className="hidden rounded-full border-2 border-white bg-orange-500 px-6 py-1.5 text-[15px] font-medium text-white lg:inline"
          >
            Seller
          </Link>
          <div className="hidden lg:inline">
            <Tooltip
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
                        <Icon className="size-5" strokeWidth={1.5} />
                        <span>{label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              }
            >
              <button
                className={clsx(
                  "flex items-center gap-2 rounded-full px-3 py-2 text-white",
                  "group transition hover:bg-white/10 focus:outline-none",
                )}
              >
                <CircleUserRound className="size-6" strokeWidth={1.5} />
                <span className="font-semibold">Login</span>
                <Triangle
                  className={clsx(
                    "size-3 fill-white transition-transform",
                    "rotate-0 group-hover:rotate-180",
                  )}
                />
              </button>
            </Tooltip>
          </div>
          <Link
            href="/"
            className="hidden items-center gap-2 font-semibold text-white lg:flex"
          >
            <span className="relative">
              <span className="absolute left-1/2 -translate-x-1/3 -translate-y-1/3 font-bold">
                2
              </span>
              <Cart width={30} height={23} />
            </span>
            <span>Cart</span>
          </Link>
          <button>
            <EllipsisVertical className="size-6 text-white" />
          </button>
        </div>
      </div>
      <CategorySection />
    </header>
  );
};

export default Header;
