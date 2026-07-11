import Link from "next/link";
import { Heart } from "lucide-react";

// hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

const EmtpyWishlist = () => {
  const { data: user_detail } = useUserDetails();
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-16 text-center">
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Heart className="h-8 w-8 text-orange-500" />
      </div>

      {/* Title */}
      <h2 className="mt-6 text-xl font-semibold text-gray-900">
        Your Wishlist is empty
      </h2>

      {/* Description */}
      <p className="mt-2 max-w-md text-sm text-gray-600">
        Found something you like? Save it to your wishlist so you can come back
        to it anytime.
      </p>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {/* Primary CTA */}
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-orange-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-orange-600 active:scale-95"
        >
          Continue Shopping
        </Link>

        {/* Secondary CTA */}
        {!user_detail && (
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 active:scale-95"
          >
            Login / Sign Up
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmtpyWishlist;
