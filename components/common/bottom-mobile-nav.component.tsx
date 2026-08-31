import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useEffect, useRef } from "react";
// types
import type { FC, HTMLAttributeAnchorTarget } from "react";
import type { LucideProps } from "lucide-react";

// icons
import { Home, ShoppingCart, CreditCard, LayoutDashboard } from "lucide-react";

// hooks
import useCart from "@/hooks/axios/cart/use-cart.hook";
import { useCategoryDrawerContext } from "@/provider/category-drawer.provider";

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
  const { openDrawer } = useCategoryDrawerContext();
  const { data: cart_details } = useCart();
  if (title == "Categories") {
    return (
      <button
        onClick={openDrawer}
        className="flex flex-1 flex-col items-center justify-center py-1.5 transition-transform active:scale-95"
      >
        <Icon
          className={`size-6 transition-colors ${
            active ? "text-orange-500" : "text-gray-500"
          }`}
          aria-hidden="true"
        />

        <span
          className={`mt-0.5 text-xs transition-colors ${
            active ? "font-medium text-orange-500" : "text-gray-500"
          }`}
        >
          {title}
        </span>
      </button>
    );
  }
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
    title: "Categories",
    icon: LayoutDashboard,
    href: "",
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
  const bottom_ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let prev_scroll_pos = window.pageYOffset;
    function handleScroll() {
      const current_scroll_pos = window.pageYOffset;
      if (bottom_ref.current) {
        if (current_scroll_pos > prev_scroll_pos) {
          bottom_ref.current.style.bottom = "-54px";
        } else {
          bottom_ref.current.style.bottom = "0";
        }
      }
      prev_scroll_pos = current_scroll_pos;
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    const bottom_nav = bottom_ref.current;
    let observer: ResizeObserver | undefined;

    if (bottom_nav) {
      const setHeight = () => {
        document.documentElement.style.setProperty(
          "--bottom-nav-height",
          `${bottom_nav.offsetHeight}px`,
        );
      };
      setHeight();
      observer = new ResizeObserver(setHeight);
      observer.observe(bottom_nav);
    }
    return observer?.disconnect();
  }, []);

  return (
    <div
      ref={bottom_ref}
      className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-300 bg-white transition-all duration-200 ease-in lg:hidden"
    >
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
