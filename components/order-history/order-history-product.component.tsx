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
  quantity: number;
};

const OrderHistoryProduct: FC<IProps> = ({ product, variant, quantity }) => {
  const { title, id: product_id } = product;
  const { id: variant_id } = variant;
  const product_slug = generateSlug(title);
  const variant_medias = variant.variant_medias.map(({ media }) => media);
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-300 bg-gray-100 p-1">
        <Link href={`/${product_slug}/p/${product_id}/${variant_id}`}>
          <Image
            src={variant_medias[0]?.url ?? product.product_medias[0].media.url}
            alt={title}
            fill
            className="object-contain"
            sizes="80px"
          />
        </Link>
      </div>
      <div>
        <h4 className="line-clamp-1 text-sm font-medium">{title}</h4>
        <p className="mt-1 text-xs text-slate-600">Qty: {quantity}</p>
      </div>
    </div>
  );
};
export default OrderHistoryProduct;
