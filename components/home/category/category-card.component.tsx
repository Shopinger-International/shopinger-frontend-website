import Image from "next/image";
import Link from "next/link";
// type
import type { FC } from "react";
import type { ICategoryRecommendation } from "@/hooks/axios/home/use-feed.hook";

// helpers
import { generateSlug } from "@/helpers/product.helper";

// icons
import { ChevronRight } from "lucide-react";
import { title } from "process";

const CategoryCard: FC<ICategoryRecommendation> = ({
  category_name,
  category_type,
  main_category_slug,
  sub_category_slug,
  sub_sub_category_slug,
  products = [],
}) => {
  const category_url = `categories/${main_category_slug}${["SUB", "SUB_SUB"].includes(category_type) ? "/" + sub_category_slug : ""}${category_type == "SUB_SUB" ? "/" + sub_sub_category_slug : ""}`;
  const formatted_products = products.map(
    ({ product_id, variant_id, title, media_url }) => ({
      href: `/${generateSlug(title)}/p/${product_id}/${variant_id}`,
      src: media_url,
      alt: `${title} product image`,
    }),
  );
  return (
    <article className="relative w-60 overflow-hidden rounded-xl border-2 border-orange-200 bg-[url('/pattern/pattern-1.png')] p-4 lg:w-82">
      {/* Header */}
      <div className="relative mb-4 flex items-center justify-between">
        <h3 className="text-md truncate font-semibold text-orange-500 md:text-xl">
          {category_name}
        </h3>
        <Link
          href={category_url}
          className="rounded-full bg-orange-500 p-1 text-white transition-all hover:scale-110 hover:bg-orange-600"
          title={`Browse ${category_name} category`}
          aria-label={`Browse ${category_name} category`}
        >
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <ul className="mb-4 grid grid-cols-2 gap-4 md:mb-7">
        {formatted_products.slice(0, 4).map(({ href, src, alt }) => (
          <li className="aspect-square overflow-hidden rounded-lg border border-gray-300 hover:opacity-95">
            <Link key={href} href={href} className="relative inline-block w-full h-full">
              <Image
                sizes={"100px"}
                src={src}
                alt={alt}
                fill
                className="object-cover"
              />
            </Link>
          </li>
        ))}
      </ul>
      <div className="relative">
        <Link
          href={category_url}
          className="inline-block font-semibold text-orange-500 hover:underline hover:underline-offset-2 transition-colors hover:text-orange-600"
          title={`Explore ${category_name}`}
        >
          Explore All
        </Link>
      </div>
    </article>
  );
};
export default CategoryCard;
