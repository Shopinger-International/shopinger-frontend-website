import type { FC } from "react";
// types
import type { FieldProps } from "formik";
import type IProduct from "@/types/product";

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
  product: Omit<IProduct, "variants"> | null;
  is_open: boolean;
  onClose: () => void;
};

const ReviewModal: FC<IProps> = ({ product, is_open, onClose }) => {
  const review_generator_mutation = useReviewGeneratorMutation();
  return (
    <Dialog as="div" className="relative z-50" onClose={onClose} open={is_open}>
      {/* Overlay */}

      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Write a Review
              </DialogTitle>
              <p className="text-sm text-gray-600">
                Share your experience with this product
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 transition hover:bg-gray-100"
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
              <Form className="flex flex-col gap-5">
                {/* Rating */}
                <Field name="rating">
                  {({ field, form }: FieldProps<number, IInitialValues>) => (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-900">
                        Rating
                      </label>

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

                        {field.value > 0 && (
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
                      <label className="text-sm font-medium text-gray-900">
                        Review title
                      </label>

                      <input
                        {...field}
                        placeholder="Summarize your experience"
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                  )}
                </Field>

                {/* Description */}
                <Field name="description">
                  {({ field }: FieldProps<string, IInitialValues>) => (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-900">
                        Your review
                      </label>

                      <textarea
                        {...field}
                        rows={4}
                        placeholder="What did you like or dislike? How was your experience?"
                        className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                  )}
                </Field>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      values.rating === 0 ||
                      values.description.trim().length < 10
                    }
                    className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
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
