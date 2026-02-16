import Image from "next/image";
// type
import type { FC, ForwardRefExoticComponent, RefAttributes } from "react";
import type { LucideProps } from "lucide-react";

type IProps = {
  image_src: string;
  label: string;
  para: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

const LoginFeatureCard: FC<IProps> = ({
  image_src,
  label,
  para,
  icon: Icon,
}) => {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-md">
        <Image src={image_src} alt={label} fill className="object-cover" />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-orange-100 p-1">
            <Icon className="size-4 text-orange-500" />
          </span>
          <h3 className="text-sm leading-tight font-medium">{label}</h3>
        </div>

        <p className="line-clamp-2 text-xs leading-snug text-gray-600">
          {para}
        </p>
      </div>
    </div>
  );
};
export default LoginFeatureCard;
