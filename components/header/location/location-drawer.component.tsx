import type { FC } from "react";

import { Dialog, DialogPanel } from "@headlessui/react";

import LocationTooltipContent from "./location-tooltip-content.component";

import { X } from "lucide-react";

type IProps = {
  toggle: boolean;
  open: boolean;
  onClose: () => void;
};

const LocationDrawer: FC<IProps> = ({ toggle, open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={() => toggle && onClose()}
      className="relative z-50"
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-black/40 transition-opacity duration-300 ease-out data-closed:opacity-0"
      />

      {/* Drawer */}
      <div className="fixed inset-0 flex items-end justify-center">
        <DialogPanel
          transition
          className="relative h-2/3 w-full transform overflow-visible rounded-t-xl bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out outline-none data-closed:translate-y-full"
        >
          {/* Keep floating close CTA */}
          {toggle && (
            <button
              type="button"
              onClick={() => toggle && onClose()}
              aria-label="Close"
              className="absolute top-0 left-1/2 z-20 flex size-12 -translate-x-1/2 -translate-y-[calc(100%+20px)] items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <X className="size-6" strokeWidth={2.5} />
            </button>
          )}

          {/* Content */}
          <div className="h-full overflow-y-auto">
            <LocationTooltipContent handleClose={onClose} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default LocationDrawer;
