// types
import type { FC } from "react";
import type IUser from "@/types/user";
import type { SnackbarOrigin } from "notistack";

// icons
import { X } from "lucide-react";

// external components
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

// local components
import LoginForm from "@/components/login/login-form.component";

type IProps = {
  open: boolean;
  anchorOrigin?: SnackbarOrigin;
  handleClose: () => void;
  handleOnSuccess: (user: IUser) => void;
};

const LoginModal: FC<IProps> = ({
  open,
  anchorOrigin = {
    horizontal:"right",
    vertical:"bottom"
  },
  handleClose,
  handleOnSuccess,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-xs" />

      {/* container */}
      <div className="fixed inset-0 flex items-end justify-center lg:items-center">
        <DialogPanel className="relative max-h-[90vh] w-full overflow-hidden rounded-t-2xl bg-white shadow-xl lg:h-auto lg:max-h-[95vh] lg:w-105 lg:rounded-2xl">
          <button
            className="absolute top-4 right-4 z-2 cursor-pointer text-gray-600"
            onClick={handleClose}
          >
            <X />
          </button>

          <LoginForm
            anchorOrigin={anchorOrigin}
            is_modal={true}
            heading_text="Login to complete your order"
            handleOnSuccess={(user) => {
              handleOnSuccess(user);
            }}
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
};
export default LoginModal;
