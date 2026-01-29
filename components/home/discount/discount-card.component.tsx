import Image from "next/image";
import Link from "next/link";
// type
import type { FC } from "react";

// icons
import { ChevronRight } from "lucide-react";

const products = [
  {
    href: "/1",
    src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1699&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Product 1",
  },
  {
    href: "/2",
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Product 2",
  },
  {
    href: "/3",
    src: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Product 3",
  },
  {
    href: "/4",
    src: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Product 4",
  },

  {
    href: "/5",
    src: "https://images.unsplash.com/photo-1686152058759-a75e01338cca?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFzaGlvbiUyMHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
    alt: "Product 5",
  },

  {
    href: "/6",
    src: "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVucyUyMGZhc2hpb258ZW58MHx8MHx8fDA%3D",
    alt: "Product 6",
  },
];

const DiscountCard: FC = () => {
  return (
    <div className="relative w-60 overflow-hidden rounded-2xl border-2 border-orange-200 p-4 lg:w-82">
      {/* Header */}
      <div className="relative mb-6 flex items-center justify-between md:mb-8">
        <h2 className="text-md font-semibold text-orange-500 md:text-2xl">
          Stationary
        </h2>
        <Link
          href="/fashion"
          className="rounded-full bg-orange-500 p-1 text-white transition-all hover:scale-110 hover:bg-orange-600"
          aria-label="View more stationary"
        >
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 md:mb-7">
        {products.slice(0, 4).map(({ href, src, alt }) => (
          <Link
            key={href}
            href={href}
            className="relative aspect-square overflow-hidden rounded-xl border border-gray-300 hover:opacity-95"
          >
            <Image src={src} alt={alt} fill className="object-cover" />
          </Link>
        ))}
      </div>
      {/* Product Grid - 2x2 */}

      {/* Explore All Link */}
      <div className="relative">
        <Link
          href="/fashion"
          className="inline-block font-semibold text-orange-500 underline underline-offset-2 transition-colors hover:text-orange-600"
        >
          Explore All
        </Link>
      </div>
    </div>
  );
};
export default DiscountCard;
