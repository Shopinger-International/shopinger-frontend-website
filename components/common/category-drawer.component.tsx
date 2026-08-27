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

type IProps = {
  is_open: boolean;
  handleClose: () => void;
};

const CategoryDrawer: FC<IProps> = ({ is_open, handleClose }) => {
  const router = useRouter();
  return (
    <Dialog open={is_open} onClose={handleClose} className={"relative z-50"}>
      <div className="fixed inset-0 h-screen w-screen max-w-md shadow-md">
        <DialogPanel className={"h-full w-full bg-white p-4"}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={() => router.back()}>
                <ArrowLeft className="size-6" />
              </button>
              <span className="font-semibold">All Categories</span>
            </div>
            <SearchBar show_search_icon_only={true} />
          </div>
          <BottomMobileNav />
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CategoryDrawer;
