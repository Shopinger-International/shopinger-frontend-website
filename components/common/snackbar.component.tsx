import { forwardRef } from "react";

// types
import type { CustomContentProps } from "notistack";

// External components
import { SnackbarContent } from "notistack";

// icons
import { CheckCircle, XCircle } from "lucide-react";
type ExtendedSnackbarProps = CustomContentProps & {
  action_label?: string;
  onActionClick?: () => void;
};

export const SuccessSnackbar = forwardRef<
  HTMLDivElement,
  ExtendedSnackbarProps
>(({ message, action_label, onActionClick }, ref) => (
  <SnackbarContent ref={ref}>
    <div className="flex w-full items-center gap-3 rounded-lg bg-orange-500 px-4 py-3 font-medium text-white shadow-lg">
      <CheckCircle size={18} />

      <span className="flex-1">{message}</span>

      {action_label && onActionClick && (
        <button
          onClick={onActionClick}
          className="ml-2 rounded-md bg-white/20 px-3 py-1 text-sm font-semibold transition hover:bg-white/30 cursor-pointer"
        >
          {action_label}
        </button>
      )}
    </div>
  </SnackbarContent>
));

export const ErrorSnackbar = forwardRef<HTMLDivElement, CustomContentProps>(
  ({ message }, ref) => (
    <SnackbarContent ref={ref}>
      <div className="flex w-full items-center gap-3 rounded-lg bg-red-600 px-4 py-3 font-medium text-white shadow-lg">
        <XCircle size={18} />
        <span className="flex-1">{message}</span>
      </div>
    </SnackbarContent>
  ),
);
