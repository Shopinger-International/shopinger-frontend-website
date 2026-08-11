// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";
import type { IPolicySection } from "@/components/common/policy-section.component";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local component
import PolicySection from "@/components/common/policy-section.component";

// seo
import Seo from "@/components/common/seo";

export const policies: IPolicySection[] = [
  {
    id: "welcome",
    title: "Welcome Statement",
    content: [
      {
        type: "text",
        text: 'Welcome to Shopinger, operated by Shopinger International Private Limited ("Shopinger", "Company", "we", "our", or "us").',
      },
      {
        type: "text",
        text: "This Shipping & Delivery Policy explains how orders are processed, shipped, tracked, and delivered through the Shopinger Platform.",
      },
      {
        type: "note",
        text: "By placing an order on the Platform, you agree to this Shipping & Delivery Policy.",
      },
    ],
  },
  {
    id: "1",
    title: "1. Shipping Overview",
    content: [
      {
        type: "text",
        text: "Shopinger operates its own logistics network and authorized Shopinger Delivery Partners to provide fast, reliable, and secure delivery of orders.",
      },
      {
        type: "text",
        text: "Delivery services are available only in selected cities and serviceable locations where Shopinger operates.",
      },
    ],
  },
  {
    id: "2",
    title: "2. Order Processing",
    content: [
      {
        type: "list",
        title: "Orders are processed after:",
        items: [
          "Successful order placement.",
          "Payment confirmation for prepaid orders.",
          "Seller confirmation (where applicable).",
          "Prescription verification for prescription medicines, wherever required under applicable law.",
        ],
      },
      {
        type: "note",
        text: "Orders are generally processed as quickly as possible. Processing time may vary depending on product availability, seller confirmation, prescription verification, order volume, or operational requirements.",
      },
    ],
  },
  {
    id: "3",
    title: "3. Address Accuracy",
    content: [
      {
        type: "text",
        text: "Customers are responsible for providing a complete and accurate delivery address, including the correct PIN code, landmark (if applicable), and contact number.",
      },
      {
        type: "highlight",
        text: "Shopinger shall not be responsible for delivery delays or failed deliveries resulting from incorrect, incomplete, or inaccurate delivery information provided by the customer.",
      },
    ],
  },
  {
    id: "4",
    title: "4. Delivery Timelines",
    content: [
      {
        type: "list",
        title:
          "Shopinger aims to deliver orders within the following estimated timelines:",
        items: [
          "0–1 KM: Within 9 Minutes",
          "1–3 KM: 10–30 Minutes",
          "3–10 KM: 30–99 Minutes",
          "10–20 KM: Same-Day Delivery",
          "Outside Hyperlocal Delivery Zone: 1–3 Business Days",
        ],
      },
      {
        type: "note",
        text: "The above timelines are estimates only and should not be interpreted as guaranteed delivery times. Actual delivery may vary depending on operational, logistical, weather-related, regulatory, or other unforeseen circumstances.",
      },
    ],
  },
  {
    id: "5",
    title: "5. Delivery Charges",
    content: [
      {
        type: "text",
        text: "Delivery charges, if applicable, will be displayed during checkout before payment confirmation.",
      },
      {
        type: "list",
        title: "Shopinger may offer:",
        items: [
          "Free Delivery",
          "Discounted Delivery Charges",
          "Promotional Delivery Offers",
        ],
      },
      {
        type: "note",
        text: "Such offers may be subject to minimum order value, product category, delivery location, or promotional terms.",
      },
    ],
  },
  {
    id: "6",
    title: "6. Order Tracking",
    content: [
      {
        type: "text",
        text: "Customers can track their orders in real time through the Shopinger website or mobile application.",
      },
      {
        type: "text",
        text: "Order updates may also be shared through SMS, email, WhatsApp, or push notifications, wherever applicable.",
      },
    ],
  },
  {
    id: "7",
    title: "7. Delivery Attempts",
    content: [
      {
        type: "text",
        text: "Our delivery partner may contact you before or during delivery to ensure successful delivery.",
      },
      {
        type: "list",
        title: "If delivery cannot be completed because:",
        items: [
          "The customer is unavailable;",
          "The delivery address is incorrect or incomplete;",
          "The customer cannot be contacted; or",
          "The order is refused without a valid reason,",
        ],
      },
      {
        type: "highlight",
        text: "Shopinger may cancel the order or reschedule the delivery, depending on operational feasibility.",
      },
    ],
  },
  {
    id: "8",
    title: "8. Delivery Delays",
    content: [
      {
        type: "list",
        title:
          "Although Shopinger strives to deliver every order within the estimated timeline, delays may occasionally occur due to circumstances beyond our reasonable control, including:",
        items: [
          "Heavy traffic",
          "Adverse weather conditions",
          "High order volume",
          "Vehicle breakdown",
          "Public holidays",
          "Government restrictions",
          "Product availability",
          "Operational issues",
          "Safety or security concerns",
        ],
      },
      {
        type: "text",
        text: "In such situations, orders may be delivered on the same day or within 1-3 business days, depending on the nature of the delay.",
      },
    ],
  },
  {
    id: "9",
    title: "9. Damaged, Missing, or Incorrect Orders",
    content: [
      {
        type: "text",
        text: "If you receive a damaged, tampered, incorrect, or incomplete order, please report the issue to Shopinger Customer Support within 24 hours of delivery.",
      },
      {
        type: "text",
        text: "After verification, Shopinger will provide an appropriate resolution in accordance with the applicable Cancellation, Return & Refund Policy.",
      },
    ],
  },
  {
    id: "10",
    title: "10. Inspection at Delivery",
    content: [
      {
        type: "text",
        text: "Customers are encouraged to inspect the package at the time of delivery.",
      },
      {
        type: "note",
        text: "If the package appears damaged, tampered with, or incomplete, please inform the delivery partner immediately and report the issue to Shopinger Customer Support.",
      },
    ],
  },
  {
    id: "11",
    title: "11. Open Box Delivery",
    content: [
      {
        type: "text",
        text: "To enhance customer satisfaction and ensure product quality, Shopinger may provide Open Box Delivery for selected eligible products.",
      },
      {
        type: "list",
        title: "Open Box Delivery is generally available for:",
        items: [
          "Mobile Phones with an order value of ₹10,000 or above",
          "Other eligible high-value products as determined by Shopinger from time to time",
        ],
      },
      {
        type: "list",
        title:
          "During Open Box Delivery, the Shopinger Delivery Partner will open the package in the customer's presence solely to verify:",
        items: [
          "The correct product has been delivered.",
          "The product is free from visible physical damage.",
          "The product matches the customer's order.",
        ],
      },
      {
        type: "note",
        text: "Open Box Delivery does not include product installation, setup, demonstration, activation, or functional testing.",
      },
      {
        type: "highlight",
        text: "Once the customer accepts the product after Open Box Delivery, claims relating to visible physical damage, missing items, or incorrect product delivery may not be accepted, except where required under applicable law.",
      },
    ],
  },
  {
    id: "12",
    title: "12. Delivery Area & Service Availability",
    content: [
      {
        type: "text",
        text: "Delivery services are available only in locations where Shopinger currently operates.",
      },
      {
        type: "text",
        text: "Shopinger reserves the right to add, remove, expand, suspend, or modify its delivery service areas at any time without prior notice.",
      },
      {
        type: "text",
        text: "Certain products or services may not be available for delivery in all serviceable locations.",
      },
    ],
  },
  {
    id: "13",
    title: "13. Contact Us",
    content: [
      {
        type: "text",
        text: "If you have any questions, concerns, feedback, suggestions, or require assistance regarding shipping or delivery, please contact our Customer Support Team.",
      },
      {
        type: "list",
        title: "Customer Support Contact Details",
        items: [
          `Company: ${process.env.NEXT_PUBLIC_COMPANY_NAME}`,
          `Email: ${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`,
          `Phone: ${process.env.NEXT_PUBLIC_ADMIN_PHONE}`,
          `Website: ${process.env.NEXT_PUBLIC_BASE_URL}`,
        ],
      },
      {
        type: "text",
        text: "Our Customer Support Team will make reasonable efforts to respond to your queries during the above business hours.",
      },
    ],
  },
];

const ShippingPolicy: NextPageWithLayout = () => {
  const is_prod = process.env.NODE_ENV == "production";
  const title = "Shipping & Delivery Policy | Shopinger";

  const description =
    "Read Shopinger's Shipping & Delivery Policy to understand delivery availability, shipping timelines, service areas, delivery charges, and order fulfillment.";

  const page_url = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/shipping-policy`;
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
              Shopinger – Shipping & Delivery Policy
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

export default ShippingPolicy;

ShippingPolicy.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
