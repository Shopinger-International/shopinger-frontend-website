// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";

// layout
import MainLayout from "@/components/layout/main-layout.component";

type Review = {
  id: string;
  user_name: string;
  rating: number;
  title: string;
  description: string;
  created_at: string;
};

const DUMMY_REVIEWS: Review[] = [
  {
    id: "1",
    user_name: "Amit Sharma",
    rating: 5,
    title: "Excellent product",
    description: "Really happy with the quality. Totally worth the price.",
    created_at: "2026-04-18",
  },
  {
    id: "2",
    user_name: "Neha Verma",
    rating: 4,
    title: "Good but can improve",
    description: "Product is good but packaging could be better.",
    created_at: "2026-04-16",
  },
];

// ⭐ Better star system (production ready foundation)
const Stars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < rating;
        return (
          <span
            key={i}
            className={`text-sm ${filled ? "text-amber-400" : "text-gray-300"}`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const Reviews: NextPageWithLayout = () => {
  const averageRating =
    DUMMY_REVIEWS.reduce((acc, r) => acc + r.rating, 0) / DUMMY_REVIEWS.length;

  const totalReviews = DUMMY_REVIEWS.length;

  return (
    <section className="w-full bg-gray-50 py-6">
      <div className="mx-auto mt-(--header-height) max-w-5xl space-y-6 px-4">
        {/* HEADER */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">
            Customer Reviews
          </h1>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-4xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </p>

              <div>
                <Stars rating={Math.round(averageRating)} />
                <p className="mt-1 text-sm text-gray-500">
                  Based on {totalReviews} reviews
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS LIST */}
        <div className="space-y-4">
          {DUMMY_REVIEWS.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border bg-white p-5 transition hover:shadow-md"
            >
              {/* Top Row */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {review.title}
                  </h3>

                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">
                      {review.user_name}
                    </span>
                    <span>•</span>
                    <span>{formatDate(review.created_at)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <Stars rating={review.rating} />
                  <span className="mt-1 block text-xs text-gray-400">
                    {review.rating}/5
                  </span>
                </div>
              </div>

              {/* Body */}
              <p className="mt-4 text-sm leading-relaxed text-gray-700">
                {review.description}
              </p>
            </article>
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
