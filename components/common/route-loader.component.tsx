import type { FC } from "react";

interface IProps {
  is_loading: boolean;
}

const RouteLoader: FC<IProps> = ({ is_loading }) => {
  if (!is_loading) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] grid place-items-center bg-white/80 backdrop-blur-[2px]"
      role="status"
      aria-label="Changing page"
      aria-live="polite"
    >
      <div
        aria-hidden="true"
        className="size-10 animate-spin rounded-full border-[3px] border-gray-200 border-t-emerald-700 motion-reduce:animate-none"
      />
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default RouteLoader;
