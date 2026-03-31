// types
import type { FC } from "react";

// local components
import ReviewGallary from "@/components/product/product-info/review/review-gallary.component";

const DUMMY_REVIEWS = [
  {
    id: "1",
    user_name: "Amit Sharma",
    rating: 5,
    title: "Excellent product",
    description: "Really खुश with the quality. Totally worth the price.",
    created_at: "2025-03-10",
  },
  {
    id: "2",
    user_name: "Priya Verma",
    rating: 4,
    title: "Very good but pricey",
    description: "Product is great but a bit expensive compared to others.",
    created_at: "2025-03-15",
  },
  {
    id: "3",
    user_name: "Rahul Singh",
    rating: 3,
    title: "Average experience",
    description: "It works fine but I expected better build quality.",
    created_at: "2025-03-20",
  },
];

const ProductReview: FC = () => {
  return (
    <section className="bg-white py-3">
      <ReviewGallary />
      <div className="space-y-6">
        {DUMMY_REVIEWS.map((review, index) => (
          <div
            key={review.id}
            className={
              index !== DUMMY_REVIEWS.length - 1
                ? "border-b border-gray-100 pb-6"
                : ""
            }
          >
            {/* USER INFO */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-600">
                {review.user_name.charAt(0)}
              </div>

              <div>
                <p className="font-medium text-gray-900">{review.user_name}</p>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < review.rating
                            ? "text-orange-500"
                            : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <span>•</span>

                  <span>
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* TITLE */}
            <p className="mt-3 font-semibold text-gray-900">{review.title}</p>

            {/* DESCRIPTION */}
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              {review.description}
            </p>

            {/* ACTIONS */}
            <div className="mt-3 flex items-center gap-4 text-sm">
              <button className="text-orange-500 hover:underline">
                Helpful
              </button>
              <button className="text-orange-500 hover:underline">
                Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default ProductReview;
