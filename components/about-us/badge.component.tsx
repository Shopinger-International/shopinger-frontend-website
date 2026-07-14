import type { FC } from "react";

const Badge: FC<{
  title: string;
}> = ({ title }) => {
  return (
    <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-500 sm:px-4 sm:text-sm">
      {title}
    </span>
  );
};
export default Badge;
