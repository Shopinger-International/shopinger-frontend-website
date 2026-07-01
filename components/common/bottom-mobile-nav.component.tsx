import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC } from "react";
import type { LucideProps } from "lucide-react";

// icons
import { Home, CircleUserRound, ShoppingCart } from "lucide-react";

type NavItemProps = {
  icon: FC<LucideProps>;
  title: string;
  href: string;
  active?: boolean;
  showBadge?: boolean;
};

const NavItem: FC<NavItemProps> = ({
  icon: Icon,
  title,
  href,
  active,
  showBadge,
}) => {
  return (
    <Link
      href={href}
      aria-label={`View ${title}`}
      className="flex flex-1 flex-col items-center justify-center py-2 transition-transform active:scale-95"
    >
      <div className="relative">
        <Icon
          className={`size-6 transition-colors ${
            active ? "text-orange-500" : "text-gray-500"
          }`}
          aria-hidden="true"
        />

        {showBadge && (
          <span className="absolute -top-1 -right-2 h-2 w-2 rounded-full bg-red-500" />
        )}
      </div>

      <span
        className={`mt-1 text-xs transition-colors ${
          active ? "font-medium text-orange-500" : "text-gray-500"
        }`}
      >
        {title}
      </span>

      {active && <span className="mt-1 h-1 w-1 rounded-full bg-orange-500" />}
    </Link>
  );
};

const itemsList = [
  {
    title: "Home",
    icon: Home,
    href: "/",
  },
  {
    title: "Account",
    icon: CircleUserRound,
    href: "/profile",
  },
  {
    title: "Cart",
    icon: ShoppingCart,
    href: "/cart-checkout",
    showBadge: true,
  },
];

const BottomMobileNav: FC = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-300 bg-white shadow-xl lg:hidden">
      <div className="flex h-16 w-full border border-gray-300">
        {itemsList.map((item) => (
          <NavItem key={item.title} {...item} active={pathname === item.href} />
        ))}
      </div>
    </div>
  );
};

export default BottomMobileNav;
