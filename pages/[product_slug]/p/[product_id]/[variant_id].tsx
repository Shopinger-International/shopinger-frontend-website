import { useState } from "react";
// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";
import type ICategoryAttributeMapping from "@/types/category-attribute-mapping";
import type { IReportModalState } from "@/pages/[product_slug]/p/[product_id]/reviews";
import type IUser from "@/types/user";
import type { IDisplayAreaType } from "@/types/category-attribute-mapping";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import ProductGallary from "@/components/product/product-gallary/product-gallary.component";
import ProductInfo from "@/components/product/product-info/product-info.component";
import RelatedProducts from "@/components/product/related-products/related-products.component";
import LoginModal from "@/components/login/login-modal.component";
import ReportModal from "@/components/review/report-modal.component";
import Seo from "@/components/common/seo";

// icons
import { ChevronRight } from "lucide-react";

// helpers
import webAxios from "@/lib/axios/web.lib";
import {
  generateMetaDescription,
  generateSlug,
} from "@/helpers/product.helper";
import createProductJSONLD from "@/seo/product.jsonld";

// hooks
import { getMappings } from "@/hooks/axios/common/use-category-mappings.hook";
import { useProductAvailability } from "@/hooks/axios/product/use-get-product-availbility.hook";
import { useSnackbarOffset } from "@/hooks/common/use-snackbar-offset.hook";

// analytics
import useProductViewed from "@/hooks/analytics/use-product-viewed.hook";

export const getProduct = async (
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

type IProductObject = {
  product_id: number;
  variant_id: number;
  title: string;
};
const getAllProducts = async (): Promise<Array<IProductObject>> => {
  const { data } = await webAxios.get<{
    success: boolean;
    products: Array<IProductObject>;
  }>(`/get-all-products`);
  return data.products;
};

type IParams = {
  product_slug: string;
  product_id: string;
  variant_id: string;
};
export type IActionType = "review_upvote" | "buy_intent";

export type ILoginModalState = {
  open: boolean;
  action_type?: IActionType;
  onSuccess?: (user: IUser) => void;
  onCancel?: () => void;
};

export type IFormattedCategoryMapping = {
  display_area: IDisplayAreaType[];
  display_group: string;
  display_order: number;
  unit_code: string | null;
  is_visual: boolean;
  attribute_id: number | undefined;
  attribute_code: string;
  options:
    | {
        label: string;
        value: string;
      }[]
    | undefined;
};

type IProps = {
  product_id: number;
  variant_id: number;
  product: IProduct;
  category_mappings: IFormattedCategoryMapping[];
};

const ProductPage: NextPageWithLayout<IProps> = ({
  product_id,
  variant_id,
  product,
  category_mappings,
}) => {
  useSnackbarOffset({});
  useProductViewed({
    product_id,
    variant_id,
    category_id: product.sub_sub_category_id,
    category_type: "SUB_SUB",
  });

  const is_prod = process.env.NODE_ENV == "production";
  const variant = product.variants?.find(
    (variant) => variant.id == variant_id,
  ) as IVariant;
  const [login_modal_state, setLoginModalState] = useState<ILoginModalState>({
    open: false,
  });

  const [report_modal_state, setReportModalState] = useState<IReportModalState>(
    {
      open: false,
    },
  );
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
          (mapping) => mapping.attribute_id == attribute.id,
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
  const product_json_ld = createProductJSONLD({
    title: main_title,
    description: meta_description,
    sku: variant.seller_sku ?? variant.system_sku,
    images_url: variant_medias.length
      ? variant_medias.map((media) => media.url)
      : product.product_medias.map(({ media }) => media.url),
    brand: product.brand,
    category: product.sub_sub_category.name,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${product_slug}/p/${product_id}/${variant_id}`,
    price: variant.variant_pricing.selling_price_with_commission,
    in_stock: variant.variant_inventory.stock > 0,
    manufacture: product.manufacturer_name,
  });

  const openLoginModal = () => {
    return new Promise<IUser>((resolve, reject) => {
      setLoginModalState({
        open: true,
        onSuccess: (user: IUser) => {
          resolve(user);
        },
        onCancel: () => {
          reject();
        },
      });
    });
  };
  return (
    <>
      <Seo
        title={main_title}
        description={meta_description}
        image={variant_medias[0]?.url ?? product.product_medias[0].media.url}
        url={`${process.env.NEXT_PUBLIC_BASE_URL}/${product_slug}/p/${product_id}/${variant_id}`}
        is_prod={is_prod}
        json_ld={JSON.stringify(product_json_ld)}
      />

      <LoginModal
        open={login_modal_state.open}
        handleClose={() => {
          setLoginModalState({
            open: false,
          });
          login_modal_state.onCancel?.();
        }}
        handleOnSuccess={(user) => {
          setLoginModalState({
            open: false,
          });
          login_modal_state.onSuccess?.(user);
        }}
      />
      <ReportModal
        review_id={report_modal_state.review_id as number}
        is_open={report_modal_state.open}
        onClose={() => setReportModalState({ open: false })}
        handleLogin={openLoginModal}
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
          variant_id={variant_id}
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
          handleReportModalState={({ open, review_id }) =>
            setReportModalState({
              open,
              ...(review_id
                ? {
                    review_id,
                  }
                : {}),
            })
          }
        />
      </div>

      <RelatedProducts
        product_id={product_id}
        category_mappings={category_mappings}
      />
    </>
  );
};

export default ProductPage;

export const getStaticPaths = (async () => {
  const products = await getAllProducts();
  const formatted_product = products.map(
    ({ product_id, variant_id, title }) => ({
      params: {
        product_id: String(product_id),
        variant_id: String(variant_id),
        product_slug: generateSlug(title),
      },
    }),
  );
  return {
    paths: formatted_product,
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
  const formatted_mappings = category_mappings
    .filter(
      ({ attribute, is_hidden }) =>
        attribute.status !== "deprecated" || is_hidden == false,
    )
    .map(
      ({
        display_area,
        display_group,
        display_order,
        unit_code,
        is_visual,
        attribute: { id, code, options },
      }) => ({
        display_area,
        display_group,
        display_order,
        unit_code,
        is_visual,
        attribute_id: id,
        attribute_code: code,
        options: options?.map(({ label, value }) => ({
          label,
          value,
        })),
      }),
    );

  if (!product) {
    return { notFound: true };
  }
  return {
    props: {
      product_id,
      variant_id,
      product,
      category_mappings: formatted_mappings,
    },
    revalidate: 43200, // 🔥 enable ISR
  };
}) satisfies GetStaticProps<IProps, IParams>;

ProductPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
