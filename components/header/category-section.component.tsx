import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
// types
import type { FC } from "react";
import type { ICategory } from "@/hooks/axios/common/use-categories";

// icons
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
} from "lucide-react";

// hooks
import useCategories from "@/hooks/axios/common/use-categories";
import { useMegaMenuContext } from "@/provider/mega-menu-provider";

// helpers
import clsx from "clsx";

// data
import { whatsapp_templates } from "@/data/whatsapp-templates.data";
import Image from "next/image";
import { useCategoryContext } from "@/provider/selected-category-provider";

const CategorySection: FC = () => {
  const params = useParams<{ main_category_slug: string }>();
  const { openDrawer: openMegaMenuDrawer } = useMegaMenuContext();
  const { data: categories = [] } = useCategories(true);
  const {
    selected_category,
    setSelectedCategory,
    selected_sub_category,
    setSelectedSubCategory,
  } = useCategoryContext();
  const [can_scroll_left, setCanScrollLeft] = useState(false);
  const [can_scroll_right, setCanScrollRight] = useState(false);
  const nav_ref = useRef<HTMLDivElement>(null);
  const sub_nav_ref = useRef<HTMLDivElement>(null);

  const [hide_nav, setHideNav] = useState(false);
  const updateScrollState = (el: HTMLDivElement | null) => {
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const category_imgages = [
    "https://cdn.shopinger.co.in/uploads/categories/1788739137352-5ba4175f-7c0f-437d-b102-343600efee70.png",
    "https://cdn.shopinger.co.in/uploads/categories/1788738850114-022260e0-82e1-4839-a672-379671f97310.png",
    "https://cdn.shopinger.co.in/uploads/categories/1788739422695-2e02e0c2-4970-4bd7-bbed-b6bfe0750ce5.png",
    "https://cdn.shopinger.co.in/uploads/categories/1788739782360-8277e49f-f54c-4432-9bcc-1c0f33ecb42d.png",
    "https://cdn.shopinger.co.in/uploads/categories/1788740809662-f4dba49d-b3e0-43f7-ae96-f726f560aa9f.png",
    "https://cdn.shopinger.co.in/uploads/categories/1788741483403-55f6cdc9-3d5f-4c8e-9e43-2ce6513df7c6.png",
    "https://cdn.shopinger.co.in/uploads/categories/1788741772681-723baac7-06c5-4613-9856-49b34576564e.png",
    "https://cdn.shopinger.co.in/uploads/categories/1788741669998-11720c18-f890-4edc-9ab5-08a06d2e500f.png",
    "https://cdn.shopinger.co.in/uploads/categories/1788741669998-11720c18-f890-4edc-9ab5-08a06d2e500f.png",
    "https://cdn.shopinger.co.in/uploads/categories/1788741863507-22e199a8-89f2-42ca-9257-c64b37ecc2cb.png",
  ];
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 0) {
        // scrolling down
        setHideNav(true);
      } else if (currentScrollY < lastScrollY) {
        // scrolling up
        setHideNav(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

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

  return (
    <>
      <div className="bg-white px-4 py-0.5 transition-all duration-500 ease-in-out">
        <div className="flex items-center justify-between gap-4 text-orange-500">
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
                className="no-scrollbar flex items-start gap-4 overflow-x-auto"
              >
                {/* All */}
                <Link
                  href="/"
                  aria-label="All categories"
                  className={clsx(
                    "group flex w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-xl py-2 transition-colors",
                    selected_category == null
                      ? "bg-orange-50"
                      : "hover:bg-gray-50",
                  )}
                >
                  <div
                    className={clsx(
                      "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-800 ease-in-out",
                      selected_category == null
                        ? "bg-orange-100"
                        : "bg-gray-100 group-hover:bg-gray-200",
                      hide_nav && "hidden",
                    )}
                  >
                    <LayoutDashboard
                      className={clsx(
                        "size-6 transition-colors",
                        selected_category == null
                          ? "text-orange-500"
                          : "text-gray-700",
                      )}
                      strokeWidth={1.8}
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
                <ul className="flex items-start gap-4 whitespace-nowrap">
                  {categories.map((category, index) => {
                    const { id, name } = category;

                    return (
                      <li key={`category-${id}`}>
                        <Link
                          href={`/categories/${category.slug}`}
                          className="group flex w-20 shrink-0 flex-col items-center justify-center rounded-md py-1.5"
                        >
                          <div
                            className={clsx(
                              "flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl transition-all duration-800 ease-in-out",
                              hide_nav && "hidden",
                            )}
                          >
                            {category_imgages[index] ? (
                              <Image
                                src={category_imgages[index]}
                                alt={name}
                                width={48}
                                height={48}
                                className={`h-12 w-12 object-contain transition-transform duration-200 group-hover:scale-105`}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-xl bg-orange-50" />
                            )}
                          </div>

                          <span
                            className={clsx(
                              "max-w-20 truncate text-center text-xs font-medium text-black",
                              selected_category?.id === id &&
                                "font-semibold underline underline-offset-4",
                              selected_category?.id === id && "text-orange-500",
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
          </Link>
        </div>
      </div>
      {/* {selected_category && (
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
              {selected_category.sub_categories?.map((sub_category) => {
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
      )} */}
    </>
  );
};

export default CategorySection;
