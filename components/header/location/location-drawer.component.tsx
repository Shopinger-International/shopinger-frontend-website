import type { FC } from "react";

import { Dialog, DialogPanel } from "@headlessui/react";

import LocationTooltipContent from "./location-tooltip-content.component";

import { X } from "lucide-react";

type IProps = {
  open: boolean;
  onClose: () => void;
};

const LocationDrawer: FC<IProps> = ({ onClose, open }) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="
          fixed inset-0
          bg-black/40
          transition-opacity duration-300 ease-out
          data-closed:opacity-0
        "
      />

      {/* Drawer */}
      <div className="fixed inset-0 flex items-end justify-center">
        <DialogPanel
          transition
          className="
            relative
            h-1/2
            w-full
            overflow-visible
            rounded-t-xl
            bg-white
            shadow-[0_-8px_30px_rgba(0,0,0,0.12)]
            outline-none
            pb-[env(safe-area-inset-bottom)]

            transform
            transition-transform
            duration-300
            ease-out
            data-closed:translate-y-full
          "
        >
          {/* Keep floating close CTA */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              absolute
              top-0
              left-1/2
              z-20
              flex
              size-12
              -translate-x-1/2
              -translate-y-[calc(100%+20px)]
              items-center
              justify-center
              rounded-full
              bg-black
              text-white
              shadow-lg
              transition
              hover:bg-gray-900
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-white
              focus-visible:ring-offset-2
              focus-visible:ring-offset-black
            "
          >
            <X className="size-6" strokeWidth={2.5} />
          </button>

          {/* Drag handle */}
          <div className="flex justify-center pt-2.5 pb-1">
            <span className="h-1 w-10 rounded-full bg-gray-300" />
          </div>

          {/* Content */}
          <div className="max-h-[calc(85dvh-20px)] overflow-y-auto overscroll-contain">
            <LocationTooltipContent handleClose={onClose} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default LocationDrawer;