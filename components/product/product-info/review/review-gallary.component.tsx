import Image from "next/image";
// types
import type { FC } from "react";
import type IMedia from "@/types/media";

// helpers
import clsx from "clsx";

type IProps = {
  review_medias: IMedia[];
};

const ReviewGallary: FC<IProps> = ({ review_medias }) => {
  const main_image = review_medias[0];
  const gallary_medias = review_medias.slice(1, 5);
  return (
    <>
      {/* Gallery */}
      <div className="mx-auto mb-6">
        <div className={clsx("grid gap-3 md:grid-cols-2")}>
          {/* Main Image */}
          <div className="group relative aspect-5/4 w-full cursor-pointer overflow-hidden rounded-lg border border-gray-300">
            <Image
              alt="review"
              src={main_image.url}
              fill={true}
              className="object-cover"
              sizes="160px"
            />

            <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
          </div>

          {/* Side Grid */}
          {!!gallary_medias.length && (
            <div className={clsx("grid grid-cols-2 gap-3")}>
              {gallary_medias.map((media, i) => (
                <div
                  key={i}
                  className="group relative aspect-5/4 w-full cursor-pointer overflow-hidden rounded-lg border border-gray-300"
                >
                  <Image
                    src={media.url}
                    className="object-cover"
                    fill={true}
                    sizes="120px"
                    alt="review"
                  />

                  <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />

                  {i === 3 && review_medias.length > 5 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-lg font-semibold text-white">
                      +{review_medias.length - 5} more
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewGallary;
