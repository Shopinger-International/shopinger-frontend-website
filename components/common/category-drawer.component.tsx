import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

// types
import type { FC } from "react";
import type { IBaseCategory } from "@/hooks/axios/common/use-categories";

// external components
import { Dialog, DialogPanel } from "@headlessui/react";
import SearchBar from "@/components/header/search-bar/search-bar.component";

// icons
import { ArrowLeft, ChevronDown } from "lucide-react";

// local components
import BottomMobileNav from "@/components/common/bottom-mobile-nav.component";

// hooks
import useCategories from "@/hooks/axios/common/use-categories";

// helpers
import clsx from "clsx";

const SubSubCategorySection: FC<{
  name: string;
  sub_sub_categories: IBaseCategory[];
  main_category_slug?: string;
  sub_category_slug: string;
}> = ({ name, sub_sub_categories, main_category_slug, sub_category_slug }) => {
  const [is_expanded, setIsExpanded] = useState(false);
  const display_limit = 6;
  const has_more = sub_sub_categories.length > display_limit;
  const visible_sub_sub_categories = is_expanded
    ? sub_sub_categories
    : sub_sub_categories.slice(0, display_limit);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold">{name}</h2>
        <div className="h-[0.5px] flex-1 bg-gray-300 text-lg" />
      </div>
      <div className="grid grid-cols-3 gap-x-6 gap-y-4">
        {visible_sub_sub_categories.map(
          ({ id, name, slug: sub_sub_category_slug, media }) => (
            <Link
              key={`sub-sub-category-${id}`}
              href={`/categories/${main_category_slug}/${sub_category_slug}/${sub_sub_category_slug}`}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={clsx(
                  "relative size-18.5 overflow-hidden rounded-full",
                )}
              >
                {media ? (
                  <Image
                    src={media}
                    fill={true}
                    alt={name}
                    aria-hidden={true}
                    sizes="75px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full border border-gray-300 bg-gray-50 text-xs text-gray-400">
                    N/A
                  </div>
                )}
              </div>
              <h2 className="text-center text-sm">{name}</h2>
            </Link>
          ),
        )}
      </div>
      {has_more && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center text-sm font-medium text-orange-500"
          >
            <span>{is_expanded ? "View less" : `View more`}</span>
            <ChevronDown className="size-5" />
          </button>
        </div>
      )}
    </section>
  );
};

type IProps = {
  is_open: boolean;
  handleClose: () => void;
};

const CategoryDrawer: FC<IProps> = ({ is_open, handleClose }) => {
  const [selected_main_category_id, setSelectedMainCatgoryId] = useState<
    number | null
  >(null);
  const { data: categories } = useCategories(true, "subsub");
  const router = useRouter();

  useEffect(() => {
    categories && setSelectedMainCatgoryId(categories[0].id);
  }, [categories]);
  return (
    <Dialog open={is_open} onClose={handleClose} className={"relative z-50"}>
      <div className="fixed inset-0 h-screen w-screen max-w-md shadow-md">
        <DialogPanel
          transition
          className={clsx(
            "flex h-full w-full flex-col bg-white",
            "duration-100 ease-out",
            "data-closed:translate-y-full",
            "data-enter:translate-y-full",
            "data-enter:duration-100",
            "data-enter:ease-out",
            "data-leave:translate-y-full",
            "data-leave:duration-100",
            "data-leave:ease-in",
          )}
        >
          <div className="flex items-center justify-between border-b border-gray-300 px-4 py-2">
            <div className="flex items-center gap-6">
              <button onClick={() => router.back()} aria-label="Go back">
                <ArrowLeft className="size-6" />
              </button>
              <span className="font-semibold">All Categories</span>
            </div>
            <SearchBar show_search_icon_only={true} />
          </div>
          <div className="flex min-h-0 flex-1">
            <div className="no-scrollbar flex h-[calc(100%-var(--bottom-nav-height))] w-22 flex-col items-center overflow-y-auto border-e border-gray-300 bg-gray-50">
              {categories?.map(({ id, name, media }) => (
                <button
                  key={`category-${id}`}
                  className={clsx(
                    "flex w-full flex-col items-center gap-1 px-1 pt-2 pb-1",
                    selected_main_category_id == id &&
                      "bg-orange-500 text-white",
                  )}
                  onClick={() => setSelectedMainCatgoryId(id)}
                >
                  <div
                    className={clsx(
                      "relative size-11.5 overflow-hidden rounded-full",
                    )}
                  >
                    {media ? (
                      <Image
                        src={media}
                        fill={true}
                        alt={name}
                        aria-hidden={true}
                        sizes="45px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full border border-gray-300 bg-gray-50 text-xs text-gray-400">
                        N/A
                      </div>
                    )}
                  </div>
                  <h2
                    className={clsx(
                      "text-center text-sm",
                      selected_main_category_id == id
                        ? "font-semibold"
                        : "font-medium",
                    )}
                  >
                    {name}
                  </h2>
                </button>
              ))}
            </div>
            <div className="flex h-[calc(100%-var(--bottom-nav-height))] flex-1 flex-col overflow-y-auto px-4 py-2">
              {categories
                ?.find((category) => category.id == selected_main_category_id)
                ?.sub_categories.map(
                  ({
                    id,
                    name,
                    slug: sub_category_slug,
                    sub_sub_categories,
                  }) => (
                    <SubSubCategorySection
                      key={`sub-category-section-${id}`}
                      name={name}
                      main_category_slug={
                        categories.find(
                          (category) =>
                            category.id == selected_main_category_id,
                        )?.slug
                      }
                      sub_category_slug={sub_category_slug}
                      sub_sub_categories={sub_sub_categories}
                    />
                  ),
                )}
            </div>
          </div>
          <BottomMobileNav />
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CategoryDrawer;
