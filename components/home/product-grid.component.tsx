import type { FC } from "react";
import Link from "next/link";
import Image from "next/image";

// types
import type { IProductRecommendation } from "@/hooks/axios/home/use-feed.hook";

// helpers
import { generateSlug } from "@/helpers/product.helper";

type IProps = {
  title: string;
  products: Array<IProductRecommendation>;
};

const ProductGrid: FC<IProps> = ({ title, products }) => {
  return (
    <SectionBlock
      title={title}
      viewAllHref="/recent"
      products={products.map(({ product_id, variant_id, title, media_url }) => {
        return {
          href: `/${generateSlug(title)}/p/${product_id}/${variant_id}`,
          src: media_url,
          alt: "Product",
        };
      })}
    />
  );
};

export default ProductGrid;

type Product = {
  href: string;
  src: string;
  alt: string;
};

type SectionBlockProps = {
  title: string;
  timer?: string;
  viewAllHref: string;
  products: Product[];
};

const SectionBlock: FC<SectionBlockProps> = ({
  title,
  timer,
  viewAllHref,
  products,
}) => {
  return (
    <div className="space-y-4 rounded-lg border border-gray-300 bg-gray-100 p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-md font-semibold text-gray-900">
          {title}
          {timer && <span className="ml-2 text-orange-500">{timer}</span>}
        </h2>

        <Link
          href={viewAllHref}
          className="text-sm font-semibold text-orange-500 hover:underline md:text-base"
        >
          View All
        </Link>
      </div>

      {/* 2 × 2 Grid */}
      <div className="grid grid-cols-3 gap-4">
        {products.slice(0, 6).map(({ href, src, alt }) => (
          <Link
            key={href}
            href={href}
            className="relative aspect-square overflow-hidden rounded-xl border border-gray-300 hover:opacity-95"
          >
            <Image src={src} alt={alt} fill className="object-cover" />
          </Link>
        ))}
      </div>
    </div>
  );
};
