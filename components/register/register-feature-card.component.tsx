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

const RegisterFeatureCard: FC<IProps> = ({
  image_src,
  label,
  para,
  icon: Icon,
}) => {
  return (
    <div className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-md">
      <div className="relative size-18 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={image_src}
          alt={label}
          className="object-cover"
          fill={true}
        />
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <Icon className="size-5 text-orange-500" />
          <h3 className="text-md font-medium">{label}</h3>
        </div>
        <p className="text-sm">{para}</p>
      </div>
    </div>
  );
};
export default RegisterFeatureCard;
