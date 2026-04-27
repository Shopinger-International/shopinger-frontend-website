import Link from "next/link";
// types
import type { ReactNode, FC } from "react";

const NavigationCard: FC<{
  children: ReactNode;
  title: string;
  description: string;
  href: string;
}> = ({ children, title, description, href }) => {
  return (
    <Link
      href={href}
      className="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-300 bg-white p-4"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-100">
        {children}
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-800 sm:text-lg">
          {title}
        </h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );
};
export default NavigationCard;
