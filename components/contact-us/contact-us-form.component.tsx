import type { FC } from "react";

// external components
import { Formik, Form, Field, ErrorMessage } from "formik";

// helpers
import { z } from "zod";
import { toFormikValidate } from "@/helpers/common.helper";

export const contact_us_schema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Full name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

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

const initialValues = {
  fullName: "",
  email: "",
  subject: "",
  message: "",
};

const ContactUsForm: FC = () => {
  return (
    <div className="rounded-xl border border-orange-100 bg-orange-50 p-6">
      <Formik
        initialValues={initialValues}
        validate={toFormikValidate(contact_us_schema)}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          console.log(values);

          // TODO: Call your API here

          setSubmitting(false);
          resetForm();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullname"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                placeholder="Ashish Prajapati"
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 hover:outline-orange-500 focus:outline-orange-500"
              />
              <ErrorMessage
                name="fullName"
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

              <input
                id="email"
                name="email"
                type="email"
                placeholder="ashish.p@gmail.com"
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

              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="Order Issue"
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

              {/* <Field
                as="textarea"
                id="message"
                name="message"
                rows={6}
                placeholder="Tell us how we can help..."
                className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 transition outline-none focus:border-orange-500"
              /> */}

              <textarea
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
              disabled={isSubmitting}
              className="w-full rounded-lg bg-orange-500 py-3 font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactUsForm;
