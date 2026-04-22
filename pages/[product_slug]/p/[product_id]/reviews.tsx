import { useEffect, useRef } from "react";
// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";
import type { GetServerSideProps } from "next";
import type IReview from "@/types/review";
import type { DehydratedState } from "@tanstack/react-query";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import RatingSummary from "@/components/review/rating-summary.component";
import ProductReview from "@/components/review/product-review.component";

// react query
import { QueryClient, dehydrate } from "@tanstack/react-query";

// api hooks
import useProductReviews from "@/hooks/axios/review/use-product-reviews.hook";

// helpers
import { getProductReviews } from "@/hooks/axios/review/use-product-reviews.hook";

type IProps = {
  product_id: number;
  dehydratedState: DehydratedState;
};

const Reviews: NextPageWithLayout<IProps> = ({ product_id }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductReviews({ productId: product_id });
  const product_reviews = data?.pages.reduce<IReview[]>((acc, { reviews }) => {
    return [...acc, ...reviews];
  }, []);
  const rating_summary = data?.pages[0].summary;
  const load_more_ref = useRef<HTMLDivElement | null>(null);

  const observer_ref = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!load_more_ref.current) return;

    if (observer_ref.current) observer_ref.current.disconnect();

    observer_ref.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer_ref.current.observe(load_more_ref.current);

    return () => observer_ref.current?.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  return (
    <section className="w-full bg-white py-4">
      <div className="mx-auto mt-(--header-height) max-w-6xl space-y-6 px-4">
        {/* Rating Summary */}
        {rating_summary && <RatingSummary {...rating_summary} />}

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
          {product_reviews?.map((review) => (
            <ProductReview {...review} />
          ))}
        </div>
        {/* Infinite scroll trigger */}
        <div ref={load_more_ref} className="h-10" />
      </div>
    </section>
  );
};

export default Reviews;

Reviews.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps = (async ({ params }) => {
  const product_id = Number(params?.product_id);

  if (!product_id || isNaN(product_id)) {
    return { notFound: true };
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["product-reviews", product_id, null, "recent"],
    queryFn: ({ pageParam = 1 }) =>
      getProductReviews(product_id, {
        page: pageParam,
        limit: 10,
      }),
    initialPageParam: 1,
  });
  return {
    props: {
      product_id,
      dehydratedState: dehydrate(queryClient),
    },
  };
}) satisfies GetServerSideProps<IProps>;
