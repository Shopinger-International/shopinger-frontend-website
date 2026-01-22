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
  CircleUserIcon,
  Package,
  Heart,
  Gift,
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
    <div className="fixed top-0 z-30 w-full bg-black">
      {/** HEADER */}
      <header className="w-full">
        <div className="max-w-8xl mx-auto flex w-full items-center justify-between gap-10 py-2.5">
          {/** LOGO SECTION */}
          <div className="items-center justify-center lg:h-14 xl:flex">
            <Link
              href="/"
              aria-label="Shopinger Home"
              className="relative flex shrink-0 items-center justify-center md:h-13 md:w-57"
            >
              <Image
                src="/logo.png"
                alt="Shopinger – Online Shopping Platform"
                fill
                priority
                sizes="(min-width: 1280px) 216px, 160px"
                className="object-contain"
              />
            </Link>
          </div>
          <Searchbar />
          <button className="flex items-center gap-1.5 text-white">
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
            className="rounded-full border-2 border-white bg-orange-500 px-6 py-1.5 text-[15px] font-medium text-white"
          >
            Seller
          </Link>
          <Tooltip
            offset_distance={6}
            className="z-50 w-58 rounded-xl border border-neutral-300 bg-white shadow-lg"
            content={
              <div>
                {/* Auth section */}
                <div className="flex flex-col gap-3 px-4 py-4">
                  <Link
                    href="/login"
                    className="rounded-lg bg-orange-500 py-2 text-center font-semibold text-white transition hover:bg-orange-600"
                  >
                    Login
                  </Link>

                  <p className="text-sm">
                    New here?{" "}
                    <Link
                      href="/sign-up"
                      className="font-semibold text-orange-500 hover:underline"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>

                {/* Menu section */}
                <div className="border-t border-neutral-300">
                  {[
                    {
                      label: "My Profile",
                      href: "/profile",
                      icon: CircleUserIcon,
                    },
                    {
                      label: "Orders",
                      href: "/orders",
                      icon: Package,
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
                        "transition hover:bg-orange-50",
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
                "transition hover:bg-white/10 focus:outline-none group",
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

          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-white"
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
      </header>
      <CategorySection />
    </div>
  );
};

export default Header;
