import { forwardRef } from "react";

// types
import type { CustomContentProps } from "notistack";

// External components
import { SnackbarContent } from "notistack";

// icons
import { CheckCircle, XCircle } from "lucide-react";

export const SuccessSnackbar = forwardRef<HTMLDivElement, CustomContentProps>(
  ({ message }, ref) => (
    <SnackbarContent ref={ref}>
      <div className="flex w-full items-center gap-3 rounded-lg bg-orange-500 px-4 py-3 text-white shadow-lg font-medium">
        <CheckCircle size={18} />
        <span className="flex-1">{message}</span>
      </div>
    </SnackbarContent>
  ),
);

export const ErrorSnackbar = forwardRef<HTMLDivElement, CustomContentProps>(
  ({ message }, ref) => (
    <SnackbarContent ref={ref}>
      <div className="flex w-full items-center gap-3 rounded-lg bg-red-600 px-4 py-3 text-white shadow-lg font-medium">
        <XCircle size={18} />
        <span className="flex-1">{message}</span>
      </div>
    </SnackbarContent>
  ),
);
