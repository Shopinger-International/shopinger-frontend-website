import { Fragment } from "react";
import type { FC, ReactNode } from "react";

import clsx from "clsx";
import { X } from "lucide-react";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";

interface SidebarDrawerProps {
  children: ReactNode;
  is_open: boolean;
  handleClose: () => void;
  position?: "left" | "right";
  title: string;
}

const SidebarDrawer: FC<SidebarDrawerProps> = ({
  children,
  is_open,
  handleClose,
  title,
  position = "right",
}) => {
  const is_left = position === "left";

  return (
    <Transition appear show={is_open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" />
        </TransitionChild>

        <div
          className={clsx(
            "fixed inset-0 flex",
            is_left ? "justify-start" : "justify-end",
          )}
        >
          <TransitionChild
            as={Fragment}
            enter="transform transition duration-300 ease-[cubic-bezier(.22,1,.36,1)]"
            enterFrom={is_left ? "-translate-x-full" : "translate-x-full"}
            enterTo="translate-x-0"
            leave="transform transition duration-200 ease-in"
            leaveFrom="translate-x-0"
            leaveTo={is_left ? "-translate-x-full" : "translate-x-full"}
          >
            <DialogPanel
              className={clsx(
                "flex h-full w-full max-w-90 flex-col bg-white shadow-2xl",
                "pb-[env(safe-area-inset-bottom)]",
                is_left
                  ? "border-r border-gray-300 sm:rounded-r-2xl"
                  : "border-l border-gray-300 sm:rounded-l-2xl",
              )}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-300 bg-white px-6 py-4">
                <DialogTitle className="pr-4 text-xl font-semibold tracking-tight text-orange-500">
                  {title}
                </DialogTitle>

                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  aria-label="Close drawer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Content */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                {children}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SidebarDrawer;
