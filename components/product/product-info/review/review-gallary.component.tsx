import { useState } from "react";
import type { FC } from "react";

const images = [
  "https://readymadeui.com/images/gallery-img-1.webp",
  "https://readymadeui.com/images/gallery-img-2.webp",
  "https://readymadeui.com/images/gallery-img-3.webp",
  "https://readymadeui.com/images/gallery-img-4.webp",
  "https://readymadeui.com/images/gallery-img-5.webp",
  "https://readymadeui.com/images/gallery-img-5.webp",
  "https://readymadeui.com/images/gallery-img-5.webp",
];

const ReviewGallary: FC = () => {
  return (
    <>
      {/* Gallery */}
      <div className="mx-auto mb-6">
        <div className="grid gap-3 md:grid-cols-2">
          {/* Main Image */}
          <div className="group relative aspect-5/4 w-full cursor-pointer overflow-hidden rounded-lg">
            <img
              src={images[0]}
              className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
          </div>

          {/* Side Grid */}
          <div className="grid grid-cols-2 gap-3">
            {images.slice(1, 5).map((img, i) => (
              <div
                key={i}
                className="group relative aspect-5/4 w-full cursor-pointer overflow-hidden rounded-lg"
              >
                <img
                  src={img}
                  className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />

                {/* "+ more" indicator */}
                {i === 3 && images.length > 5 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-lg font-semibold text-white">
                    +{images.length - 5} more
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewGallary;
