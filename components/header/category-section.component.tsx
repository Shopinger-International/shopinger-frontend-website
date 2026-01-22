import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  ShoppingBag,
  Phone,
  Stethoscope,
  Smartphone,
  Shirt,
  Laptop,
  Home,
  Bell,
  Upload,
} from "lucide-react";

export default function CategorySection() {
  return (
    <header className="bg-orange-500 px-3 py-1 sm:px-5">
      <div className="max-w-8xl mx-auto flex items-center justify-between gap-4 text-white">
        {/* Left Section: Menu + Navigation */}
        <div className="flex items-center gap-4">
          {/* Menu Button */}
          <button className="flex shrink-0 items-center gap-2.5">
            <Menu className="h-7 w-7" strokeWidth={2} />
            <span className="hidden font-semibold sm:block">Menu</span>
          </button>

          {/* Navigation Items */}
          <nav className="hidden items-center gap-6 lg:flex">
            {/* Grocery */}
            {[
              {
                href: "/grocery",
                label: "Grocery",
                icon: Upload,
              },
              {
                href: "/quick-order",
                label: "Quick Order",
                icon: Phone,
              },
              {
                href: "/medical",
                label: "Medical",
                icon: Stethoscope,
              },
              {
                href: "/mobiles",
                label: "Mobiles",
              },
              {
                href: "/fashion",
                label: "Fashion",
              },
              {
                href: "/electronics",
                label: "Electronics",
              },
              {
                href: "/home-kitchen",
                label: "Home & Kitchen",
              },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-2 rounded-md py-1.5 transition-colors group"
              >
                {Icon && (
                  <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-white">
                    <Icon
                      className="size-4 text-orange-500"
                      strokeWidth={2.5}
                    />
                  </div>
                )}
                <span className="text-sm font-medium text-white group-hover:underline">{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Section: Sale Timer + Get App + Profile */}
        <div className="flex shrink-0 items-center gap-2 md:gap-4">
          {/* Festive Sale Timer */}
          <div className="hidden items-center gap-2 md:flex">
            <span className="text-lg font-semibold text-stone-50 capitalize md:text-xl">
              festive sale Live
            </span>
            <span className="text-lg font-semibold text-[#FFC800] md:text-xl">
              00:15:26
            </span>
          </div>

          {/* Get App Button */}
          <button className="hidden items-center gap-2 rounded-md px-2 py-2 transition-colors hover:bg-white/10 sm:flex md:px-3">
            <Smartphone
              className="text-brand-orange h-6 w-6"
              strokeWidth={2.5}
            />
            <span className="text-sm font-medium text-stone-50">Get App</span>
          </button>

          {/* Profile/Notification */}
          <div className="w flex flex-col items-center gap-0.5">
            <span className="flex size-8 items-center justify-center rounded-full bg-white">
              <Image
                src="/header/barsati.png"
                alt="barsati"
                width={17}
                height={20}
              />
            </span>
            <span className="hidden text-[10px] font-medium text-white capitalize sm:block">
              Barsati
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
