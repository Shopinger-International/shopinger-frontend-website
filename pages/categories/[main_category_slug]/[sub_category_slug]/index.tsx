// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";
import type { GetServerSideProps } from "next";
import type IProduct from "@/types/product";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import ProductCard from "@/components/categories/product-card.component";

// hooks
import useGetProductsByCategory from "@/hooks/axios/categories/use-get-category-product.hook";

// helpers
import { generateSlug } from "@/helpers/product.helper";

type IProps = {
  sub_category_slug: string;
};

const isNewProduct = (created_at: string | Date) => {
  const created = new Date(created_at);
  const now = new Date();

  const diffInDays =
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);

  return diffInDays <= 7;
};

const SubCategory: NextPageWithLayout<IProps> = ({ sub_category_slug }) => {
  const { data } = useGetProductsByCategory({
    slug: sub_category_slug,
    category_type: "sub",
  });

  const category_products = data?.pages.reduce<IProduct[]>(
    (acc, { products }) => {
      return [...acc, ...products];
    },
    [],
  );

  const formatted_category_products = category_products?.map((product) => {
    const { variants, title, brand, created_at, product_medias } = product;
    const updated_title =
      !brand || brand.toLocaleLowerCase() == "generic" || title.includes(brand)
        ? title
        : `${brand} ${title}`;

    const product_slug = generateSlug(product.title);
    const {
      id: variant_id,
      variant_medias,
      variant_inventory,
      variant_pricing,
    } = variants[0];
    const { mrp, selling_price_with_commission } = variant_pricing;

    const discount_percentage = Math.round(
      ((mrp - selling_price_with_commission) / mrp) * 100,
    );
    const is_new = isNewProduct(created_at);
    return {
      title: updated_title,
      src: `/${product_slug}/p/${product.id}/${variant_id}`,
      product_thumbnail: variant_medias[0]?.media ?? product_medias[0].media,
      selling_price: selling_price_with_commission,
      mrp,
      discount_percentage,
      is_new,
    };
  });
  return (
    <section className="min-h-screen w-full py-4">
      <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
        <div className="grid grid-cols-4 gap-6">
          {formatted_category_products?.map((product) => (
            <ProductCard {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubCategory;

export const getServerSideProps = (async ({ params, req }) => {
  const sub_category_slug = params?.sub_category_slug as string;
  if (!sub_category_slug) {
    return { notFound: true };
  }
  return {
    props: {
      sub_category_slug,
    },
  };
}) satisfies GetServerSideProps<IProps>;
SubCategory.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
