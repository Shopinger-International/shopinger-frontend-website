import Image from "next/image";
// types
import type { FC } from "react";
import type { FieldProps } from "formik";
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";
import { IOrderItem } from "@/types/order";

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
import useAddReviewMutation from "@/hooks/axios/review/add-review.mutation.hook";

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
  comment: string;
  medias: File[];
};
type IProps = {
  product: Omit<IProduct, "variants">;
  variant: IVariant;
  order_item: IOrderItem;
  is_open: boolean;
  onClose: () => void;
};

const ReviewModal: FC<IProps> = ({
  product,
  variant,
  order_item,
  is_open,
  onClose,
}) => {
  const { title } = product;
  const review_generator_mutation = useReviewGeneratorMutation();
  const variant_medias = variant.variant_medias.map(({ media }) => media);
  const add_review_mutation = useAddReviewMutation();

  return (
    <Dialog as="div" className="relative z-50" onClose={onClose} open={is_open}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-gray-300 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-300 px-4 py-4 sm:px-6">
            <div className="flex items-start gap-4">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-gray-300 sm:size-16">
                <Image
                  src={
                    variant_medias[0]?.url ??
                    product.product_medias[0].media.url
                  }
                  fill
                  alt={title}
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col gap-0.5 sm:gap-1">
                <DialogTitle className="line-clamp-1 text-sm font-semibold text-gray-900 sm:line-clamp-2 sm:text-base">
                  {title}
                </DialogTitle>
                <p className="text-xs text-gray-600 sm:text-sm">
                  Share your experience with this product
                </p>
              </div>
            </div>

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
              comment: "",
              medias: [],
            }}
            onSubmit={({ medias, ...values }) => {
              add_review_mutation.mutate(
                {
                  product_id: product.id,
                  variant_id: variant.id,
                  order_item_id: order_item.item_id,
                  ...values,
                },
                {
                  onSuccess() {
                    onClose();
                  },
                },
              );
            }}
          >
            {({ values, setValues }) => (
              <Form className="flex flex-1 flex-col overflow-hidden">
                {/* Scrollable Content */}
                <div className="flex-1 space-y-6 overflow-y-auto px-4 py-3 sm:px-6">
                  {/* Rating */}
                  <Field name="rating">
                    {({ field, form }: FieldProps<number, IInitialValues>) => (
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Rating</label>

                        <div className="flex items-center gap-4">
                          <Rating
                            style={{ maxWidth: 140 }}
                            value={field.value || 0}
                            onChange={(val: any) => {
                              form.setFieldValue(field.name, val);

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
                                      comment: review_description,
                                    }));
                                  },
                                },
                              );
                            }}
                          />

                          {/* Loading */}
                          {review_generator_mutation.isPending && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />
                              Writing review...
                            </div>
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
                          className="h-10 w-full rounded-md border border-gray-300 px-3 focus:outline-orange-500"
                        />
                      </div>
                    )}
                  </Field>

                  {/* Description */}
                  <Field name="comment">
                    {({ field }: FieldProps<string, IInitialValues>) => (
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">
                          Your review
                        </label>

                        <textarea
                          {...field}
                          rows={4}
                          placeholder="What did you like or dislike?"
                          className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:outline-orange-500"
                        />
                      </div>
                    )}
                  </Field>

                  {/* Media Upload */}
                  <Field name="medias">
                    {({ form }: FieldProps<File[], IInitialValues>) => {
                      const files = form.values.medias || [];

                      const handleFiles = (uploaded_files: File[]) => {
                        const MAX_FILES = 5;
                        const MAX_SIZE = 2 * 1024 * 1024;

                        const valid = uploaded_files.filter(
                          (f) => f.size <= MAX_SIZE,
                        );

                        form.setFieldValue(
                          "medias",
                          [...files, ...valid].slice(0, MAX_FILES),
                        );
                      };

                      return (
                        <div className="flex flex-col gap-3">
                          <label className="text-sm font-medium">
                            Add photos (optional)
                          </label>

                          {/* Upload Box */}
                          <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              handleFiles(Array.from(e.dataTransfer.files));
                            }}
                            className="relative flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center transition hover:border-orange-500 hover:bg-orange-50"
                          >
                            <p className="text-sm font-medium text-gray-900">
                              Drag & drop images here
                            </p>
                            <p className="text-xs text-gray-600">
                              or click to browse
                            </p>

                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) =>
                                handleFiles(Array.from(e.target.files || []))
                              }
                              className="absolute inset-0 cursor-pointer opacity-0"
                            />
                          </div>

                          {/* Preview Grid */}
                          {files.length > 0 && (
                            <div className="grid grid-cols-4 gap-3">
                              {files.map((file, index) => {
                                const preview = URL.createObjectURL(file);

                                return (
                                  <div
                                    key={index}
                                    className="group relative aspect-square overflow-hidden rounded-md border-2 border-gray-300"
                                  >
                                    <Image
                                      src={preview}
                                      alt="preview"
                                      fill
                                      className="object-cover"
                                    />

                                    <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/40" />

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = files.filter(
                                          (_, i) => i !== index,
                                        );
                                        form.setFieldValue("medias", updated);
                                      }}
                                      className="absolute top-1 right-1 hidden rounded-md bg-white p-1 text-xs shadow group-hover:block"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                );
                              })}

                              {files.length < 5 && (
                                <label className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-orange-400 hover:text-orange-500">
                                  +
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleFiles(
                                        Array.from(e.target.files || []),
                                      )
                                    }
                                    className="hidden"
                                  />
                                </label>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }}
                  </Field>
                </div>

                {/* Footer (Sticky) */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-300 px-4 py-3 sm:px-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      values.rating === 0 ||
                      values.comment.trim().length < 10 ||
                      add_review_mutation.isPending
                    }
                    className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
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
