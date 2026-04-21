// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import RatingSummary from "@/components/review/rating-summary.component";
import ProductReview from "@/components/review/product-review.component";

export const dummy_reviews = [
  {
    id: 1,
    rating: 5,
    title: "Absolutely worth it",
    text: "Performance is super smooth and battery backup easily lasts a full day even with heavy usage. Camera quality is also impressive for this price range.",
    is_verified: true,
    variant: { color: "Black", storage: "128GB" },
    images: [
      "https://picsum.photos/200?random=11",
      "https://picsum.photos/200?random=12",
    ],
  },
  {
    id: 2,
    rating: 4,
    title: "Good but not perfect",
    text: "Overall a solid device. Slight heating issue during gaming but manageable. Display is excellent.",
    is_verified: true,
    variant: { color: "Blue", storage: "256GB" },
    images: [],
  },
  {
    id: 3,
    rating: 5,
    title: "Mind-blowing purchase",
    text: "Honestly exceeded my expectations. Everything feels premium and fast. Worth every rupee.",
    is_verified: true,
    variant: { color: "Black", storage: "256GB" },
    images: ["https://picsum.photos/200?random=21"],
  },
  {
    id: 4,
    rating: 3,
    title: "Average experience",
    text: "Not bad, not great. Camera is okay but battery drains faster than expected.",
    is_verified: false,
    variant: { color: "Green", storage: "128GB" },
    images: [],
  },
  {
    id: 5,
    rating: 4,
    title: "Value for money",
    text: "Good performance in this price segment. UI is smooth and responsive.",
    is_verified: true,
    variant: { color: "Silver", storage: "64GB" },
    images: [
      "https://picsum.photos/200?random=31",
      "https://picsum.photos/200?random=32",
      "https://picsum.photos/200?random=33",
    ],
  },
  {
    id: 6,
    rating: 2,
    title: "Disappointed",
    text: "Expected better build quality. Feels slightly cheap and laggy under load.",
    is_verified: false,
    variant: { color: "Black", storage: "128GB" },
    images: [],
  },
  {
    id: 7,
    rating: 5,
    title: "Excellent camera performance",
    text: "Camera is the highlight here. Night mode shots are surprisingly good.",
    is_verified: true,
    variant: { color: "Blue", storage: "256GB" },
    images: ["https://picsum.photos/200?random=41"],
  },
  {
    id: 8,
    rating: 4,
    title: "Solid daily driver",
    text: "Works perfectly for everyday use. No major complaints so far.",
    is_verified: true,
    variant: { color: "Gray", storage: "128GB" },
    images: [],
  },
];

const Reviews: NextPageWithLayout = () => {
  return (
    <section className="w-full bg-white py-6">
      <div className="mx-auto mt-(--header-height) max-w-5xl space-y-6 px-4">
        {/* Rating Summary */}
        <RatingSummary />

        {/* Photo Grid */}
        <div className="flex items-center gap-4 overflow-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <img
              key={i}
              src={`https://picsum.photos/200?random=${i}`}
              className="size-40 rounded object-cover"
            />
          ))}
        </div>

        <div className="flex gap-3 text-sm">
          {["Most Helpful", "Latest", "Positive", "Negative"].map((item) => (
            <button
              key={item}
              className="rounded-full border border-orange-500 px-3 py-1 font-semibold text-orange-500"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div>
          {dummy_reviews.map((review) => (
            <ProductReview review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;

Reviews.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
