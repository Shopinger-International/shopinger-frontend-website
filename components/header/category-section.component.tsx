import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
// types
import type { FC } from "react";
import type { ICategory } from "@/types/categories";
import type { ISubCategory } from "@/types/categories";

// icons

// icons
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";

// hooks
import useCategories from "@/hooks/axios/common/use-categories";

// helpers
import clsx from "clsx";

const CategorySection: FC = () => {
  const router = useRouter();
  const { data: categories = [] } = useCategories(true);
  const [selected_category, setSelectedCategory] = useState<ICategory | null>();
  const [selected_sub_category, setSelectedSubCategory] =
    useState<ISubCategory | null>();
  const [can_scroll_left, setCanScrollLeft] = useState(false);
  const [can_scroll_right, setCanScrollRight] = useState(false);
  const nav_ref = useRef<HTMLDivElement>(null);
  const sub_nav_ref = useRef<HTMLDivElement>(null);

  const updateScrollState = (el: HTMLDivElement | null) => {
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    const el = nav_ref.current;
    if (!el) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollState(el);
          ticking = false;
        });
        ticking = true;
      }
    };

    updateScrollState(el);
    el.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [categories]);

  return (
    <>
      <div className="bg-orange-500 px-4 py-0.5">
        <div className="flex items-center justify-between gap-4 text-white">
          {/* Left Section: Menu + Navigation */}
          <div className="flex min-w-0 items-center gap-4">
            {/* Menu Button */}
            <button className="hidden shrink-0 items-center gap-2.5 lg:flex">
              <Menu className="h-7 w-7" strokeWidth={2} />
              <span className="hidden font-semibold sm:block">Menu</span>
            </button>
            <div className="flex min-w-0 items-center">
              {/* Left Arrow */}
              <button
                onClick={() =>
                  nav_ref.current?.scrollBy({ left: -200, behavior: "smooth" })
                }
                aria-label="Scroll categories left"
                className={clsx(
                  "shrink-0 rounded-full bg-white/20 p-1.5 transition-opacity",
                  can_scroll_left
                    ? "opacity-100"
                    : "pointer-events-none hidden",
                )}
              >
                <ChevronLeft aria-hidden={true} className="h-5 w-5" />
              </button>

              {/* Navigation Items */}
              <nav
                ref={nav_ref}
                aria-label="Main product categories"
                className="no-scrollbar overflow-x-auto"
              >
                {/* Grocery */}
                {/* {[
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
                        placement="bottom"
                        key={label}
                        className="z-50 rounded-xl border border-gray-300 bg-white py-1 font-semibold shadow-lg"
                        content={() => (
                          <div className="space-y-1 px-3 py-1.5">
                            <p className="tracking-wide text-orange-500">
                              Call us now to order
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-lime-400">
                                <Phone className="size-4 fill-gray-900" />
                              </span>
                              <span className="text-[15px]">
                                +91 94157 61434
                              </span>
                            </div>
                          </div>
                        )}
                      >
                        {({ open }) => (
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
                        )}
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
                })} */}
                <ul
                  className={
                    "flex min-w-0 items-center gap-6 whitespace-nowrap"
                  }
                >
                  {categories.map((category) => {
                    const { id, name } = category;
                    return (
                      <li key={`category-${id}`}>
                        <Link
                          href={`/categories/${category.slug}`}
                          className="group flex items-center gap-2 rounded-md py-1.5 transition-colors"
                          onClick={() => {
                            setSelectedCategory(category);
                          }}
                        >
                          <span
                            className={clsx(
                              "text-sm font-medium text-white group-hover:underline",
                              selected_category?.id == id &&
                                "font-semibold underline",
                            )}
                          >
                            {name}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              {/* Right Arrow */}
              <button
                onClick={() =>
                  nav_ref.current?.scrollBy({ left: 200, behavior: "smooth" })
                }
                aria-label="Scroll categories right"
                className={clsx(
                  "shrink-0 rounded-full bg-white/20 p-1.5 transition-opacity",
                  can_scroll_right
                    ? "opacity-100"
                    : "pointer-events-none opacity-0",
                )}
              >
                <ChevronRight aria-hidden={true} className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right Section: Sale Timer + Get App + Profile */}
          <div className="hidden shrink-0 items-center gap-2 md:gap-4 lg:flex">
            {/* Festive Sale Timer */} {/* Get App Button */}
            {/* <button className="hidden items-center gap-2 rounded-md px-2 py-2 transition-colors hover:bg-white/10 sm:flex md:px-3">
              <Smartphone
                className="text-brand-orange h-6 w-6"
                strokeWidth={2.5}
              />
              <span className="text-sm font-medium text-stone-50">Get App</span>
            </button> */}
            {/* Profile/Notification */}
            {/* <div className="hidden lg:inline">
              <Tooltip content={<AIAssistant />} className="z-100">
                {({ open }) => (
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
                )}
              </Tooltip>
            </div> */}
          </div>
        </div>
      </div>
      {selected_category && (
        <div className="flex items-center gap-6 bg-gray-100 px-4 py-2 text-gray-900 shadow-lg">
          <span className="text-md shrink-0 font-semibold text-orange-500 lg:text-lg">
            {selected_category.name}
          </span>

          <nav
            ref={sub_nav_ref}
            aria-label={`${selected_category.name} subcategories`}
          >
            <ul className="no-scrollbar flex min-w-0 flex-1 items-center gap-6 overflow-x-auto whitespace-nowrap">
              {selected_category.subCategories.map((sub_category) => {
                const { id, name, slug: sub_slug } = sub_category;
                return (
                  <li key={`sub-category-${id}`}>
                    <Link
                      className={clsx(
                        "group flex shrink-0 items-center gap-2 rounded-md py-1.5 font-medium hover:underline",
                        selected_sub_category?.id == id &&
                          "font-semibold underline",
                      )}
                      replace={true}
                      href={`/categories/${selected_category.slug}/${sub_slug}`}
                      onClick={() => setSelectedSubCategory(sub_category)}
                    >
                      <span className="text-sm">{name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            onClick={() =>
              sub_nav_ref.current?.scrollBy({ left: 200, behavior: "smooth" })
            }
            aria-label="Scroll categories right"
            className="shrink-0 rounded-full p-1 hover:bg-gray-100"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default CategorySection;
