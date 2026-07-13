import Link from "next/link";
import Image from "next/image";

// types
import type { FC } from "react";
import type { IProductRecommendation } from "@/hooks/axios/home/use-feed.hook";

// helpers
import { generateSlug } from "@/helpers/product.helper";

type IProps = {
  title: string;
  products: Array<IProductRecommendation>;
  view_all_href: string;
};

const ProductGrid: FC<IProps> = ({ title, products, view_all_href }) => {
  const formatted_products = products.map(
    ({ product_id, variant_id, title, media_url }) => ({
      href: `/${generateSlug(title)}/p/${product_id}/${variant_id}`,
      title,
      src: media_url,
      alt: "Product",
    }),
  );
  return (
    <section
      aria-labelledby={`product-grid-${title}`}
      className="space-y-3 rounded-xl border border-gray-300 p-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          id={`product-grid-${title}`}
          className="text-md font-semibold text-gray-900"
        >
          {title}
        </h2>

        <Link
          href={view_all_href}
          title={`View all ${title}`}
          aria-label={`View all ${title}`}
          className="text-sm font-semibold text-orange-500 hover:underline md:text-base"
        >
          View All
        </Link>
      </div>
      <ul className="grid grid-cols-3 gap-4">
        {formatted_products
          .slice(0, 6)
          .map(({ href, src, alt, title }, index) => (
            <li
              key={`product-image-${index}`}
              className="aspect-square overflow-hidden hover:opacity-95"
            >
              <Link
                title={`View ${title}`}
                href={href}
                aria-label={`View ${title}`}
                className="relative inline-block h-full w-full"
              >
                <Image
                  sizes="(max-width: 640px) 300px, 200px"
                  src={src}
                  alt={`${title} product image`}
                  fill
                  className="object-cover"
                />
                <h3 className="sr-only">{title}</h3>
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
};

export default ProductGrid;
