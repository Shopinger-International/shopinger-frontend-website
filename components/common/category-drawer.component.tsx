import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
// types
import type { FC } from "react";

// external components
import { Dialog, DialogPanel } from "@headlessui/react";
import SearchBar from "@/components/header/search-bar/search-bar.component";

// icons
import { ArrowLeft } from "lucide-react";

// local components
import BottomMobileNav from "@/components/common/bottom-mobile-nav.component";

// hooks
import useCategories from "@/hooks/axios/common/use-categories";

// helpers
import clsx from "clsx";

type IProps = {
  is_open: boolean;
  handleClose: () => void;
};

const CategoryDrawer: FC<IProps> = ({ is_open, handleClose }) => {
  const [selected_main_category_id, setSelectedMainCatgoryId] = useState<
    number | null
  >(null);
  const { data: categories } = useCategories();
  const router = useRouter();

  useEffect(() => {
    categories && setSelectedMainCatgoryId(categories[0].id);
  }, [categories]);
  return (
    <Dialog open={is_open} onClose={handleClose} className={"relative z-50"}>
      <div className="fixed inset-0 h-screen w-screen max-w-md shadow-md">
        <DialogPanel className={"flex h-full w-full flex-col bg-white"}>
          <div className="flex items-center justify-between border-b border-gray-300 px-4 py-2">
            <div className="flex items-center gap-6">
              <button onClick={() => router.back()}>
                <ArrowLeft className="size-6" />
              </button>
              <span className="font-semibold">All Categories</span>
            </div>
            <SearchBar show_search_icon_only={true} />
          </div>
          <div className="flex min-h-0 flex-1">
            <div className="no-scrollbar flex h-[calc(100%-var(--bottom-nav-height))] w-22 flex-col items-center overflow-y-auto border-e border-gray-300 bg-gray-50">
              {categories?.map(({ id, name, media }) => (
                <div
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
                      <Image src={media} fill={true} alt="category-image" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full border border-gray-300 bg-gray-50 text-xs text-gray-400">
                        N/A
                      </div>
                    )}
                  </div>
                  <span
                    className={clsx(
                      "text-center text-sm",
                      selected_main_category_id == id
                        ? "font-semibold"
                        : "font-medium",
                    )}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-full flex-1"></div>
          </div>
          <BottomMobileNav />
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CategoryDrawer;
