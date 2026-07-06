import Link from "next/link";
// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";
import type IReview from "@/types/review";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// components
import UserReview from "@/components/review/user-review.component";

// hooks
import useGetMyReviews from "@/hooks/axios/review/use-get-my-reviews.hook";

// icons
import { MessageSquareText } from "lucide-react";

const EmptyReviews = () => {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <MessageSquareText className="h-8 w-8 text-orange-500" />
      </div>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">
        You haven't written any reviews yet
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">
        Share your experience with the products you've purchased to help other
        customers make informed decisions.
      </p>

      <Link
        href="/"
        className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
      >
        Browse Products
      </Link>
    </div>
  );
};

const Reviews: NextPageWithLayout = () => {
  const { data } = useGetMyReviews({
    limit: 10,
  });

  const user_reviews = data?.pages.reduce<IReview[]>((acc, { reviews }) => {
    return [...acc, ...reviews];
  }, []);
  console.log("value of reviews", user_reviews);
  return (
    <section className="min-h-screen w-full py-4">
      <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900 sm:text-2xl">
            My Reviews
          </h1>
        </div>
        <div className="space-y-4">
          {user_reviews?.length ? (
            user_reviews.map(
              ({
                id: review_id,
                title,
                comment,
                rating,
                created_at,
                review_medias,
                helpful_count,
              }) => (
                <UserReview
                  key={review_id}
                  title={title}
                  comment={comment}
                  rating={rating}
                  created_at={created_at}
                  medias={review_medias.map(({ media }) => media)}
                  helpful_count={helpful_count}
                />
              ),
            )
          ) : (
            <EmptyReviews />
          )}
        </div>
      </div>
    </section>
  );
};

export default Reviews;

Reviews.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
