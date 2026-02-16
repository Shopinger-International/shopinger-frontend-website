import { useState } from "react";
import Image from "next/image";

// types
import type { FC } from "react";
import type IVariant from "@/types/variant";
import type IProduct from "@/types/product";
import type { IMediaGroup } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";
import type IMedia from "@/types/media";
// icons
import { Heart } from "lucide-react";

// local component
import Badge from "@/components/product/badge.component";

// helpers
import clsx from "clsx";
import { generateSlug } from "@/helpers/product.helper";

type IProps = {
  product: IProduct;
  variant: IVariant;
  media_group: IMediaGroup;
};

const ProductGallary: FC<IProps> = ({
  product: { title, brand },
  variant: { variant_attribute_values },
  media_group,
}) => {
  const [selected_thumbnail_index, setSelectedThumbnailIndex] =
    useState<number>(0);
  const variant_medias = variant_attribute_values
    .filter(({ attribute }) => attribute.is_visual)
    .flatMap(({ attribute, value }) => {
      const medias = media_group[attribute.id as number][value];
      return medias;
    });
  return (
    <>
      <div className="relative space-y-4">
        {/* Top Badges and Wishlist */}
        <div className="flex items-start justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-lime-400 text-white">In Stock</Badge>
            <Badge className="bg-orange-200 text-orange-500">
              Fast Delivery
            </Badge>
          </div>
          <button
            className="group flex items-center justify-center rounded-sm border border-orange-500 p-1.5 transition-colors hover:bg-orange-500"
            aria-label="Add to wishlist"
          >
            <Heart
              className="size-4 text-orange-500 group-hover:text-white"
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Main Product View */}
        <div className="flex flex-col gap-9 lg:flex-row">
          {/* Thumbnail Gallery */}
          <div className="order-2 flex gap-3 overflow-x-auto pb-2 lg:order-1 lg:flex-col lg:overflow-x-visible lg:pb-0">
            {variant_medias.map((media, index) => (
              <button
                key={`product-gallary-${index}`}
                className={clsx(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-md border transition-colors hover:border-orange-500",
                  index == selected_thumbnail_index
                    ? "border-orange-500"
                    : "border-neutral-300",
                )}
                onClick={() => setSelectedThumbnailIndex(index)}
              >
                <Image
                  src={media.url}
                  fill={true}
                  className="object-contain"
                  alt={`${brand}-${generateSlug(title)}-${variant_attribute_values
                    .filter(({ attribute }) => attribute.is_visual)
                    .map(({ value }) => value)
                    .join("-")}-image-${index}`}
                />
              </button>
            ))}
          </div>

          {/* Main Image Container */}
          <div className="relative order-1 flex-1">
            <div className="relative aspect-3/4 w-120 overflow-hidden rounded-md">
              <Image
                fill={true}
                src={variant_medias[selected_thumbnail_index].url}
                alt={`${brand}-${generateSlug(title)}-${variant_attribute_values
                  .filter(({ attribute }) => attribute.is_visual)
                  .map(({ value }) => value)
                  .join("-")}-image-${selected_thumbnail_index}`}
                className="object-contain object-top-left"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductGallary;
