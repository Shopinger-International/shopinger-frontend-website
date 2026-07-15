// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local component
import PolicySection from "@/components/common/policy-section.component";

const policies = [
  {
    id: "shipping-overview",
    title: "1. Shipping Overview",
    paragraphs: [
      'Welcome to Shopinger, operated by Shopinger International Private Limited ("Shopinger", "Company", "we", "our", or "us"). This Shipping & Delivery Policy explains how orders are processed, shipped, tracked, and delivered through the Shopinger Platform. By placing an order on the Platform, you agree to this Shipping & Delivery Policy.',
      "Shopinger operates its own logistics network and authorized Shopinger Delivery Partners to provide fast, reliable, and secure delivery of orders.",
      "Delivery services are available only in selected cities and serviceable locations where Shopinger operates.",
    ],
  },

  {
    id: "order-processing",
    title: "2. Order Processing",
    intro: "Orders are processed after:",
    list: [
      "Successful order placement.",
      "Payment confirmation for prepaid orders.",
      "Seller confirmation (where applicable).",
      "Prescription verification for prescription medicines, wherever required under applicable law.",
    ],
    note: "Orders are generally processed as quickly as possible. Processing time may vary depending on product availability, seller confirmation, prescription verification, order volume, or operational requirements.",
  },

  {
    id: "address-accuracy",
    title: "3. Address Accuracy",
    paragraphs: [
      "Customers are responsible for providing a complete and accurate delivery address, including the correct PIN code, landmark (if applicable), and contact number.",
      "Shopinger shall not be responsible for delivery delays or failed deliveries resulting from incorrect, incomplete, or inaccurate delivery information provided by the customer.",
    ],
  },

  {
    id: "delivery-timelines",
    title: "4. Delivery Timelines",
    paragraphs: [
      "Shopinger aims to deliver orders within the following estimated timelines:",
      "• 0-1 KM: Within 9 Minutes\n• 1-3 KM: 10-30 Minutes\n• 3-10 KM: 30-99 Minutes\n• 10-20 KM: Same-Day Delivery\n• Outside Hyperlocal Delivery Zone: 1-3 Business Days",
      "The above timelines are estimates only and should not be interpreted as guaranteed delivery times. Actual delivery may vary depending on operational, logistical, weather-related, regulatory, or other unforeseen circumstances.",
    ],
  },

  {
    id: "delivery-charges",
    title: "5. Delivery Charges",
    intro:
      "Delivery charges, if applicable, will be displayed during checkout before payment confirmation. Shopinger may offer:",
    list: [
      "Free Delivery",
      "Discounted Delivery Charges",
      "Promotional Delivery Offers",
    ],
    note: "Such offers may be subject to minimum order value, product category, delivery location, or promotional terms.",
  },

  {
    id: "order-tracking",
    title: "6. Order Tracking",
    paragraphs: [
      "Customers can track their orders in real time through the Shopinger website or mobile application.",
      "Order updates may also be shared through SMS, email, WhatsApp, or push notifications, wherever applicable.",
    ],
  },

  {
    id: "delivery-attempts",
    title: "7. Delivery Attempts",
    intro:
      "Our delivery partner may contact you before or during delivery to ensure successful delivery. If delivery cannot be completed because:",
    list: [
      "The customer is unavailable;",
      "The delivery address is incorrect or incomplete;",
      "The customer cannot be contacted; or",
      "The order is refused without a valid reason,",
    ],
    note: "Shopinger may cancel the order or reschedule the delivery, depending on operational feasibility.",
  },

  {
    id: "delivery-delays",
    title: "8. Delivery Delays",
    intro:
      "Although Shopinger strives to deliver every order within the estimated timeline, delays may occasionally occur due to circumstances beyond our reasonable control, including:",
    list: [
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
    note: "In such situations, orders may be delivered on the same day or within 1-3 business days, depending on the nature of the delay.",
  },

  {
    id: "damaged-missing-incorrect-orders",
    title: "9. Damaged, Missing, or Incorrect Orders",
    paragraphs: [
      "If you receive a damaged, tampered, incorrect, or incomplete order, please report the issue to Shopinger Customer Support within 24 hours of delivery.",
      "After verification, Shopinger will provide an appropriate resolution in accordance with the applicable Cancellation, Return & Refund Policy.",
    ],
  },

  {
    id: "inspection-at-delivery",
    title: "10. Inspection at Delivery",
    paragraphs: [
      "Customers are encouraged to inspect the package at the time of delivery.",
      "If the package appears damaged, tampered with, or incomplete, please inform the delivery partner immediately and report the issue to Shopinger Customer Support.",
    ],
  },

  {
    id: "open-box-delivery",
    title: "11. Open Box Delivery",
    paragraphs: [
      "To enhance customer satisfaction and ensure product quality, Shopinger may provide Open Box Delivery for selected eligible products.",
    ],
    intro: "Open Box Delivery is generally available for:",
    list: [
      "Mobile Phones with an order value of ₹10,000 or above",
      "Other eligible high-value products as determined by Shopinger from time to time",
    ],
    highlight:
      "During Open Box Delivery, the Shopinger Delivery Partner will open the package in the customer's presence solely to verify: The correct product has been delivered, the product is free from visible physical damage, and the product matches the customer's order.",
    note: "Open Box Delivery does not include product installation, setup, demonstration, activation, or functional testing. Once the customer accepts the product after Open Box Delivery, claims relating to visible physical damage, missing items, or incorrect product delivery may not be accepted, except where required under applicable law. Open Box Delivery is available only for eligible products and selected serviceable locations. Shopinger reserves the right to introduce, modify, restrict, or discontinue Open Box Delivery at its sole discretion without prior notice.",
  },

  {
    id: "delivery-area-service-availability",
    title: "12. Delivery Area & Service Availability",
    paragraphs: [
      "Delivery services are available only in locations where Shopinger currently operates.",
      "Shopinger reserves the right to add, remove, expand, suspend, or modify its delivery service areas at any time without prior notice.",
      "Certain products or services may not be available for delivery in all serviceable locations.",
    ],
  },

  {
    id: "contact-us",
    title: "13. Contact Us",
    paragraphs: [
      "If you have any questions, concerns, feedback, suggestions, or require assistance regarding shipping or delivery, please contact our Customer Support Team.",
    ],
    intro: "Customer Support",
    note: "Our Customer Support Team will make reasonable efforts to respond to your queries during the above business hours. Effective Date: July 2026",
    contact: {
      company: process.env.NEXT_PUBLIC_COMPANY_NAME,
      email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      phone: process.env.NEXT_PUBLIC_ADMIN_PHONE,
      website: process.env.NEXT_PUBLIC_BASE_URL,
    },
  },
];

const ShippingPolicy: NextPageWithLayout = () => {
  return (
    <div className="w-full bg-gray-50 py-2 sm:py-4">
      <div className="mx-auto mt-(--header-height) max-w-7xl px-2.5 sm:px-4">
        <PolicySection policies={policies} />
      </div>
    </div>
  );
};

export default ShippingPolicy;

ShippingPolicy.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
