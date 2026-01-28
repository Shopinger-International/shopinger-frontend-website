import type { FC } from "react";
import Link from "next/link";
import Image from "next/image";

const SaleLiveSection: FC = () => {
  return (
    <section>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Sale Live */}
          <SectionBlock
            title="Sale Live"
            timer="01:25:56"
            viewAllHref="/grocery"
            products={[
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
            ]}
          />

          {/* Recently Viewed */}
          <SectionBlock
            title="Recently Viewed"
            viewAllHref="/recent"
            products={[
              {
                href: "/5",
                src: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                alt: "Product 5",
              },
              {
                href: "/6",
                src: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
                alt: "Product 6",
              },
              {
                href: "/7",
                src: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
                alt: "Product 7",
              },
              {
                href: "/8",
                src: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
                alt: "Product 8",
              },

              {
                href: "/8",
                src: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=m3wxmja3fdb8mhxzzwfyy2h8ohx8d29tzw4lmjbmyxnoaw9ufgvufdb8fdb8fhww",
                alt: "product 8",
              },

              {
                href: "/8",
                src: "https://images.unsplash.com/photo-1552874869-5c39ec9288dc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdvbWVuJTIwZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
                alt: "product 8",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default SaleLiveSection;

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
    <div className="space-y-4 border border-gray-300 p-3 rounded-lg bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-md font-semibold text-gray-900">
          {title}
          {timer && <span className="ml-2 text-orange-500">{timer}</span>}
        </h2>

        <Link
          href={viewAllHref}
          className="text-md font-semibold text-orange-500 hover:underline"
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
