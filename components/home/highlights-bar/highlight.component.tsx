// type
import type { FC } from "react";
import type { IconType } from "react-icons/lib";

const Highlight: FC<{
  icon: IconType;
  title: string;
  para: string;
}> = ({ icon: Icon, title, para }) => {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <Icon className="size-6 text-gray-900" strokeWidth={1.75} />
      <div>
        <span className="block text-[12px] font-semibold">{title}</span>
        <p className="text-[11px] font-medium text-gray-600">{para}</p>
      </div>
    </div>
  );
};
export default Highlight;
