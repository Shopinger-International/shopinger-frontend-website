import Link from "next/link";
import Image from "next/image";
// types
import type { FC } from "react";
import type IVariant from "@/types/variant";
import type IProduct from "@/types/product";

// helpers
import { generateSlug } from "@/helpers/product.helper";

type IProps = {
  product: Omit<IProduct, "variants">;
  variant: IVariant;
  status: string;
  is_delivered: boolean;
  is_reviewed: boolean;
  quantity: number;
  handleShowReviewModal: () => void;
};

const OrderItem: FC<IProps> = ({
  product,
  variant,
  status,
  is_delivered,
  is_reviewed,
  quantity,
  handleShowReviewModal,
}) => {
  const { title, id: product_id } = product;
  const { id: variant_id, variant_attribute_values, variant_pricing } = variant;
  const product_slug = generateSlug(title);
  const formated_variant_attribute_value = variant_attribute_values.map(
    ({ attribute, value }) => {
      return {
        name: attribute.name,
        value:
          attribute.data_type === "enum"
            ? attribute.options?.find(
                ({ value: option_value }) => value == option_value,
              )?.label
            : value,
      };
    },
  );
  const variant_medias = variant.variant_medias.map(({ media }) => media);

  return (
    <div className="rounded-xl bg-white">
      <div className="flex gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gray-300 bg-gray-100">
          <Link href={`/${product_slug}/p/${product_id}/${variant_id}`}>
            <Image
              src={
                variant_medias[0]?.url ?? product.product_medias[0].media.url
              }
              alt={title}
              fill
              className="object-contain"
              sizes="80px"
            />
          </Link>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col space-y-1">
          {/* TOP */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="line-clamp-1 text-sm font-medium">{title}</h4>

            <span className={`shrink-0 text-xs font-medium text-gray-600`}>
              {status[0] + status.slice(1).toLowerCase()}
            </span>
          </div>

          {!!formated_variant_attribute_value.length && (
            <>
              <p className="text-xs font-medium text-gray-600">
                {formated_variant_attribute_value
                  .map(({ name, value }) => `${name}: ${value}`)
                  .join(", ")}
              </p>
            </>
          )}

          {/* PRICE ROW */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-900">
              ₹{variant_pricing.selling_price_with_commission} x{" "}
            </span>

            {quantity}
          </div>
          {is_delivered && (
            <div>
              <button
                className="cursor-pointer text-xs font-medium text-orange-600 hover:underline"
                onClick={() => !is_reviewed && handleShowReviewModal()}
              >
                {is_reviewed ? "View your review" : "Write a review"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default OrderItem;
