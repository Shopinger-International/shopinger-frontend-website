// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";
import type { IPolicySection } from "@/components/common/policy-section.component";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import PolicySection from "@/components/common/policy-section.component";

// seo
import Seo from "@/components/common/seo";

export const policies: IPolicySection[] = [
  {
    id: "overview",
    title: "1. Overview",
    content: [
      {
        type: "text",
        text: '"Everything Delivered in Minutes" is Shopinger\'s brand tagline and reflects our commitment to providing fast and convenient deliveries.',
      },
      {
        type: "text",
        text: "Minute Delivery is available only for eligible products stocked in Shopinger-operated warehouses or fulfillment centers and is offered only in selected serviceable locations.",
      },
      {
        type: "note",
        text: "Availability of Minute Delivery depends on product eligibility, inventory availability, customer location, operational capacity, and other applicable conditions. Products that are not eligible for Minute Delivery will be delivered according to their estimated delivery timelines displayed at checkout.",
      },
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility for Minute Delivery",
    content: [
      {
        type: "list",
        title: "Minute Delivery is available only when:",
        items: [
          "The product is marked as eligible for Minute Delivery on the Shopinger platform.",
          "The product is available in the nearest Shopinger warehouse or fulfillment center.",
          "The customer's delivery address is within a serviceable location.",
          "The order is successfully placed, confirmed, and accepted by Shopinger.",
          "Required payment verification is completed, where applicable.",
        ],
      },
      {
        type: "note",
        text: "Not all products listed on Shopinger are eligible for Minute Delivery.",
      },
    ],
  },
  {
    id: "delivery-timeline",
    title: "Delivery Timeline",
    content: [
      {
        type: "text",
        text: "Delivery times displayed on the Shopinger platform are estimated timelines provided for customer convenience only.",
      },
      {
        type: "text",
        text: "Minute Delivery does not represent a guaranteed delivery commitment. Actual delivery times may vary depending on operational, logistical, environmental, technical, and other relevant factors.",
      },
      {
        type: "text",
        text: "The estimated delivery timeline begins after the order has been confirmed and accepted by Shopinger.",
      },
    ],
  },
  {
    id: "factors-affecting-delivery",
    title: "Factors Affecting Delivery",
    content: [
      {
        type: "list",
        title:
          "Minute Delivery availability and delivery timelines may be affected by, including but not limited to:",
        items: [
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
    ],
  },
  {
    id: "customer-responsibilities",
    title: "Customer Responsibilities",
    content: [
      {
        type: "list",
        title: "Customers are responsible for:",
        items: [
          "Providing accurate delivery details.",
          "Being available at the delivery location.",
          "Responding to calls or messages required to complete delivery.",
          "Providing necessary access information where required.",
        ],
      },
      {
        type: "note",
        text: "Failure to do so may result in delays, rescheduling, or cancellation of the delivery.",
      },
    ],
  },
  {
    id: "product-availability",
    title: "Product Availability",
    content: [
      {
        type: "text",
        text: "Product availability is based on real-time inventory information.",
      },
      {
        type: "text",
        text: "In rare cases, products may become unavailable after an order is placed due to inventory changes, stock mismatches, high demand, or operational issues.",
      },
      {
        type: "text",
        text: "Where applicable, Shopinger will notify the customer and process the order in accordance with its Cancellation & Refund Policy.",
      },
    ],
  },
  {
    id: "safety-priority",
    title: "Safety Priority",
    content: [
      {
        type: "text",
        text: "Shopinger does not require its delivery personnel to violate traffic laws, safety regulations, or legal requirements to meet estimated delivery timelines.",
      },
      {
        type: "text",
        text: "Customer safety, delivery partner safety, and public safety remain Shopinger's highest priority.",
      },
    ],
  },
  {
    id: "service-modification",
    title: "Service Modification",
    content: [
      {
        type: "text",
        text: "Shopinger reserves the right to modify, restrict, suspend, or discontinue Minute Delivery for specific products, locations, or periods for operational, legal, safety, or business reasons without prior notice.",
      },
    ],
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    content: [
      {
        type: "text",
        text: "Minute Delivery is an estimated service offering and does not constitute a guaranteed delivery commitment.",
      },
      {
        type: "highlight",
        text: 'The tagline "Everything Delivered in Minutes" is a marketing and brand communication statement. It does not guarantee that every product is always available on shopinger or that every order will be delivered within a specific number of minutes. Availability and delivery times may vary.',
      },
    ],
  },
  {
    id: "legal-framework",
    title: "Legal Framework",
    content: [
      {
        type: "list",
        title:
          "These Terms & Conditions shall be governed by the applicable laws of India, including but not limited to:",
        items: [
          "Consumer Protection Act, 2019 and applicable Consumer Protection (E-Commerce) Rules.",
          "Information Technology Act, 2000 and applicable rules.",
          "Indian Contract Act, 1872.",
          "Legal Metrology Act, 2009, wherever applicable.",
          "Any other applicable laws, rules, and regulations in force in India.",
        ],
      },
    ],
  },
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: [
      {
        type: "text",
        text: "By accessing the Shopinger platform and using Minute Delivery services, customers acknowledge that they have read, understood, and agreed to these Terms & Conditions.",
      },
    ],
  },
  {
    id: "related-policies",
    title: "Related Policies",
    content: [
      {
        type: "list",
        title: "These Terms & Conditions should be read together with:",
        items: [
          "Terms of Use",
          "Privacy Policy",
          "Shipping Policy",
          "Cancellation & Refund Policy",
        ],
      },
      {
        type: "note",
        text: "Shopinger reserves the right to update these Terms & Conditions at any time to reflect operational, legal, regulatory, or business requirements.",
      },
    ],
  },
];
const MinutesDeliveryTermsAndConditions: NextPageWithLayout = () => {
  const is_prod = process.env.NODE_ENV == "production";
  const title = "Minute Delivery Terms & Conditions | Shopinger";

  const description =
    "Read the Shopinger Minute Delivery Terms & Conditions to understand eligibility, delivery timelines, service availability, limitations, and the terms governing Minute Delivery orders.";

  const page_url = `${process.env.NEXT_PUBLIC_BASE_URL}/minute-delivery-terms-and-conditions`;
  return (
    <>
      <Seo
        title={title}
        description={description}
        is_prod={is_prod}
        url={page_url}
        image={`${process.env.NEXT_PUBLIC_CDN_URL}/uploads/assets/dark-mobile-logo.png`}
      />
      <div className="w-full bg-gray-50 py-2 sm:py-4">
        <div className="mx-auto mt-(--header-height) max-w-7xl px-2.5 sm:px-4">
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Shopinger Minute Delivery – Terms & Conditions
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
              <span>
                <span className="font-medium text-gray-700">Last Updated:</span>{" "}
                July 2026
              </span>

              <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:block" />

              <span>
                <span className="font-medium text-gray-700">
                  Effective Date:
                </span>{" "}
                July 2026
              </span>
            </div>
          </div>
          <PolicySection policies={policies} />
        </div>
      </div>
    </>
  );
};

export default MinutesDeliveryTermsAndConditions;

MinutesDeliveryTermsAndConditions.getLayout = function getLayout(
  page: ReactElement,
) {
  return <MainLayout>{page}</MainLayout>;
};
