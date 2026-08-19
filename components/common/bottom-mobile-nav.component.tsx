import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC, HTMLAttributeAnchorTarget } from "react";
import type { LucideProps } from "lucide-react";

// icons
import { Home, ShoppingCart, CreditCard } from "lucide-react";

// hooks
import useCart from "@/hooks/axios/cart/use-cart.hook";

// local components
import Cart from "@/components/common/icons/cart.icon";

// data
import { whatsapp_templates } from "@/data/whatsapp-templates.data";

type NavItemProps = {
  icon: FC<LucideProps>;
  title: string;
  href: string;
  target: HTMLAttributeAnchorTarget;
  active?: boolean;
  show_badge?: boolean;
};

const NavItem: FC<NavItemProps> = ({
  icon: Icon,
  title,
  href,
  active,
  target,
  show_badge,
}) => {
  const { data: cart_details } = useCart();
  if (title == "Cart") {
    return (
      <Link
        href={href}
        aria-label={`View ${title}`}
        className="flex flex-1 flex-col items-center justify-center py-1.5 transition-transform active:scale-95"
        target={target}
      >
        <span className="relative inline-block">
          <Cart width={32} height={24} fill="oklch(55.1% 0.027 264.364)" />

          <span className="pointer-events-none absolute top-[35%] left-1/2 -translate-x-1/3 -translate-y-1/2 text-xs leading-none font-bold text-orange-500">
            {cart_details?.total_items ?? 0}
          </span>
        </span>

        <span
          className={`mt-0.5 text-xs transition-colors ${
            active ? "font-medium text-orange-500" : "text-gray-500"
          }`}
        >
          {title}
        </span>
      </Link>
    );
  }
  return (
    <Link
      href={href}
      aria-label={`View ${title}`}
      className="flex flex-1 flex-col items-center justify-center py-1.5 transition-transform active:scale-95"
      target={target}
    >
      <div className="relative">
        <Icon
          className={`size-6 transition-colors ${
            active ? "text-orange-500" : "text-gray-500"
          }`}
          aria-hidden="true"
        />

        {show_badge && (
          <span className="absolute -top-1 -right-2 h-2 w-2 rounded-full bg-red-500" />
        )}
      </div>

      <span
        className={`mt-0.5 text-xs transition-colors ${
          active ? "font-medium text-orange-500" : "text-gray-500"
        }`}
      >
        {title}
      </span>
    </Link>
  );
};

const items_list = [
  {
    title: "Home",
    icon: Home,
    href: "/",
    target: "_self",
  },
  {
    title: "Easy EMI",
    icon: CreditCard,
    href: `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_PHONE}?text=${encodeURIComponent(whatsapp_templates.emi)}`,
    target: "_blank",
  },
  {
    title: "Cart",
    icon: ShoppingCart,
    href: "/cart-checkout",
    show_badge: true,
    target: "_self",
  },
];

const BottomMobileNav: FC = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-300 bg-white lg:hidden">
      <div className="flex w-full">
        {items_list.map((item) => (
          <NavItem
            key={item.title}
            {...item}
            active={pathname === item.href}
            target={item.target}
          />
        ))}
      </div>
    </div>
  );
};

export default BottomMobileNav;
