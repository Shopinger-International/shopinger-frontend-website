import Link from "next/link";
import type { FC } from "react";

import useCategories from "@/hooks/axios/common/use-categories";

const FooterCategories: FC = () => {
  const { data: categories = [] } = useCategories(true, "main");
  const linked_categories = categories.filter(({ slug }) => slug);

  if (linked_categories.length === 0) {
    return null;
  }

  return (
    <section className="max-w-8xl mx-auto mb-8 border-t border-orange-200/80 px-4 pt-6 lg:px-12">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-background-foreground font-semibold uppercase">
          Categories
        </h2>
        <Link
          href="/categories"
          className="text-brand shrink-0 font-semibold transition-opacity hover:opacity-80"
        >
          See all
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {linked_categories.map(({ id, name, slug }) => (
          <li key={id} className="min-w-0">
            <Link
              href={`/categories/${slug}`}
              className="text-background-foreground/75 hover:text-brand font-medium break-words transition-colors"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FooterCategories;
