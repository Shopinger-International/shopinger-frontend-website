import Link from "next/link";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

import MainLayout from "@/components/layout/main-layout.component";
import Seo from "@/components/common/seo";
import useCategories from "@/hooks/axios/common/use-categories";
import FooterStateProvider from "@/provider/footer-state-provider";

const CategoriesPage: NextPageWithLayout = () => {
  const { data: categories = [] } = useCategories(true, "sub");
  const page_url = `${process.env.NEXT_PUBLIC_BASE_URL}/categories`;
  const is_prod = process.env.NODE_ENV === "production";
  const description =
    "Browse Shopinger categories and subcategories. Explore products across our available shopping categories and find what you need.";

  return (
    <>
      <Seo
        title="Shop by Category | Shopinger"
        description={description}
        url={page_url}
        image={`${process.env.NEXT_PUBLIC_CDN_URL}/uploads/assets/dark-mobile-logo.png`}
        is_prod={is_prod}
      />
      <main className="min-h-screen w-full px-4 pb-12">
        <div className="max-w-8xl mx-auto">
          <p className="mb-8 text-sm text-gray-600 sm:text-base">
            Explore our product categories and browse their subcategories.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories
              .filter(({ slug }) => slug)
              .map(({ id, name, slug, sub_categories }) => (
                <section
                  key={id}
                  className="rounded-lg border border-orange-200/80 p-5"
                >
                  <h2 className="mb-3 text-lg font-semibold text-gray-900">
                    <Link
                      href={`/categories/${slug}`}
                      className="hover:text-brand transition-colors"
                    >
                      {name}
                    </Link>
                  </h2>
                  {sub_categories?.length > 0 && (
                    <ul className="space-y-2 border-t border-orange-100 pt-3">
                      {sub_categories
                        .filter(
                          ({ slug: sub_category_slug }) => sub_category_slug,
                        )
                        .map((sub_category) => (
                          <li key={sub_category.id}>
                            <Link
                              href={`/categories/${slug}/${sub_category.slug}`}
                              className="text-background-foreground/75 hover:text-brand text-sm font-medium transition-colors"
                            >
                              {sub_category.name}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  )}
                </section>
              ))}
          </div>
        </div>
      </main>
    </>
  );
};

CategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <FooterStateProvider default_show={false}>
      <MainLayout>{page}</MainLayout>
    </FooterStateProvider>
  );
};

export default CategoriesPage;
