import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
// types
import type { FC } from "react";
import type { ICategory } from "@/types/categories";
import type { ISubCategory } from "@/types/categories";

// icons

// icons
import { Menu, ChevronLeft, ChevronRight, CreditCard } from "lucide-react";

// hooks
import useCategories from "@/hooks/axios/common/use-categories";
import { useMegaMenuContext } from "@/provider/mega-menu-provider";

// helpers
import clsx from "clsx";

const CategorySection: FC = () => {
  const params = useParams<{ main_category_slug: string }>();
  const { openDrawer: openMegaMenuDrawer } = useMegaMenuContext();
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

  useEffect(() => {
    const selected_category = categories.find(
      (category) => category.slug == params?.main_category_slug,
    );
    selected_category && setSelectedCategory(selected_category);
  }, [params, categories]);

  return (
    <>
      <div className="bg-orange-500 px-4 py-0.5">
        <div className="flex items-center justify-between gap-4 text-white">
          {/* Left Section: Menu + Navigation */}
          <div className="flex min-w-0 items-center gap-4">
            {/* Menu Button */}
            <button
              className="hidden shrink-0 cursor-pointer items-center gap-2.5 lg:flex"
              onClick={openMegaMenuDrawer}
            >
              <Menu className="h-7 w-7" strokeWidth={2} aria-hidden={true} />
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
                  "hidden shrink-0 rounded-full p-1 lg:inline-block",
                  can_scroll_left
                    ? "opacity-100"
                    : "pointer-events-none opacity-0",
                )}
              >
                <ChevronLeft aria-hidden={true} className="size-6" />
              </button>

              {/* Navigation Items */}
              <nav
                ref={nav_ref}
                aria-label="Main product categories"
                className="no-scrollbar overflow-x-auto"
              >
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
                          // onClick={() => {
                          //   setSelectedCategory(category);
                          // }}
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
                  "hidden shrink-0 rounded-full p-1 lg:inline-block",
                  can_scroll_right
                    ? "opacity-100"
                    : "pointer-events-none opacity-0",
                )}
              >
                <ChevronRight aria-hidden={true} className="size-6" />
              </button>
            </div>
          </div>
          <div className="hidden h-10 w-0.5 bg-orange-800 lg:inline-block" />
          <Link
            href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_PHONE}`}
            target="_blank"
            className="hidden shrink-0 flex-row items-center gap-3 lg:flex"
            rel="noopener noreferrer nofollow"
            aria-label="Contact us on WhatsApp for Easy EMI options"
          >
            <CreditCard
              className="size-10 text-white"
              strokeWidth={1.2}
              aria-hidden="true"
            />
            <div>
              <span className="block text-sm font-semibold uppercase">
                <span className="text-yellow-300">Easy EMI</span> at your
                Doorstep
              </span>
              <span className="block text-xs font-medium">
                Get your favourite products on{" "}
                <span className="font-semibold text-yellow-300 uppercase">
                  No Cost EMI
                </span>
              </span>
            </div>
            <div className="h-6 w-px bg-white" />
            <button className="rounded-full bg-white p-0.5 cursor-pointer">
              <ChevronRight className="size-5 text-orange-500" />
            </button>
          </Link>
        </div>
      </div>
      {selected_category && (
        <div className="flex items-center gap-6 bg-gray-100 px-4 py-2 text-gray-900 shadow-lg">
          <span className="text-md hidden shrink-0 font-semibold text-orange-500 lg:inline-block lg:text-lg">
            {selected_category.name}
          </span>

          <nav
            ref={sub_nav_ref}
            aria-label={`${selected_category.name} subcategories`}
            className="no-scrollbar min-w-0 flex-1 overflow-x-auto"
          >
            <ul className="flex items-center gap-6 whitespace-nowrap">
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
