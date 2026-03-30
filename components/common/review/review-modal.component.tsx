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
  medias: File[];
};
type IProps = {
  product: Omit<IProduct, "variants">;
  variant: IVariant;
  is_open: boolean;
  onClose: () => void;
};

const ReviewModal: FC<IProps> = ({ product, variant, is_open, onClose }) => {
  const { title, variant_visual_attribute_medias, sub_sub_category_id } =
    product;
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
  return (
    <Dialog as="div" className="relative z-50" onClose={onClose} open={is_open}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-gray-300 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-300 px-6 py-4">
            <div className="flex items-start gap-4">
              <div className="relative size-16 shrink-0 rounded-lg border border-gray-300">
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

              <div className="flex flex-col gap-1">
                <DialogTitle className="line-clamp-2 font-semibold text-gray-900">
                  {title}
                </DialogTitle>
                <p className="text-sm text-gray-600">
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
              description: "",
              medias: [],
            }}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {({ values, setValues }) => (
              <Form className="flex flex-1 flex-col overflow-hidden">
                {/* Scrollable Content */}
                <div className="flex-1 space-y-6 overflow-y-auto px-6 py-3">
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
                          className="h-10 w-full rounded-md border border-gray-300 px-3 focus:outline-orange-500"
                        />
                      </div>
                    )}
                  </Field>

                  {/* Description */}
                  <Field name="description">
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
                <div className="flex items-center justify-end gap-3 border-t border-gray-300 px-6 py-3">
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
                      values.description.trim().length < 10
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
