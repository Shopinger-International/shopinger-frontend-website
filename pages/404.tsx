import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// icons
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";

// hooks
import useCategories from "@/hooks/axios/common/use-categories";

const Custom404Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { data: categories = [] } = useCategories(true);
  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };
  return (
    <section className="relative mt-(--header-height) min-h-[calc(100vh-var(--header-height))] overflow-hidden bg-linear-to-b from-orange-50/40 via-white to-white">
      <div className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 py-12">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
          <ShoppingBag className="size-4" />
          Page Not Found
        </span>

        {/* Content */}
        <div className="mt-5 max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            <span className="text-red-500">Oops!</span> We couldn't find that
            page.
          </h1>


          {/* Actions */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600"
            >
              Continue Shopping
              <ArrowRight className="size-5" />
            </Link>

            <button
              onClick={() => handleGoBack()}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2 font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="size-5" />
              Go Back
            </button>
          </div>

          {/* Popular Categories */}
          <div className="mt-10 text-center">
            <p className="mb-4 text-sm font-medium text-gray-500">
              Explore Popular Categories
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.slice(0, 5).map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700 transition-colors hover:bg-orange-500 hover:text-white"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Custom404Page;

Custom404Page.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
