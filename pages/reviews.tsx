import Head from "next/head";
import { useState } from "react";
// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";
import type { IProductReviewsPageType } from "@/hooks/axios/review/use-get-my-reviews.hook";

// layout
import MainLayout from "@/components/layout/main-layout.component";
import ReviewModal from "@/components/common/review/review-modal.component";

// components
import UserReview from "@/components/review/user-review.component";
import EmptyReviews from "@/components/review/empty-review.component";

// hooks
import useGetMyReviews from "@/hooks/axios/review/use-get-my-reviews.hook";

const Reviews: NextPageWithLayout = () => {
  const [review_modal_state, setReviewModalState] = useState<{
    open: boolean;
    review: IProductReviewsPageType["reviews"][0] | null;
  }>({
    open: false,
    review: null,
  });
  const { data } = useGetMyReviews({
    limit: 10,
  });

  const user_reviews = data?.pages.reduce<IProductReviewsPageType["reviews"]>(
    (acc, { reviews }) => {
      return [...acc, ...reviews];
    },
    [],
  );
  return (
    <>
      <Head>
        <title>My Reviews | Shopinger</title>
        <meta
          name="description"
          content="View and manage the reviews you've shared for products purchased on Shopinger."
          key="desc"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      {review_modal_state.open && review_modal_state.review && (
        <ReviewModal
          order_id={review_modal_state.review.order_id}
          product_id={review_modal_state.review.product_id}
          variant_id={review_modal_state.review.variant_id}
          order_item_id={review_modal_state.review.order_item_id}
          product_title={review_modal_state.review.product_title}
          product_description={review_modal_state.review.product_description}
          product_media_url={review_modal_state.review.product_media_url}
          review={review_modal_state.review}
          is_open={review_modal_state.open}
          onClose={() =>
            setReviewModalState({
              open: false,
              review: null,
            })
          }
        />
      )}
      <section className="w-full bg-gray-50 py-4">
        <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              My Reviews
            </h1>
          </div>
          <div className="space-y-4">
            {user_reviews?.length ? (
              user_reviews.map((review) => {
                return (
                  <UserReview
                    key={review.id}
                    {...review}
                    onEditHandler={() => {
                      setReviewModalState({
                        open: true,
                        review,
                      });
                    }}
                  />
                );
              })
            ) : (
              <EmptyReviews />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Reviews;

Reviews.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
