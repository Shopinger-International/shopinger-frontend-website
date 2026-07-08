import type { FC } from "react";

// external components
import { Formik, Form, ErrorMessage, Field } from "formik";

// helpers
import { z } from "zod";
import { toFormikValidate } from "@/helpers/common.helper";

// hooks
import useContactSupportMutation from "@/hooks/axios/contact-us/use-contact-support-mutation.hook";

export const contact_us_schema = z.object({
  fullname: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Full name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(
      /^(?:\+91|0)?[6-9]\d{9}$/,
      "Please enter a valid 10-digit Indian phone number",
    ),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(150, "Subject cannot exceed 150 characters"),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
});

export type IContactUsFormData = z.infer<typeof contact_us_schema>;

const initialValues = {
  fullname: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const ContactUsForm: FC = () => {
  const contact_support_mutation = useContactSupportMutation();
  return (
    <div className="rounded-xl border border-orange-100 bg-orange-50 p-4 sm:p-6">
      <Formik
        initialValues={initialValues}
        validate={toFormikValidate(contact_us_schema)}
        onSubmit={(values, { resetForm }) =>
          contact_support_mutation.mutate(values, {
            onSuccess() {
              resetForm();
            },
          })
        }
      >
        {() => (
          <Form className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullname"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <Field
                id="fullname"
                name="fullname"
                type="text"
                placeholder="e.g. Rishikesh Yadav"
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 hover:outline-orange-500 focus:outline-orange-500"
              />
              <ErrorMessage
                name="fullname"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            {/** Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Phone
              </label>

              <Field
                id="phone"
                name="phone"
                type="tel"
                placeholder="e.g. +91 98765XXXXX"
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 hover:outline-orange-500 focus:outline-orange-500"
              />

              <ErrorMessage
                name="phone"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <Field
                id="email"
                name="email"
                type="email"
                placeholder="e.g. rishikesh@example.com"
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 hover:outline-orange-500 focus:outline-orange-500"
              />

              <ErrorMessage
                name="email"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Subject
              </label>

              <Field
                id="subject"
                name="subject"
                type="text"
                placeholder="e.g. Order inquiry"
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 hover:outline-orange-500 focus:outline-orange-500"
              />

              <ErrorMessage
                name="subject"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Message
              </label>

              <Field
                component="textarea"
                id="message"
                name="message"
                rows={6}
                placeholder="Tell us how we can help..."
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 hover:outline-orange-500 focus:outline-orange-500"
              />

              <ErrorMessage
                name="message"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={contact_support_mutation.isPending}
              className="w-full rounded-lg bg-orange-500 py-3 font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
            >
              {contact_support_mutation.isPending
                ? "Sending..."
                : "Send Message"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactUsForm;
