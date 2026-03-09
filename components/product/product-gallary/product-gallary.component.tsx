import { useState } from "react";
import Image from "next/image";

// types
import type { FC } from "react";
import type { IVariantMediaWithTitle } from "@/hoc/product/with-product-gallery-functionality.hoc";

// hoc
import withProductGalleryFunctionality from "@/hoc/product/with-product-gallery-functionality.hoc";

// helpers
import clsx from "clsx";

type IProps = {
  variant_medias_with_title: IVariantMediaWithTitle[];
};

const ProductGallary: FC<IProps> = ({ variant_medias_with_title }) => {
  const [showZoom, setShowZoom] = useState(false);
  const [zoom_position, setZoomPosition] = useState({ x: 0, y: 0 });

  const [selected_thumbnail_index, setSelectedThumbnailIndex] =
    useState<number>(0);
  return (
    <>
      <section className="z-5 hidden space-y-4 lg:sticky lg:top-(--header-height) lg:block pb-4">
        {/* Main Product View */}
        <div className="flex flex-col gap-9 lg:flex-row">
          {/* Thumbnail Gallery */}
          <div className="order-2 flex gap-3 overflow-x-auto pb-2 lg:order-1 lg:flex-col lg:overflow-x-visible lg:pb-0">
            {variant_medias_with_title.map(({ media, image_title }, index) => (
              <button
                key={`product-gallary-${index}`}
                className={clsx(
                  "relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-md border transition-colors hover:border-orange-500",
                  index == selected_thumbnail_index
                    ? "border-orange-500"
                    : "border-neutral-300",
                )}
                onClick={() => setSelectedThumbnailIndex(index)}
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
                  sizes="512px"
                  fill
                  loading={"eager"}
                  src={
                    variant_medias_with_title[selected_thumbnail_index].media
                      .url
                  }
                  className="object-contain object-center"
                  alt={
                    variant_medias_with_title[selected_thumbnail_index]
                      .image_title
                  }
                  priority={true}
                  quality={75}
                />
              </div>

              {/* RIGHT - Zoom Panel */}
              {showZoom && (
                <div className="absolute -right-4 z-100 hidden aspect-square w-120 translate-x-full overflow-hidden rounded-md shadow-lg lg:block">
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

export default withProductGalleryFunctionality(ProductGallary);
