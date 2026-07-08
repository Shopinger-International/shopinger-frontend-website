import Link from "next/link";

// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// icons
import { ArrowRight } from "lucide-react";

const Custom404Page: NextPageWithLayout = () => {
  return (
    <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
      <div className="flex w-full items-center justify-center py-12">
        <div className="w-full max-w-2xl rounded-xl border border-gray-300 bg-white/80 p-8 text-center">
          <span className="inline-flex rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-700">
            Page Not Found
          </span>

          <h1 className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl">
            <span className="text-red-500">Oops!</span> We couldn't find that
            page.
          </h1>

          {/* Primary CTA */}
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-600"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="size-4 text-white" />
          </Link>
          <p className="mt-6 text-sm text-gray-600">
            Looking for something specific? Try browsing our latest collections
            or featured products.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Custom404Page;

Custom404Page.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
