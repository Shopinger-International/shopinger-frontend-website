// types
import type { FC } from "react";

// headless ui
import { Dialog, DialogPanel } from "@headlessui/react";

// local components
import LocationTooltipContent from "@/components/header/location/location-tooltip-content.component";

// hooks
import { useLocationTooltipStateContext } from "@/provider/location-tooltip.provider";

type IProps = {
  toggle: boolean;
  open: boolean;
  onClose: () => void;
};

const LocationDrawer: FC<IProps> = ({ toggle, open, onClose }) => {
  const { updateIsShown } = useLocationTooltipStateContext();
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
          className="relative h-full w-full transform overflow-hidden bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out outline-none data-closed:translate-y-full"
        >
          {/* Content */}
          <div className="h-full overflow-y-auto">
            <LocationTooltipContent
              toggle={toggle}
              handleClose={() => {
                onClose();
                updateIsShown?.(true);
              }}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default LocationDrawer;
