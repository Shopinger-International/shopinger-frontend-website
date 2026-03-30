import Image from "next/image";
import { useMemo } from "react";
// types
import type { IMediaGroup } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";
import type { FC } from "react";
import type { FieldProps } from "formik";
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";

// external components
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Formik, Form, Field } from "formik";
import { Rating } from "@smastrom/react-rating";

// icons
import { X } from "lucide-react";

// css
import "@smastrom/react-rating/style.css";

// api hooks
import useReviewGeneratorMutation from "@/hooks/axios/review/review-generator-mutation.hook";
import useCategoryMappings from "@/hooks/axios/common/use-category-mappings.hook";

const rating_labels = [
  "Very poor",
  "Not great",
  "Average",
  "Good",
  "Excellent",
];

type IInitialValues = {
  rating: number;
  title: string;
  description: string;
};
type IProps = {
  product: Omit<IProduct, "variants">;
  variant: IVariant;
  is_open: boolean;
  onClose: () => void;
};

const ReviewModal: FC<IProps> = ({ product, variant, is_open, onClose }) => {
  const {
    title,
    variant_visual_attribute_medias,
    id: product_id,
    sub_sub_category_id,
  } = product;
  const review_generator_mutation = useReviewGeneratorMutation();
  const { data: category_mappings } = useCategoryMappings(sub_sub_category_id);
  const { variant_attribute_values } = variant;
  const variant_medias = useMemo(() => {
    const media_group = variant_visual_attribute_medias.reduce<IMediaGroup>(
      (acc, item) => {
        const { attribute_id, attribute_value } = item;
        const updated_attribute_value = attribute_value.toLowerCase();

        if (!acc[attribute_id]) {
          acc[attribute_id] = {};
        }

        if (!acc[attribute_id][updated_attribute_value]) {
          acc[attribute_id][updated_attribute_value] = [];
        }

        acc[attribute_id][updated_attribute_value].push(item.media);

        return acc;
      },
      {},
    );

    let variant_medias = variant_attribute_values
      .filter(
        ({ attribute }) =>
          category_mappings?.find(
            ({ attribute: mapping_attribute }) =>
              mapping_attribute.id == attribute.id,
          )?.is_visual,
      )
      .flatMap(
        ({ attribute, value }) =>
          media_group[attribute.id as number]?.[value.toLowerCase()] ?? [],
      );

    return variant_medias;
  }, [
    variant_attribute_values.length,
    category_mappings?.length,
    variant_visual_attribute_medias.length,
  ]);
  console.log("value of variant medias", variant_medias);
  return (
    <Dialog as="div" className="relative z-50" onClose={onClose} open={is_open}>
      {/* Overlay */}

      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg rounded-2xl border border-gray-300 bg-white p-6 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Product Image */}
              <div className="relative size-16 shrink-0 rounded-lg border border-gray-300">
                <Image
                  src={
                    variant_medias[0]?.url ??
                    product.product_medias[0].media.url
                  }
                  fill={true}
                  alt={title}
                  className="border object-contain"
                />
              </div>

              {/* Title + Subtitle */}
              <div className="flex flex-col gap-1">
                <DialogTitle className="line-clamp-2 font-semibold text-gray-900">
                  {title}
                </DialogTitle>
                <p className="text-sm text-gray-600">
                  Share your experience with this product
                </p>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="rounded-md p-2 hover:bg-gray-100"
            >
              <X className="size-5 text-gray-600" />
            </button>
          </div>

          {/* Form */}
          <Formik<IInitialValues>
            initialValues={{
              rating: 0,
              title: "",
              description: "",
            }}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {({ values, setValues }) => (
              <Form className="flex flex-col gap-6">
                {/* Rating */}
                <Field name="rating">
                  {({ field, form }: FieldProps<number, IInitialValues>) => (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Rating</label>
                      <div className="flex items-center gap-4">
                        <Rating
                          style={{ maxWidth: 140 }}
                          value={field.value || 0}
                          onChange={(val) => {
                            form.setFieldValue(field.name, val);
                            if (product) {
                              review_generator_mutation.mutate(
                                {
                                  rating: val,
                                  product_title: product.title,
                                  product_description: product.description,
                                },
                                {
                                  onSuccess({
                                    review_description,
                                    review_title,
                                  }) {
                                    setValues((prev) => ({
                                      ...prev,
                                      title: review_title,
                                      description: review_description,
                                    }));
                                  },
                                },
                              );
                            }
                          }}
                        />

                        {review_generator_mutation.isPending && (
                          <span className="animate-pulse text-sm text-gray-500">
                            Generating review...
                          </span>
                        )}

                        {field.value > 0 &&
                          !review_generator_mutation.isPending && (
                            <span className="text-sm font-medium text-orange-500">
                              {rating_labels[field.value - 1]}
                            </span>
                          )}
                      </div>
                    </div>
                  )}
                </Field>

                {/* Title */}
                <Field name="title">
                  {({ field }: FieldProps<string, IInitialValues>) => (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">
                        Review title
                      </label>

                      <input
                        {...field}
                        placeholder="Summarize your experience"
                        className="h-10 w-full rounded-md border border-gray-300 px-3 hover:outline-orange-500 focus:outline-orange-500"
                      />
                    </div>
                  )}
                </Field>

                {/* Description */}
                <Field name="description">
                  {({ field }: FieldProps<string, IInitialValues>) => (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Your review</label>

                      <textarea
                        {...field}
                        rows={4}
                        placeholder="What did you like or dislike? How was your experience?"
                        className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 hover:outline-orange-500 focus:outline-orange-500"
                      />
                    </div>
                  )}
                </Field>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      values.rating === 0 ||
                      values.description.trim().length < 10
                    }
                    className="cursor-pointer rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
                  >
                    Submit Review
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ReviewModal;
