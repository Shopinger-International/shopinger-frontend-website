import type { FC } from "react";

// external component
import { Formik, Form } from "formik";

const CheckDeliveryAvailability: FC = () => {
  return (
    <section
      aria-labelledby="delivery-heading"
      className="mb-4 flex items-center gap-2"
    >
      <h2 id="delivery-heading" className="inline text-sm font-medium">
        Check Delivery Availability
      </h2>
      <Formik
        onSubmit={(values) => {
          console.log("value of values", values);
        }}
        initialValues={{
          pincode: "",
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="flex items-center gap-2">
            <label htmlFor="pincode" className="sr-only">
              Enter delivery pincode
            </label>

            <input
              id="pincode"
              name="pincode"
              type="text"
              value={values["pincode"]}
              className="rounded-md border border-orange-500 px-4 py-2 text-xs font-medium"
              placeholder="Enter pincode"
              onChange={handleChange}
            />
            <button
              type="submit"
              className="cursor-pointer text-sm font-medium text-orange-500"
            >
              Check
            </button>
          </Form>
        )}
      </Formik>
    </section>
  );
};
export default CheckDeliveryAvailability;
