import type { FC } from "react";

const POLICY_SECTIONS = [
  {
    id: "eligibility",
    title: "Eligibility for Minute Delivery",
    intro: "Minute Delivery is available only when:",
    list: [
      "The product is marked as eligible for Minute Delivery on the Shopinger platform.",
      "The product is available in the nearest Shopinger warehouse or fulfillment center.",
      "The customer's delivery address is within a serviceable location.",
      "The order is successfully placed, confirmed, and accepted by Shopinger.",
      "Required payment verification is completed, where applicable.",
    ],
    note: "Not all products listed on Shopinger are eligible for Minute Delivery.",
  },

  {
    id: "delivery-timeline",
    title: "Delivery Timeline",
    paragraphs: [
      "Delivery times displayed on the Shopinger platform are estimated timelines provided for customer convenience only.",

      "Minute Delivery does not represent a guaranteed delivery commitment. Actual delivery times may vary depending on operational, logistical, environmental, technical, and other relevant factors.",

      "The estimated delivery timeline begins after the order has been confirmed and accepted by Shopinger.",
    ],
  },

  {
    id: "factors-affecting-delivery",
    title: "Factors Affecting Delivery",
    intro:
      "Minute Delivery availability and delivery timelines may be affected by, including but not limited to:",
    list: [
      "Product availability and inventory updates.",
      "Warehouse processing and operational conditions.",
      "Customer location and serviceability.",
      "High order volumes, peak hours, festivals, or special events.",
      "Traffic conditions, road closures, accidents, or route restrictions.",
      "Weather conditions or natural events.",
      "Government restrictions, emergencies, or regulatory requirements.",
      "Delivery partner availability and transportation issues.",
      "Vehicle-related issues, including breakdowns or punctures.",
      "Technical issues affecting the Shopinger platform, payment systems, or operations.",
      "Payment verification or security checks.",
      "Incorrect or incomplete customer address information.",
      "Customer unavailability or failure to respond to delivery communications.",
      "Building access restrictions or location accessibility issues.",
      "Any other circumstances beyond Shopinger's reasonable control.",
    ],
  },

  {
    id: "customer-responsibilities",
    title: "Customer Responsibilities",
    intro: "Customers are responsible for:",
    list: [
      "Providing accurate delivery details.",
      "Being available at the delivery location.",
      "Responding to calls or messages required to complete delivery.",
      "Providing necessary access information where required.",
    ],
    note: "Failure to do so may result in delays, rescheduling, or cancellation of the delivery.",
  },

  {
    id: "product-availability",
    title: "Product Availability",
    paragraphs: [
      "Product availability is based on real-time inventory information.",

      "In rare cases, products may become unavailable after an order is placed due to inventory changes, stock mismatches, high demand, or operational issues.",

      "Where applicable, Shopinger will notify the customer and process the order in accordance with its Cancellation & Refund Policy.",
    ],
  },

  {
    id: "safety-priority",
    title: "Safety Priority",
    paragraphs: [
      "Shopinger does not require its delivery personnel to violate traffic laws, safety regulations, or legal requirements to meet estimated delivery timelines.",

      "Customer safety, delivery partner safety, and public safety remain Shopinger's highest priority.",
    ],
  },

  {
    id: "service-modification",
    title: "Service Modification",
    paragraphs: [
      "Shopinger reserves the right to modify, restrict, suspend, or discontinue Minute Delivery for specific products, locations, or periods for operational, legal, safety, or business reasons without prior notice.",
    ],
  },

  {
    id: "disclaimer",
    title: "Disclaimer",
    paragraphs: [
      "Minute Delivery is an estimated service offering and does not constitute a guaranteed delivery commitment.",
    ],
    highlight:
      'The tagline "Everything Delivered in Minutes" is a marketing and brand communication statement. It does not guarantee that every product is always available on shopinger or that every order will be delivered within a specific number of minutes. Availability and delivery times may vary.',
  },

  {
    id: "legal-framework",
    title: "Legal Framework",
    intro:
      "These Terms & Conditions shall be governed by the applicable laws of India, including but not limited to:",
    list: [
      "Consumer Protection Act, 2019 and applicable Consumer Protection (E-Commerce) Rules.",
      "Information Technology Act, 2000 and applicable rules.",
      "Indian Contract Act, 1872.",
      "Legal Metrology Act, 2009, wherever applicable.",
      "Any other applicable laws, rules, and regulations in force in India.",
    ],
  },

  {
    id: "acceptance",
    title: "Acceptance of Terms",
    paragraphs: [
      "By accessing the Shopinger platform and using Minute Delivery services, customers acknowledge that they have read, understood, and agreed to these Terms & Conditions.",
    ],
  },

  {
    id: "related-policies",
    title: "Related Policies",
    intro: "These Terms & Conditions should be read together with:",
    list: [
      "Terms of Use",
      "Privacy Policy",
      "Shipping Policy",
      "Cancellation & Refund Policy",
    ],
    note: "Shopinger reserves the right to update these Terms & Conditions at any time to reflect operational, legal, regulatory, or business requirements.",
  },
];
const PolicySection: FC = () => {
  return (
    <section className="mt-8 overflow-hidden rounded-xl border border-gray-300 bg-white sm:rounded-2xl">
      {POLICY_SECTIONS.map((section, index) => (
        <article
          key={section.id}
          id={section.id}
          className={`p-4 sm:p-8 ${
            index !== POLICY_SECTIONS.length - 1
              ? "border-b border-gray-300"
              : ""
          }`}
        >
          {/* Heading */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <h2 className="text-lg font-bold text-gray-900 sm:text-2xl">
              {section.title}
            </h2>
          </div>

          {/* Content */}
          <div className="mt-3 space-y-4 sm:mt-6 sm:space-y-5">
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="leading-8 text-gray-600">
                {paragraph}
              </p>
            ))}

            {section.intro && (
              <p className="font-medium text-gray-700">{section.intro}</p>
            )}

            {section.list && (
              <ul className="space-y-3">
                {section.list.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500" />

                    <span className="leading-7 text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.note && (
              <div className="rounded-xl border border-gray-300 bg-gray-50 p-3 sm:p-5">
                <p className="leading-7 text-gray-700">{section.note}</p>
              </div>
            )}

            {section.highlight && (
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 sm:p-5">
                <p className="leading-7 text-gray-700">{section.highlight}</p>
              </div>
            )}
          </div>
        </article>
      ))}
    </section>
  );
};
export default PolicySection;
