import Link from "next/link";
import Image from "next/image";
// types
import type { FC } from "react";
import type IVariant from "@/types/variant";
import type IProduct from "@/types/product";

// helpers
import { generateSlug } from "@/helpers/product.helper";
import clsx from "clsx";

type IProps = {
  product: Omit<IProduct, "variants">;
  variant: IVariant;
  is_delivered: boolean;
  is_reviewed: boolean;
  quantity: number;
  cancelled_quantity: number;
  handleShowReviewModal: () => void;
};

const OrderItem: FC<IProps> = ({
  product,
  variant,
  is_delivered,
  is_reviewed,
  quantity,
  cancelled_quantity,
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
  const effective_quantity = quantity - cancelled_quantity;

  return (
    <div
      className={clsx(
        "rounded-xl bg-white",
        effective_quantity == 0 && "opacity-60",
      )}
    >
      <div className="flex gap-4">
        <Link href={`/${product_slug}/p/${product_id}/${variant_id}`}>
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gray-300 bg-gray-100">
            <Image
              src={
                variant_medias[0]?.url ?? product.product_medias[0].media.url
              }
              alt={title}
              fill={true}
              className="object-contain"
              sizes="80px"
            />
          </div>
        </Link>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col space-y-1">
          <h4 className="line-clamp-1 text-sm font-medium">{title}</h4>
          {!!formated_variant_attribute_value.length && (
            <>
              <p className="text-xs font-medium text-gray-600">
                {formated_variant_attribute_value
                  .map(({ name, value }) => `${name}: ${value}`)
                  .join(", ")}
              </p>
            </>
          )}
          <div className="flex items-center gap-2 text-sm">
            {effective_quantity > 0 ? (
              <>
                <span className="font-medium text-gray-900">
                  ₹{variant_pricing.selling_price_with_commission} ×{" "}
                  {effective_quantity}
                </span>

                {cancelled_quantity > 0 && (
                  <span className="text-xs font-medium text-red-500">
                    ({cancelled_quantity} cancelled)
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm font-medium text-red-600">
                cancelled
              </span>
            )}
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
