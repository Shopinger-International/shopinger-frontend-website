import type { FC } from "react";
import type IUser from "@/types/user";
import { X } from "lucide-react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

import LoginInfoSection from "@/components/login/login-info-section.component";
import LoginForm from "@/components/login/login-form.component";

type IProps = {
  open: boolean;
  handleClose: () => void;
  handleOnSuccess: (user: IUser) => void;
};

const LoginModal: FC<IProps> = ({ open, handleClose, handleOnSuccess }) => {
  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
   <DialogBackdrop className="fixed inset-0 bg-transparent" />

      <div className="fixed inset-0 flex items-end justify-center lg:items-center">
        <DialogPanel className="relative max-h-[95vh] w-full overflow-hidden rounded-none bg-white shadow-xl lg:w-max">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 z-50 flex size-8 items-center justify-center text-gray-600 hover:text-gray-900"
            onClick={handleClose}
            aria-label="Close login"
          >
            <X className="size-6" />
          </button>

          {/* Desktop Login */}
          <div className="hidden lg:flex">
            <LoginInfoSection />

            <LoginForm handleOnSuccess={handleOnSuccess} />
          </div>

          {/* Mobile Login */}
          <div className="lg:hidden">
            <LoginForm
              is_modal={true}
              heading_text="Login to complete your order"
              handleOnSuccess={handleOnSuccess}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default LoginModal;
