import { useState } from "react";
import Image from "next/image";

// types
import type { FC } from "react";
import type IVariant from "@/types/variant";
import type IProduct from "@/types/product";
import type { IMediaGroup } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";
// icons
import { Heart } from "lucide-react";

// local component
import Badge from "@/components/product/badge.component";

// helpers
import clsx from "clsx";
import { generateSlug, getStockStatus } from "@/helpers/product.helper";
import { capitalizeValue } from "@/helpers/common.helper";

type IProps = {
  product: IProduct;
  variant: IVariant;
  media_group: IMediaGroup;
};

const ProductGallary: FC<IProps> = ({
  product: { title, brand, product_medias },
  variant: { variant_attribute_values, variant_inventory },
  media_group,
}) => {
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const [selected_thumbnail_index, setSelectedThumbnailIndex] =
    useState<number>(0);
  let variant_medias = variant_attribute_values
    .filter(({ attribute }) => attribute.is_visual)
    .flatMap(({ attribute, value }) => {
      const medias = media_group[attribute.id as number][value.toLowerCase()];
      return medias;
    });
  variant_medias = !!variant_medias.length
    ? variant_medias
    : product_medias.map(({ media }) => media);
  const stock_status = getStockStatus(variant_inventory);
  return (
    <>
      <div className="relative hidden space-y-4 lg:block">
        {/* Top Badges and Wishlist */}
        {/* <div className="flex items-start justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={clsx(
                stock_status == "in_stock" && "bg-green-600 text-white",
                stock_status == "low_stock" && "bg-amber-500 text-white",
                stock_status == "out_of_stock" && "bg-red-600 text-white",
              )}
            >
              {stock_status
                .split("_")
                .map((word) => capitalizeValue(word))
                .join(" ")}
            </Badge>
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
        </div> */}

        {/* Main Product View */}
        <div className="flex flex-col gap-9 lg:flex-row">
          {/* Thumbnail Gallery */}
          <div className="order-2 flex gap-3 overflow-x-auto pb-2 lg:order-1 lg:flex-col lg:overflow-x-visible lg:pb-0">
            {variant_medias.map((media, index) => (
              <button
                key={`product-gallary-${index}`}
                className={clsx(
                  "relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-md border transition-colors hover:border-orange-500",
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
          <div className="relative order-1 flex flex-1 flex-col gap-7">
            <div className="relative flex gap-6">
              {/* LEFT - Normal Image */}
              <div
                className="relative aspect-square w-120 cursor-crosshair overflow-hidden rounded-md"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={(e) => {
                  const { left, top, width, height } =
                    e.currentTarget.getBoundingClientRect();

                  const x = ((e.clientX - left) / width) * 100;
                  const y = ((e.clientY - top) / height) * 100;

                  setZoomPosition({ x, y });
                }}
              >
                <Image
                  fill
                  src={variant_medias[selected_thumbnail_index].url}
                  className="object-contain object-center"
                  alt={`${brand}-${generateSlug(title)}-${variant_attribute_values
                    .filter(({ attribute }) => attribute.is_visual)
                    .map(({ value }) => value)
                    .join("-")}-image-${selected_thumbnail_index}`}
                  priority={true}
                />
              </div>

              {/* RIGHT - Zoom Panel */}
              {showZoom && (
                <div className="absolute -right-4 z-100 hidden aspect-square w-120 translate-x-full overflow-hidden rounded-md shadow-lg lg:block">
                  <div
                    className="h-full w-full bg-cover bg-no-repeat"
                    style={{
                      backgroundImage: `url(${variant_medias[selected_thumbnail_index].url})`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundSize: "300%",
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button className="w-full rounded-md bg-orange-500 py-2.5 text-white">
                Add to Cart
              </button>
              <button className="w-full rounded-md border border-orange-500 bg-white py-2.5 text-orange-500">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductGallary;
