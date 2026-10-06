import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
// types
import type { FC } from "react";

// icons
import { ChevronLeft, ChevronRight, LayoutDashboard } from "lucide-react";

// hooks
import useCategories from "@/hooks/axios/common/use-categories";
import { useMegaMenuContext } from "@/provider/mega-menu-provider";

//context
import { useCategoryContext } from "@/provider/selected-category-provider";

// helpers
import clsx from "clsx";

const CategorySection: FC = () => {
  const params = useParams<{ main_category_slug: string }>();
  const { openDrawer: openMegaMenuDrawer } = useMegaMenuContext();
  const { data: categories = [] } = useCategories(true);
  const { selected_category, setSelectedCategory } = useCategoryContext();
  const [can_scroll_left, setCanScrollLeft] = useState(false);
  const [can_scroll_right, setCanScrollRight] = useState(false);
  const nav_ref = useRef<HTMLDivElement>(null);
  const [hide_nav, setHideNav] = useState(false);
  const updateScrollState = (el: HTMLDivElement | null) => {
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const hideNavRef = useRef(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastDirection: "up" | "down" | null = null;
    let directionStartY = window.scrollY;

    const DIRECTION_THRESHOLD = 40;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 106) {
        if (hideNavRef.current) {
          hideNavRef.current = false;
          setHideNav(false);
        }
      } else {
        if (!hideNavRef.current) {
          hideNavRef.current = true;
          setHideNav(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
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

  const slug_check = (params?.main_category_slug || selected_category?.slug || "").toLowerCase();
  const is_medical_page =
    slug_check.includes("health") ||
    slug_check.includes("personal-care") ||
    slug_check.includes("medical") ||
    slug_check.includes("pharmacy") ||
    slug_check.includes("medicine");

  if (is_medical_page) {
    return null;
  }

  return (
    <>
      <div
        className={clsx(
          "bg-white px-4 transition-[padding] duration-300 ease-in-out",
          hide_nav ? "py-0" : "py-0.5",
          "mb-2",
        )}
      >
        <div className="flex items-center justify-between gap-4 text-orange-500">
          {/* Left Section: Menu + Navigation */}
          <div className="flex min-w-0 items-center gap-4">
            {/* Menu Button */}
            {/* <button
              className="hidden shrink-0 cursor-pointer items-center gap-2.5 lg:flex"
              onClick={openMegaMenuDrawer}
            >
              <Menu className="h-7 w-7" strokeWidth={2} aria-hidden={true} />
              <span className="hidden font-semibold sm:block">Menu</span>
            </button> */}
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
                className="no-scrollbar flex items-start gap-4 overflow-x-auto"
              >
                {/* All */}
                <Link
                  href="/"
                  onClick={() => setSelectedCategory(null)}
                  aria-label="All categories"
                  className={clsx(
                    "group flex w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-xl py-2",
                    "transition-[padding,gap] duration-300 ease-in-out",
                    hide_nav ? "gap-0 py-0" : "gap-1 py-1.5",
                    selected_category == null
                      ? "bg-orange-50"
                      : "hover:bg-gray-50",
                  )}
                >
                  <div
                    className={clsx(
                      "flex w-9 items-center justify-center overflow-hidden rounded-full",
                      "transition-[height] duration-300 ease-in-out",
                      hide_nav ? "h-0" : "h-9",
                      selected_category == null
                        ? "bg-orange-100"
                        : "bg-gray-100 group-hover:bg-gray-200",
                    )}
                  >
                    <LayoutDashboard
                      className="size-5 shrink-0"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>

                  <span
                    className={clsx(
                      "text-xs leading-none transition-colors",
                      selected_category == null
                        ? "font-semibold text-orange-600"
                        : "font-medium text-gray-700",
                    )}
                  >
                    All
                  </span>
                </Link>

                {/* Categories */}
                <ul className="flex items-start gap-2 whitespace-nowrap">
                    {categories.map((category, index) => {
                    const { id, name, slug } = category;
                    const is_item_grocery = slug.toLowerCase().includes("grocery") || name.toLowerCase().includes("grocery");
                    const is_item_pharmacy =
                      slug.toLowerCase().includes("pharmacy") ||
                      slug.toLowerCase().includes("medicine") ||
                      slug.toLowerCase().includes("personal-care") ||
                      name.toLowerCase().includes("pharmacy") ||
                      name.toLowerCase().includes("medicine") ||
                      name.toLowerCase().includes("personal care");

                    return (
                      <li key={`category-${id}`}>
                        <Link
                          href={`/categories/${category.slug}`}
                          className={clsx(
                            "group flex w-20 shrink-0 flex-col items-center justify-center rounded-md py-2",
                            "transition-[padding,gap] duration-300 ease-in-out",
                            hide_nav ? "gap-0 py-0" : "gap-1 py-1.5",
                          )}
                        >
                          <div
                            className={clsx(
                              "flex w-9 items-center justify-center overflow-hidden rounded-xl",
                              "transition-[height] duration-300 ease-in-out",
                              hide_nav ? "h-0" : "h-9",
                            )}
                          >
                            {category.media.icon ? (
                              <Image
                                src={category.media.icon}
                                alt={name}
                                width={48}
                                height={48}
                                className={`h-12 w-12 object-contain transition-transform duration-200 group-hover:scale-105`}
                              />
                            ) : (
                              <div
                                className={clsx(
                                  "h-12 w-12 rounded-xl",
                                  is_item_grocery
                                    ? "bg-green-50"
                                    : is_item_pharmacy
                                      ? "bg-blue-50"
                                      : "bg-orange-50",
                                )}
                              />
                            )}
                          </div>

                          <span
                            className={clsx(
                              "max-w-20 truncate text-center text-xs font-medium text-black",
                              selected_category?.id === id &&
                                "font-semibold underline underline-offset-4",
                              selected_category?.id === id &&
                                (is_item_grocery
                                  ? "text-green-600"
                                  : is_item_pharmacy
                                    ? "text-blue-600"
                                    : "text-orange-500"),
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
          {/* <div className="hidden h-10 w-0.5 bg-orange-800 lg:inline-block" /> */}
          {/* <Link
            href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_PHONE}?text=${encodeURIComponent(whatsapp_templates.emi)}`}
            target="_blank"
            className="hidden shrink-0 flex-row items-center gap-3 lg:flex"
            rel="noopener noreferrer nofollow"
            aria-label="Contact us on WhatsApp for Easy EMI options"
          >
            <CreditCard
              className="size-10 text-black"
              strokeWidth={1.2}
              aria-hidden="true"
            />
            <div>
              <span className="block text-sm font-semibold text-black uppercase">
                <span className="text-red-600">Easy EMI</span> at your Doorstep
              </span>
              <span className="block text-xs font-medium text-black">
                Get your favourite products on{" "}
                <span className="font-semibold text-red-600 uppercase">
                  No Cost EMI
                </span>
              </span>
            </div>
            <div className="h-6 w-px bg-white" />
            <button className="cursor-pointer rounded-full bg-orange-500 p-0.5">
              <ChevronRight className="size-5 text-white" />
            </button>
          </Link> */}
        </div>
      </div>
    </>
  );
};

export default CategorySection;
