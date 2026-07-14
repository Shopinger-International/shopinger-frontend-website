// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import Hero from "@/components/minutes-delivery-terms-and-condition/hero.component";
import PolicySection from "@/components/common/policy-section.component";

const policies = [
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

const MinutesDeliveryTermsAndConditions: NextPageWithLayout = () => {
  return (
    <div className="w-full bg-gray-50 py-2 sm:py-4">
      <div className="mx-auto mt-(--header-height) max-w-7xl px-2.5 sm:px-4">
        <Hero />
        <PolicySection policies={policies} />
      </div>
    </div>
  );
};

export default MinutesDeliveryTermsAndConditions;

MinutesDeliveryTermsAndConditions.getLayout = function getLayout(
  page: ReactElement,
) {
  return <MainLayout>{page}</MainLayout>;
};
