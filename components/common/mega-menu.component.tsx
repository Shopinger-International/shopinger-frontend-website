import Link from "next/link";
// types
import type { FC, ForwardRefExoticComponent, RefAttributes } from "react";
import type { LucideProps } from "lucide-react";

// local compoennts
import SidebarDrawer from "@/components/common/sidebar-drawer.component";

// hooks
import useCategories from "@/hooks/axios/common/use-categories";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useLogoutMutation from "@/hooks/axios/login/use-logout-mutation.hook";

import {
  ChevronRight,
  Grid2X2,
  Heart,
  Home,
  LogIn,
  LogOut,
  ShoppingBag,
  MapPin,
  CircleUser,
} from "lucide-react";

const account_section = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "My Profile",
    href: "/profile",
    icon: CircleUser,
  },
  {
    label: "My Orders",
    href: "/order-history",
    icon: ShoppingBag,
  },
  {
    label: "My Addresses",
    href: "/manage-address",
    icon: MapPin,
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: Heart,
  },
];

interface IProps {
  is_open: boolean;
  handleClose: () => void;
  handleShowLoginModal: () => void;
}

interface IMenuGroupProps extends Omit<
  IProps,
  "is_open" | "handleShowLoginModal"
> {
  title: string;
  list_items: Array<{
    label: string;
    href: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }>;
}

const MenuGroup: FC<IMenuGroupProps> = ({ title, handleClose, list_items }) => {
  return (
    <>
      <p className="px-6 pb-2 text-lg font-semibold text-orange-500">{title}</p>
      <div className="min-h-0 overflow-y-auto">
        {list_items.map(({ icon: Icon, label, href }) => (
          <Link
            key={label}
            href={href}
            onClick={handleClose}
            className="group flex items-center gap-4 px-6 py-3 hover:bg-gray-50"
          >
            <Icon className="size-5 text-gray-600" />

            <span className="flex-1 text-sm font-medium">{label}</span>

            <ChevronRight className="size-5 text-gray-400 transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </>
  );
};

const MegaMenu: FC<IProps> = ({
  is_open,
  handleClose,
  handleShowLoginModal,
}) => {
  const logout_mutation = useLogoutMutation();
  const { data: user } = useUserDetails();
  const { data: categories = [] } = useCategories(true);

  return (
    <SidebarDrawer
      is_open={is_open}
      handleClose={handleClose}
      position="left"
      title={user ? `Hello, ${user.name}` : "Sign In to Get Started ⭐"}
    >
      <div className="flex h-full flex-col">
        <div>
          <MenuGroup
            title={"Account"}
            handleClose={handleClose}
            list_items={account_section}
          />
          {user ? (
            <button
              onClick={() => {
                logout_mutation.mutate();
                handleClose();
              }}
              className="group flex w-full items-center gap-4 px-6 py-3 hover:bg-gray-50"
              disabled={logout_mutation.isPending}
            >
              <LogOut className="size-5 text-gray-600" />

              <span className="flex-1 text-left text-sm font-medium">
                Logout
              </span>

              <ChevronRight className="size-5 text-gray-400 transition-transform group-hover:translate-x-1" />
            </button>
          ) : (
            <button
              onClick={() => {
                handleShowLoginModal();
              }}
              className="group flex w-full items-center gap-4 px-6 py-3 hover:bg-gray-50"
              disabled={logout_mutation.isPending}
            >
              <LogIn className="size-5 text-gray-600" />

              <span className="flex-1 text-left text-sm font-medium">
                Login
              </span>

              <ChevronRight className="size-5 text-gray-400 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col py-2">
          <MenuGroup
            title={"Shop by Category"}
            handleClose={handleClose}
            list_items={categories.map(({ name, slug }) => ({
              label: name,
              href: `/categories/${slug}`,
              icon: Grid2X2,
            }))}
          />
        </div>
      </div>
    </SidebarDrawer>
  );
};

export default MegaMenu;
