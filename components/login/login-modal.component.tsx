// types
import type { FC } from "react";

// icons
import { X } from "lucide-react";

// external components
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

// local components
import LoginForm from "@/components/login/login-form.component";

type IProps = {
  open: boolean;
  handleClose: () => void;
};

const LoginModal: FC<IProps> = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={() => handleClose()} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <DialogPanel className="relative max-w-lg space-y-4 overflow-hidden rounded-lg border border-gray-300 shadow-lg">
          <button
            className="absolute top-4 right-4 z-2 cursor-pointer text-gray-600"
            onClick={handleClose}
          >
            <X />
          </button>
          <LoginForm />
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default LoginModal;
