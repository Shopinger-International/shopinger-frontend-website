import Head from "next/head";
// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";
import type ICategoryAttributeMapping from "@/types/category-attribute-mapping";
import type IMedia from "@/types/media";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import ProductGallary from "@/components/product/product-gallary/product-gallary.component";
import ProductInfo from "@/components/product/product-info/product-info.component";
import MobileProductInfo from "@/components/product/product-info/mobile-product-info.component";

// mobile
import MobileProductGallary from "@/components/product/product-gallary/mobile-product-gallary.component";

// icons
import { ChevronRight } from "lucide-react";

// helpers
import webAxios from "@/lib/axios/web.lib";
import {
  generateMetaDescription,
  generateSlug,
} from "@/helpers/product.helper";

const getProduct = async (
  product_id: number,
): Promise<{
  product: IProduct;
  visual_mappings: ICategoryAttributeMapping[];
}> => {
  const {
    data: { product, visual_mappings },
  } = await webAxios.get<{
    success: boolean;
    product: IProduct;
    visual_mappings: ICategoryAttributeMapping[];
  }>(`/get-product/${product_id}`);
  return {
    visual_mappings,
    product,
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

export type IMediaGroup = Record<
  number, // attribute_id
  Record<
    string, // attribute_value
    Array<IMedia>
  >
>;
type IParams = {
  product_slug: string;
  product_id: string;
  variant_id: string;
};

type IProps = {
  product: IProduct;
  variant: IVariant;
  visual_mappings: ICategoryAttributeMapping[];
};

const ProductPage: NextPageWithLayout<IProps> = ({
  product,
  variant,
  visual_mappings,
}) => {
  const {
    title,
    brand,
    description,
    main_category,
    sub_category,
    sub_sub_category,
  } = product;
  const meta_description = generateMetaDescription(description);
  console.log('value of product',product);

  const visual_variant_attribute_values = variant?.variant_attribute_values
    .filter(({ attribute }) => attribute.is_visual == true)
    .sort(({ attribute: attribute1 }, { attribute: attribute2 }) => {
      const mapping1 = visual_mappings.find(
        ({ attribute }) => attribute.id == attribute1.id,
      ) as ICategoryAttributeMapping;

      const mapping2 = visual_mappings.find(
        ({ attribute }) => attribute.id == attribute2.id,
      ) as ICategoryAttributeMapping;
      return (
        (mapping1.visual_priority as number) -
        (mapping2.visual_priority as number)
      );
    });
  const variant_visual_attribute_medias =
    product.variant_visual_attribute_medias
      .filter(
        ({ attribute_value }) =>
          attribute_value == visual_variant_attribute_values?.[0].value,
      )
      .map(({ media }) => media);

  const selected_attributes = variant.variant_attribute_values.reduce<
    Record<string, any>
  >((acc, { attribute, value }) => {
    acc[attribute.code] = value;
    return acc;
  }, {});
  const media_group =
    product.variant_visual_attribute_medias.reduce<IMediaGroup>((acc, item) => {
      const { attribute_id, attribute_value } = item;
      const updated_attribute_value = attribute_value.toLowerCase();

      if (!acc[attribute_id]) {
        acc[attribute_id] = {};
      }

      if (!acc[attribute_id][updated_attribute_value]) {
        acc[attribute_id][updated_attribute_value] = [];
      }

      acc[attribute_id][updated_attribute_value].push(item.media);

      return acc;
    }, {});

  return (
    <>
      <Head>
        <title>
          {brand} {title} -{" "}
          {variant.variant_attribute_values
            .map(
              ({ value, attribute }) =>
                attribute.options?.find(
                  ({ value: option_value }) => value == option_value,
                )?.label ?? value,
            )
            .join(", ")}{" "}
          | Shopinger
        </title>
        <meta name="description" content={meta_description} key="desc" />
      </Head>
      <div className="-mt-2 hidden border-b border-neutral-300 pt-(--header-height) lg:block">
        <div className="max-w-8xl mx-auto w-full px-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 py-1 text-xs text-gray-600">
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
      <div className="max-w-8xl mx-auto flex w-full flex-col gap-8 px-4 pt-(--header-height) lg:mt-8 lg:flex-row lg:pt-0">
        <ProductGallary
          variant={variant}
          media_group={media_group}
          product={product}
        />
        <ProductInfo
          product={product}
          variant={variant as IVariant}
          selected_attributes={selected_attributes}
          media_group={media_group}
        />
        <MobileProductInfo
          product={product}
          variant={variant as IVariant}
          selected_attributes={selected_attributes}
          media_group={media_group}
        />
      </div>
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

  let { product, visual_mappings } = await getProduct(product_id);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      product: {
        ...product,
      },
      variant: product.variants.find(
        (variant) => variant.id == variant_id,
      ) as IVariant,
      visual_mappings,
    },
    revalidate: 60, // 🔥 enable ISR
  };
}) satisfies GetStaticProps<IProps, IParams>;

ProductPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
