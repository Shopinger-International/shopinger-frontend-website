import type { FC } from "react";
import Image from "next/image";
import type { IconType } from "react-icons/lib";

const Highlight: FC<{
  icon: IconType;
  title: string;
  image_path: string;
}> = ({ title, image_path }) => {
  return (
    <div className="flex max-w-50 flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image
          src={image_path}
          width={40}
          height={40}
          alt={title}
          className="size-7 object-contain"
        />

        <h3 className="text-xs font-semibold text-gray-900">{title}</h3>
      </div>
    </div>
  );
};

export default Highlight;
