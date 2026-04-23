import { useState } from "react";
import Head from "next/head";
// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";
import type ICategoryAttributeMapping from "@/types/category-attribute-mapping";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import ProductGallary from "@/components/product/product-gallary/product-gallary.component";
import ProductInfo from "@/components/product/product-info/product-info.component";
import RelatedProducts from "@/components/product/related-products/related-products.component";
import LoginModal from "@/components/login/login-modal.component";

// icons
import { ChevronRight } from "lucide-react";

// helpers
import webAxios from "@/lib/axios/web.lib";
import {
  generateMetaDescription,
  generateSlug,
} from "@/helpers/product.helper";

// hooks
import { getMappings } from "@/hooks/axios/common/use-category-mappings.hook";
import { useProductAvailability } from "@/hooks/axios/product/use-get-product-availbility.hook";

const getProduct = async (
  product_id: number,
): Promise<{
  product: IProduct;
  category_mappings: ICategoryAttributeMapping[];
}> => {
  const {
    data: { product, category_mappings },
  } = await webAxios.get<{
    success: boolean;
    product: IProduct;
    category_mappings: ICategoryAttributeMapping[];
  }>(`/get-product/${product_id}`);
  return {
    product,
    category_mappings,
  };
};

const getAllProducts = async (): Promise<IProduct[]> => {
  const {
    data: { products },
  } = await webAxios.get<{
    success: boolean;
    products: IProduct[];
  }>(`/get-all-products`);
  return products;
};

const getRelatedProducts = async (
  product_id: number,
): Promise<{
  related_products: IProduct[];
}> => {
  const {
    data: { related_products },
  } = await webAxios.get<{
    success: boolean;
    related_products: IProduct[];
  }>(`/get-related-products/${product_id}`);
  return {
    related_products,
  };
};

type IParams = {
  product_slug: string;
  product_id: string;
  variant_id: string;
};

export type ILoginModalState = {
  open: boolean;
  action_type?: IActionType;
  onSuccess?: () => void;
};

export type IActionType = "review_upvote";

type IProps = {
  product_id: number;
  variant_id: number;
  product: IProduct;
  category_mappings: ICategoryAttributeMapping[];
  variant: IVariant;
  related_products: IProduct[];
};

const ProductPage: NextPageWithLayout<IProps> = ({
  product_id,
  variant_id,
  product,
  category_mappings,
  variant,
  related_products,
}) => {
  const [login_modal_state, setLoginModalState] = useState<ILoginModalState>({
    open: false,
  });
  const { data: availbility_data } = useProductAvailability(
    product_id,
    variant_id,
  );
  const variant_medias = variant.variant_medias.map(({ media }) => media);
  const {
    title,
    brand,
    description,
    main_category,
    sub_category,
    sub_sub_category,
  } = product;
  const product_slug = generateSlug(title);
  const updated_title =
    !brand || brand.toLocaleLowerCase() == "generic" || title.includes(brand)
      ? title
      : `${brand} ${title}`;

  const meta_description = generateMetaDescription(description);

  const visual_values = variant.variant_attribute_values
    .filter(
      ({ attribute }) =>
        category_mappings.find(
          ({ attribute: mapping_attribute }) =>
            mapping_attribute.id == attribute.id,
        )?.is_visual,
    )
    .map(({ value }) => value);
  const main_title = visual_values.length
    ? `${updated_title} in ${visual_values.join(", ")} | Shopinger`
    : `${updated_title} | Shopinger`;

  const selected_attributes = variant.variant_attribute_values.reduce<
    Record<string, any>
  >((acc, { attribute, value }) => {
    acc[attribute.code] = value;
    return acc;
  }, {});
  return (
    <>
      <Head>
        <title>{main_title}</title>
        <meta name="description" content={meta_description} key="desc" />
        <meta property="og:site_name" content="Shopinger" />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/${product_slug}/p/${product_id}/${variant_id}`}
        />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={main_title} />
        <meta property="og:description" content={meta_description} />
        <meta
          property="og:image"
          content={
            variant_medias[0]?.url ?? product.product_medias[0].media.url
          }
        />
        <meta property="og:image:alt" content={`${main_title}`} />

        {/* TWITTER OPEN GRAPH TAGS */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/${product_slug}/p/${product_id}/${variant_id}`}
        />
        <meta name="twitter:title" content={main_title} />
        <meta name="twitter:description" content={meta_description} />
        <meta
          name="twitter:image"
          content={
            variant_medias[0]?.url ?? product.product_medias[0].media.url
          }
        />
        <meta
          name="twitter:image"
          content={
            variant_medias[0]?.url ?? product.product_medias[0].media.url
          }
        />
        <meta name="twitter:site" content="@shopinger" />
        <meta name="twitter:creator" content="@shopinger" />
      </Head>
      <LoginModal
        open={login_modal_state.open}
        handleClose={() =>
          setLoginModalState({
            open: false,
          })
        }
        handleOnSuccess={() => {
          setLoginModalState({
            open: false,
          });
          login_modal_state.onSuccess?.();
        }}
      />
      <div className="-mt-2 hidden border-b border-neutral-300 pt-(--header-height) lg:block">
        <div className="mx-auto w-full px-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 py-1.5 text-xs text-gray-600">
              {[
                main_category.name,
                sub_category.name,
                sub_sub_category.name,
              ].map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="flex items-center gap-2"
                >
                  <span>{item}</span>
                  {index < 2 && <ChevronRight className="size-4" />}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-(--header-height) lg:mt-8 lg:flex-row lg:items-start lg:pt-0">
        <ProductGallary
          variant={variant}
          product={product}
          category_mappings={category_mappings}
          product_title={updated_title}
        />
        <ProductInfo
          is_product_available={!!availbility_data?.available_stock}
          product={product}
          variant={variant as IVariant}
          selected_attributes={selected_attributes}
          category_mappings={category_mappings}
          handleLoginModalState={({ open, action_type, onSuccess }) => {
            setLoginModalState({
              open,
              ...(action_type
                ? {
                    action_type,
                  }
                : {}),
              ...(onSuccess ? { onSuccess } : {}),
            });
          }}
        />
      </div>

      <RelatedProducts
        related_products={related_products}
        category_mappings={category_mappings}
      />
    </>
  );
};

export default ProductPage;

export const getStaticPaths = (async () => {
  const products = await getAllProducts();
  const paths = products.flatMap(({ id: product_id, title, variants }) => {
    const product_slug = generateSlug(title);
    return variants.map(({ id: variant_id }) => {
      return {
        params: {
          product_slug,
          product_id: String(product_id),
          variant_id: String(variant_id),
        },
      };
    });
  });
  return {
    paths,
    fallback: "blocking",
  };
}) satisfies GetStaticPaths;

export const getStaticProps = (async ({ params }) => {
  if (!params) {
    return { notFound: true };
  }

  const product_id = Number(params.product_id);
  const variant_id = Number(params.variant_id);

  if (Number.isNaN(product_id)) {
    return { notFound: true };
  }

  let { product } = await getProduct(product_id);
  let category_mappings = await getMappings(product.sub_sub_category.id);
  let { related_products } = await getRelatedProducts(product_id);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      product_id,
      variant_id,
      product,
      category_mappings,
      variant: product.variants?.find(
        (variant) => variant.id == variant_id,
      ) as IVariant,
      related_products,
    },
    revalidate: 43200, // 🔥 enable ISR
  };
}) satisfies GetStaticProps<IProps, IParams>;

ProductPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
