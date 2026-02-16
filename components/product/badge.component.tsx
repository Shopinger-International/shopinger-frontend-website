import { ReactNode } from "react";
// types
import type { FC } from "react";

// helpers
import { clsx } from "clsx";

type IProps = {
  className: string;
  children: ReactNode;
};
const Badge: FC<IProps> = ({ className, children }) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs leading-4 font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
