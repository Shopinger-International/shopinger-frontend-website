import Link from "next/link";
// types
import type { FC } from "react";

// local components
import Tooltip from "@/components/common/tooltip.component";

// icons
import {
  CircleUserRound,
  Triangle,
  User,
  Handbag,
  MapPin,
  Heart,
  LogOut,
} from "lucide-react";

// helpers
import { clsx } from "clsx";

// hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import { useLogoutModalContext } from "@/provider/logout-modal-provider";

const AccountDropdown: FC = () => {
  const { data: user_details } = useUserDetails();
  const { openModal: openLogoutModal } = useLogoutModalContext();

  return (
    <div className="hidden lg:inline">
      <Tooltip
        placement="bottom"
        offset_distance={6}
        className={clsx(
          "z-50 w-52 rounded-xl border border-neutral-300 bg-white shadow-lg",
        )}
        show_tooltip={!user_details && false}
        strategy="fixed"
        content={({ handleClose }) => (
          <div>
            {/* Auth ww. tion */}
            {user_details && (
              <div className="flex flex-col gap-3 px-3 py-3">
                <p className="text-sm font-semibold">Account </p>
              </div>
            )}
            {/* Menu section */}
            {user_details && (
              <div className={"border-t border-gray-300"}>
                {[
                  {
                    label: "Account",
                    href: "/account",
                    icon: User,
                  },
                  {
                    label: "Orders",
                    href: "/order-history",
                    icon: Handbag,
                  },
                  {
                    label: "Saved Addresses",
                    href: "/manage-address",
                    icon: MapPin,
                  },
                  {
                    label: "Wishlist",
                    href: "/wishlist",
                    icon: Heart,
                  },
                ].map(({ label, href, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-3 text-sm",
                      "hover:bg-brand transition hover:text-white",
                    )}
                  >
                    <Icon className="size-5" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            )}

            {user_details && (
              <div className="border-t border-gray-300">
                <button
                  onClick={() => openLogoutModal({})}
                  className={clsx(
                    "flex w-full items-center gap-3 px-4 py-3 text-sm",
                    "hover:bg-brand transition hover:text-white",
                  )}
                >
                  <LogOut className="size-5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      >
        {({ open }) =>
          user_details ? (
            <button
              className={clsx(
                "flex items-center gap-2 rounded-full px-3 py-2 font-semibold text-black",
                "transition hover:bg-white/10 focus:outline-none",
              )}
            >
              <CircleUserRound className="size-6" />
              <span className="max-w-28 truncate">
                {user_details.name?.split(" ")[0] ?? "Account"}
              </span>
            </button>
          ) : (
            <button
              className={clsx(
                "flex items-center gap-2 rounded-full px-3 py-2 text-black",
                "transition hover:bg-white/10 focus:outline-none",
              )}
            >
              <CircleUserRound className="size-6" strokeWidth={1.3} />
              <Link href="/login" className="font-normal hover:cursor-pointer">
                Log In
              </Link>
            </button>
          )
        }
      </Tooltip>
    </div>
  );
};
export default AccountDropdown;
