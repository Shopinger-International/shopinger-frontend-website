import { Fragment, useContext } from "react";

// types
import type { FC, ReactNode } from "react";
// external components
import {
  Transition,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

// icons
import { X } from "lucide-react";

// context
import { FiltersSortBarState } from "@/context";

const FilterDrawer: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { state, updateState } = useContext(FiltersSortBarState);
  return (
    <Transition show={state == "sort"} as={Fragment}>
      <Dialog onClose={() => updateState?.(null)} className="relative z-50">
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </TransitionChild>

        {/* Drawer */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-x-0 bottom-0 flex max-h-[85vh]">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-out duration-300"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transform transition ease-in duration-200"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <DialogPanel className="pointer-events-auto w-full rounded-t-xl border border-gray-300 bg-white shadow-md">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3">
                    <DialogTitle className="text-sm font-semibold">
                      Filters
                    </DialogTitle>

                    <button onClick={() => updateState?.(null)}>
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="max-h-[70vh] overflow-y-auto p-4">
                    {children}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FilterDrawer;
