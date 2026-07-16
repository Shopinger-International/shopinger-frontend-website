import Link from "next/link";
// types
import type {
  FC,
  ForwardRefExoticComponent,
  RefAttributes,
  ReactNode,
} from "react";
import type { LucideProps } from "lucide-react";

// local compoennts
import SidebarDrawer from "@/components/common/sidebar-drawer.component";

// external components
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

// hooks
import useCategories from "@/hooks/axios/common/use-categories";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import { useLogoutModalContext } from "@/provider/logout-modal-provider";

// helpers
import clsx from "clsx";

// icons
import {
  ChevronDown,
  ChevronRight,
  Grid2X2,
  Heart,
  Home,
  LogIn,
  LogOut,
  ShoppingBag,
  MapPin,
  CircleUser,
  Stethoscope,
  TestTubeDiagonal,
  ShieldPlus,
  Pill,
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

const consultancy_section = [
  {
    label: "Book Doctor Consultation",
    href: "/",
    icon: Stethoscope,
  },
  {
    label: "Book Pathology Test",
    href: "/",
    icon: TestTubeDiagonal,
  },
  {
    label: "Health Packages",
    href: "/",
    icon: ShieldPlus,
  },
];

const pharmacy_section = [
  {
    label: "Order Medicines (Prescription Required)",
    href: "/",
    icon: Pill,
  },
];
interface IProps {
  is_open: boolean;
  handleClose: () => void;
  handleShowLoginModal: () => void;
}

interface IMenuGroupProps extends Omit<
  IProps,
  "is_open" | "handleShowLoginModal" | "handleClose"
> {
  title: string;
  list_items: Array<{
    label: string;
    href: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }>;
  default_open?: boolean;
  children?: ReactNode;
}

const MenuGroup: FC<IMenuGroupProps> = ({
  title,
  list_items,
  default_open = false,
  children,
}) => {
  return (
    <Disclosure
      as="section"
      className={({ open }) =>
        clsx("border-b border-gray-300", open ? "last:border-b-0" : "")
      }
      defaultOpen={default_open}
    >
      {({ open }) => (
        <>
          <DisclosureButton className="flex w-full items-center justify-between px-6 py-3 text-left transition-colors hover:bg-gray-50">
            <span className="text-md font-bold text-gray-900">{title}</span>

            <ChevronDown
              className={`size-5 text-gray-500 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </DisclosureButton>

          <DisclosurePanel
            transition
            className="origin-top overflow-hidden transition duration-200 ease-out data-closed:-translate-y-2 data-closed:opacity-0"
          >
            <div className="pb-2">
              {list_items.map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex items-center gap-4 px-6 py-3 transition-colors hover:bg-orange-50"
                >
                  <Icon className="size-5 text-gray-500 transition-colors group-hover:text-orange-500" />

                  <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {label}
                  </span>

                  <ChevronRight className="size-5 text-gray-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-orange-500" />
                </Link>
              ))}
              {children}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};
const MegaMenu: FC<IProps> = ({
  is_open,
  handleClose,
  handleShowLoginModal,
}) => {
  const { openModal: openLogoutModal } = useLogoutModalContext();
  const { data: user } = useUserDetails();
  const { data: categories = [] } = useCategories(true);

  return (
    <SidebarDrawer
      is_open={is_open}
      handleClose={handleClose}
      position="left"
      title={user ? `Hello, ${user.name}` : "Welcome to Shopinger!"}
      panelClassName="max-w-80"
    >
      <div className="flex h-full flex-col overflow-y-auto">
        <MenuGroup
          title={"Online consultancy"}
          default_open={true}
          list_items={consultancy_section}
        />

        <MenuGroup
          title={"Pharmacy"}
          default_open={true}
          list_items={pharmacy_section}
        />

        <MenuGroup
          title={"Shop by Category"}
          default_open={true}
          list_items={categories.map(({ name, slug }) => ({
            label: name,
            href: `/categories/${slug}`,
            icon: Grid2X2,
          }))}
        />
        <MenuGroup
          title={"Account"}
          list_items={account_section}
          default_open={true}
        >
          {user ? (
            <button
              onClick={() => {
                openLogoutModal({
                  onSuccess() {
                    handleClose();
                  },
                });
              }}
              className="group flex w-full items-center gap-4 px-6 py-3 hover:bg-gray-50"
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
            >
              <LogIn className="size-5 text-gray-600" />

              <span className="flex-1 text-left text-sm font-medium">
                Login
              </span>

              <ChevronRight className="size-5 text-gray-400 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </MenuGroup>
      </div>
    </SidebarDrawer>
  );
};

export default MegaMenu;
