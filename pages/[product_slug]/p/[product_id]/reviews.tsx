import Head from "next/head";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";
import type { GetServerSideProps } from "next";
import type IReview from "@/types/review";
import type { DehydratedState } from "@tanstack/react-query";
import type { IFilterType } from "@/hooks/axios/review/use-product-reviews.hook";
import type IProduct from "@/types/product";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import RatingSummary from "@/components/review/rating-summary.component";
import ProductReview from "@/components/review/product-review.component";
import ReportModal from "@/components/review/report-modal.component";

// react query
import { QueryClient, dehydrate } from "@tanstack/react-query";

// api hooks
import useProductReviews from "@/hooks/axios/review/use-product-reviews.hook";

// helpers
import { getProductReviews } from "@/hooks/axios/review/use-product-reviews.hook";
import { getProduct } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";

export type IReportModalState = {
  open: boolean;
  review_id?: number;
};

type IProps = {
  product_id: number;
  product: IProduct;
  dehydratedState: DehydratedState;
};

const Reviews: NextPageWithLayout<IProps> = ({ product_id, product }) => {
  const { title, brand } = product;
  const product_title =
    !brand || brand.toLocaleLowerCase() == "generic" || title.includes(brand)
      ? title
      : `${brand} ${title}`;
  const [report_modal_state, setReportModalState] = useState<IReportModalState>(
    {
      open: false,
    },
  );
  const [filter_state, setFilterState] = useState<IFilterType>("helpful");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductReviews({ productId: product_id, sort: filter_state });
  const product_reviews = data?.pages.reduce<IReview[]>((acc, { reviews }) => {
    return [...acc, ...reviews];
  }, []);
  const rating_summary = data?.pages[0].summary;
  const top_medias = rating_summary?.top_media ?? [];
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
    <>
      <Head>
        <title>{product_title} Reviews & Ratings | Shopinger</title>
        <meta
          name="description"
          content={`Read customer reviews and ratings for ${product_title}. See real feedback, pros & cons, and user experiences on Shopinger.`}
          key="desc"
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <ReportModal
        review_id={report_modal_state.review_id as number}
        is_open={report_modal_state.open}
        onClose={() => {
          setReportModalState({
            open: false,
          });
        }}
      />
      <section className="w-full bg-white py-4">
        <div className="mx-auto mt-(--header-height) max-w-6xl space-y-4 px-4">
          {/* Rating Summary */}
          {rating_summary && <RatingSummary {...rating_summary} />}

          {/* Photo Grid */}
          <div className="flex items-center gap-4 overflow-x-auto">
            {top_medias.map((media, index) => (
              <div
                className="relative size-40 shrink-0 overflow-hidden rounded-md border border-gray-300"
                key={`top-media-${media.id}`}
              >
                <Image
                  fill={true}
                  sizes="160px"
                  key={`top-media-${index}`}
                  alt="top-media"
                  src={media.url}
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="no-scrollbar flex gap-3 overflow-x-auto text-sm">
            {[
              { label: "Helpful", value: "helpful" },
              { label: "Latest", value: "recent" },
              { label: "Positive", value: "highest" },
              { label: "Negative", value: "lowest" },
            ].map(({ label, value }) => {
              const isActive = filter_state === value;

              return (
                <button
                  key={`filter-${value}`}
                  onClick={() => setFilterState(value as IFilterType)}
                  className={`rounded-full px-4 py-1.5 font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-orange-500 text-white shadow-sm"
                      : "border border-gray-300 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                  } `}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Reviews List */}
          <div>
            {product_reviews?.map((review) => (
              <ProductReview
                {...review}
                key={`product-review-${review.id}`}
                product_id={product_id}
                filter_state={filter_state}
                handleReportModalState={({ open, review_id }) =>
                  setReportModalState({
                    open,
                    ...(review_id
                      ? {
                          review_id,
                        }
                      : {}),
                  })
                }
              />
            ))}
          </div>
          {/* Infinite scroll trigger */}
          <div ref={load_more_ref} className="h-10" />
        </div>
      </section>
    </>
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
    queryKey: ["product-reviews", product_id, null, "helpful"],
    queryFn: ({ pageParam = 1 }) =>
      getProductReviews(product_id, {
        page: pageParam,
        limit: 10,
      }),
    initialPageParam: 1,
  });

  let { product } = await getProduct(product_id);
  return {
    props: {
      product_id,
      product,
      dehydratedState: dehydrate(queryClient),
    },
  };
}) satisfies GetServerSideProps<IProps>;
