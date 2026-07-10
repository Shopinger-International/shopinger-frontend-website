import { useState } from "react";
import Image from "next/image";

// types
import type { FC } from "react";
import type { IVariantMediaWithTitle } from "@/hoc/product/with-product-gallery-functionality.hoc";

// hoc
import withProductGalleryFunctionality from "@/hoc/product/with-product-gallery-functionality.hoc";

// local components
import ProductGalleryDialog from "@/components/product/product-gallary/product-gallary-dialog.component";

// icons
import { Heart } from "lucide-react";

// hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useIsWishlisted from "@/hooks/axios/wishlist/use-is-wishlisted";
import useAddToWishlistMutation from "@/hooks/axios/wishlist/use-add-to-wishlist-mutation.hook";
import useRemoveFromWishlistMutation from "@/hooks/axios/wishlist/use-remove-from-wishlist-mutation.hook";

// helpers
import clsx from "clsx";

// events
import addedToWishlistEvent from "@/analytics/events/added-to-wishlist.event";
import removedFromWishlistEvent from "@/analytics/events/removed-from-wishlist.event";

// const
import { ANALYTICS_SOURCE_TYPE } from "@/constants/analytics.constant";

type IProps = {
  product_id: number;
  variant_id: number;
  sub_sub_category_id: number;
  variant_medias_with_title: IVariantMediaWithTitle[];
  product_title: string;
};

const THUMBNAIL_LIMIT = 5;

const ProductGallary: FC<IProps> = ({
  product_id,
  variant_id,
  sub_sub_category_id,
  variant_medias_with_title,
  product_title,
}) => {
  const { data: user_details } = useUserDetails();
  const user_id = user_details?.id;
  const add_to_wishlist_mutation = useAddToWishlistMutation();
  const remove_from_wishlist_mutation = useRemoveFromWishlistMutation();
  const { data: wishlist_data } = useIsWishlisted({ variant_id });
  const [show_zoom, setShowZoom] = useState(false);
  const [zoom_position, setZoomPosition] = useState({ x: 0, y: 0 });
  const [show_full_gallary, setShowFullGallary] = useState(false);

  const [selected_thumbnail_index, setSelectedThumbnailIndex] =
    useState<number>(0);
  return (
    <>
      <ProductGalleryDialog
        product_title={product_title}
        open={show_full_gallary}
        handleClose={() => setShowFullGallary(false)}
        variant_medias_with_title={variant_medias_with_title}
        selected_index={THUMBNAIL_LIMIT}
      />
      <section
        className="z-5 hidden space-y-4 pb-4 lg:sticky lg:top-(--header-height) lg:block"
        aria-labelledby="product-gallery-heading"
      >
        <h2 id="product-gallery-heading" className="sr-only">
          Product images
        </h2>
        {/* Main Product View */}
        <div className="flex flex-col gap-9 lg:flex-row">
          {/* Thumbnail Gallery */}
          <div className="order-2 flex gap-3 overflow-x-auto pb-2 lg:order-1 lg:flex-col lg:overflow-x-visible lg:pb-0">
            {variant_medias_with_title
              .slice(0, THUMBNAIL_LIMIT)
              .map(({ media, image_title }, index) => (
                <button
                  key={`product-gallary-${index}`}
                  aria-current={
                    index === selected_thumbnail_index ? "true" : undefined
                  }
                  className={clsx(
                    "relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-md border transition-colors hover:border-orange-500",
                    index == selected_thumbnail_index
                      ? "border-orange-500"
                      : "border-neutral-300",
                  )}
                  onClick={() => setSelectedThumbnailIndex(index)}
                  aria-label={`Show ${image_title}`}
                >
                  <Image
                    sizes="80px"
                    src={media.url}
                    fill={true}
                    className="object-cover object-top"
                    alt={image_title}
                  />
                </button>
              ))}
            {variant_medias_with_title.length > THUMBNAIL_LIMIT && (
              <button
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-neutral-300 transition hover:border-orange-500"
                onClick={() => setShowFullGallary(true)}
              >
                <Image
                  src={variant_medias_with_title[THUMBNAIL_LIMIT].media.url}
                  alt="See all images"
                  fill
                  sizes="80px"
                  className="object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-semibold text-white">
                  +{variant_medias_with_title.length - THUMBNAIL_LIMIT}
                </div>
              </button>
            )}
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
                <button
                  type="button"
                  aria-label={
                    wishlist_data?.is_wishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  title={
                    wishlist_data?.is_wishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  className="absolute top-0 right-0 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white"
                  disabled={
                    add_to_wishlist_mutation.isPending ||
                    remove_from_wishlist_mutation.isPending
                  }
                  onClick={() => {
                    wishlist_data?.is_wishlisted
                      ? remove_from_wishlist_mutation.mutate(
                          { variant_id },
                          {
                            onSuccess() {
                              removedFromWishlistEvent({
                                user_id,
                                product_id,
                                variant_id,
                                category_id: sub_sub_category_id,
                                category_type: "SUB_SUB",
                                source: ANALYTICS_SOURCE_TYPE.PRODUCT_DETAILS,
                              });
                            },
                          },
                        )
                      : add_to_wishlist_mutation.mutate(
                          { variant_id },
                          {
                            onSuccess() {
                              addedToWishlistEvent({
                                user_id,
                                product_id,
                                variant_id,
                                category_id: sub_sub_category_id,
                                category_type: "SUB_SUB",
                                source: ANALYTICS_SOURCE_TYPE.PRODUCT_DETAILS,
                              });
                            },
                          },
                        );
                  }}
                >
                  <Heart
                    aria-hidden={true}
                    className={clsx(
                      "size-6 text-orange-500",
                      wishlist_data?.is_wishlisted && "fill-orange-500",
                    )}
                    strokeWidth={2}
                  />
                </button>
                <Image
                  sizes="512px"
                  fill
                  src={
                    variant_medias_with_title[selected_thumbnail_index].media
                      .url
                  }
                  className="object-contain object-center"
                  alt={`${product_title} ${
                    variant_medias_with_title[selected_thumbnail_index]
                      .image_title
                  }`}
                  priority={selected_thumbnail_index == 0}
                />
              </div>

              {/* RIGHT - Zoom Panel */}
              {show_zoom && (
                <div
                  className="absolute -right-4 z-100 hidden aspect-square w-120 translate-x-full overflow-hidden rounded-md shadow-lg lg:block"
                  aria-hidden={true}
                >
                  <div
                    className="h-full w-full bg-cover bg-no-repeat"
                    style={{
                      backgroundImage: `url(${variant_medias_with_title[selected_thumbnail_index].media.url})`,
                      backgroundPosition: `${zoom_position.x}% ${zoom_position.y}%`,
                      backgroundSize: "300%",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default withProductGalleryFunctionality<
  Omit<
    IProps,
    | "variant_medias_with_title"
    | "product_id"
    | "variant_id"
    | "sub_sub_category_id"
  >
>(ProductGallary);
