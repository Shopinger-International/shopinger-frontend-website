import { useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
// types
import type { FC } from "react";
import type { ICategory } from "@/types/categories";

// local components
import Tooltip from "@/components/common/tooltip.component";
import AIAssistant from "../common/ai-chat-box.component";

// icons
import {
  Menu,
  Phone,
  Stethoscope,
  Smartphone,
  Upload,
  ChevronRight,
} from "lucide-react";

// hooks
import useCategories from "@/hooks/use-categories";

function getRandomCategories<T>(arr: T[], count = 3) {
  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy.slice(0, count);
}

const CategorySection: FC = () => {
  const { data: categories = [] } = useCategories();
  const [selected_category, setSelectedCategory] = useState<ICategory | null>();
  const nav_ref = useRef<HTMLDivElement>(null);
  const sub_nav_ref = useRef<HTMLDivElement>(null);

  const random_categories = useMemo(() => {
    return getRandomCategories<ICategory>(categories, 4);
  }, [categories]);
  return (
    <>
      <div className="bg-orange-500 px-4 py-1">
        <div className="max-w-8xl mx-auto flex items-center justify-between gap-4 text-white">
          {/* Left Section: Menu + Navigation */}
          <div className="flex min-w-0 items-center gap-4">
            {/* Menu Button */}
            <button className="hidden shrink-0 items-center gap-2.5 lg:flex">
              <Menu className="h-7 w-7" strokeWidth={2} />
              <span className="hidden font-semibold sm:block">Menu</span>
            </button>

            {/* Navigation Items */}
            <nav
              ref={nav_ref}
              className={
                "no-scrollbar flex min-w-0 items-center gap-6 overflow-x-auto whitespace-nowrap"
              }
            >
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
              ].map(({ href, label, icon: Icon }) => {
                if (label == "Quick Order") {
                  return (
                    <Tooltip
                      key={label}
                      className="z-50 rounded-xl bg-white py-1 font-semibold"
                      content={
                        <div className="space-y-1 px-3 py-1.5">
                          <p className="tracking-wide text-orange-500">
                            Call us now to order
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-lime-400">
                              <Phone className="size-4 fill-gray-900" />
                            </span>
                            <span className="text-[15px]">+91 94157 61434</span>
                          </div>
                        </div>
                      }
                    >
                      <Link
                        key={label}
                        href={href}
                        className="group flex items-center gap-2 rounded-md py-1.5 transition-colors"
                      >
                        {Icon && (
                          <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-white">
                            <Icon
                              className="size-4 text-orange-500"
                              strokeWidth={2.5}
                            />
                          </div>
                        )}
                        <span className="text-sm font-medium text-white group-hover:underline">
                          {label}
                        </span>
                      </Link>
                    </Tooltip>
                  );
                }

                return (
                  <Link
                    key={label}
                    href={href}
                    className="group flex items-center gap-2 rounded-md py-1.5 transition-colors"
                  >
                    {Icon && (
                      <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-white">
                        <Icon
                          className="size-4 text-orange-500"
                          strokeWidth={2.5}
                        />
                      </div>
                    )}
                    <span className="text-sm font-medium text-white group-hover:underline">
                      {label}
                    </span>
                  </Link>
                );
              })}
              {random_categories.map((category) => {
                const { id, name } = category;
                return (
                  <button
                    key={`category-${id}`}
                    className="group flex items-center gap-2 rounded-md py-1.5 transition-colors"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <span className="text-sm font-medium text-white group-hover:underline">
                      {name}
                    </span>
                  </button>
                );
              })}
            </nav>
            <button
              onClick={() => {
                nav_ref.current?.scrollBy({
                  left: 200,
                  behavior: "smooth",
                });
              }}
              className="shrink-0 rounded-full bg-white/20 p-1.5 text-white hover:bg-white/30 lg:hidden"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Right Section: Sale Timer + Get App + Profile */}
          <div className="hidden shrink-0 items-center gap-2 md:gap-4 lg:flex">
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
            <div className="hidden lg:inline">
              <Tooltip content={<AIAssistant />}>
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
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      {selected_category && (
        <div className="max-w-8xl mx-auto flex items-center gap-6 bg-white px-4 py-2 text-gray-900 shadow-lg">
          {/* Fixed label */}
          <span className="shrink-0 text-lg font-semibold text-orange-500">
            {selected_category.name}
          </span>

          {/* Scrollable content */}
          <nav
            ref={sub_nav_ref}
            className="no-scrollbar flex min-w-0 flex-1 items-center gap-6 overflow-x-auto whitespace-nowrap"
          >
            {selected_category?.subCategories.map(({ id, name }) => (
              <span
                key={`sub-category-${id}`}
                className="group flex shrink-0 items-center gap-2 rounded-md py-1.5 transition-colors"
              >
                <span className="text-sm font-medium group-hover:underline">
                  {name}
                </span>
              </span>
            ))}
          </nav>
          {/* Right arrow */}
          <button
            onClick={() =>
              sub_nav_ref.current?.scrollBy({
                left: 200,
                behavior: "smooth",
              })
            }
            className="shrink-0 rounded-full p-1 hover:bg-gray-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default CategorySection;
