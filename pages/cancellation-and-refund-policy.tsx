// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local component
import PolicySection from "@/components/common/policy-section.component";

const policies = [
  {
    id: "cancellation-overview",
    title: "1. Policy Overview",
    paragraphs: [
      'Welcome to Shopinger, operated by Shopinger International Private Limited ("Shopinger", "Company", "we", "our", or "us"). This Cancellation, Return & Refund Policy explains the conditions under which customers may cancel orders, request returns, replacements, exchanges, or refunds for products purchased through the Shopinger Platform.',
      "By placing an order on Shopinger, you agree to this Policy.",
    ],
  },

  {
    id: "order-cancellation",
    title: "1. Order Cancellation",
    paragraphs: [
      "Customers may cancel an order before it has been accepted by the seller, packed, shipped, or marked as Out for Delivery, unless otherwise stated on the product page.",
      "Shopinger reserves the right to cancel any order due to product unavailability, pricing or technical errors, payment verification failure, suspected fraudulent activity, legal requirements, or other operational reasons. Eligible refunds, if applicable, will be processed in accordance with this Policy.",
    ],
  },

  {
    id: "return-eligibility",
    title: "2. Return Eligibility",
    intro: "Products may be eligible for return if:",
    list: [
      "The product is received in a damaged condition.",
      "The product is defective or not functioning as intended.",
      "An incorrect product has been delivered.",
      "Accessories or items are missing from the package.",
      "The product is materially different from its description on the Platform.",
    ],
    note: "Return requests must be submitted within the return period specified on the respective product page.",
  },

  {
    id: "non-returnable-products",
    title: "3. Non-Returnable Products",
    intro:
      "Unless otherwise required under applicable law, the following products are generally not eligible for return:",
    list: [
      "Prescription medicines",
      "Perishable goods",
      "Fresh fruits and vegetables",
      "Dairy products",
      "Flowers and plants",
      "Opened food and beverages",
      "Personal care and hygiene products after opening",
      "Innerwear and intimate wear",
      "Customized or personalized products",
      "Gift Cards",
      "Digital products",
      "Products specifically marked as Non-Returnable",
    ],
  },

  {
    id: "replacement-policy",
    title: "4. Replacement Policy",
    paragraphs: [
      "Eligible products may qualify for a replacement instead of a refund, subject to product availability and seller approval.",
      "If a replacement is unavailable, Shopinger may process a refund in accordance with this Policy.",
    ],
  },

  {
    id: "open-box-delivery",
    title: "5. Open Box Delivery",
    paragraphs: [
      "For products delivered under the Open Box Delivery service, customers must inspect the product in the presence of the Shopinger Delivery Partner before accepting delivery.",
      "Visible physical damage, incorrect products, or missing items must be reported immediately during delivery.",
      "Once the customer accepts the product after Open Box Delivery, claims relating to visible physical damage, incorrect product delivery, or missing items may not be accepted, except where required under applicable law.",
    ],
  },

  {
    id: "refund-policy",
    title: "6. Refund Policy",
    paragraphs: [
      "Approved refunds will be initiated after successful verification of the returned product or approval of the cancellation request, as applicable.",
      "Prepaid orders will generally be refunded to the original payment method.",
      "Cash on Delivery (COD) orders may be refunded to the customer's bank account, UPI ID, or Shopinger Wallet (where available).",
      "Refunds are generally initiated within 3-7 business days after approval. The final credit timeline depends on the customer's bank or payment service provider.",
    ],
  },

  {
    id: "return-pickup",
    title: "7. Return Pickup",
    paragraphs: [
      "Where return pickup is available, Shopinger or its authorized logistics partner will arrange the collection of eligible products.",
    ],
    intro: "Customers should return the product along with:",
    list: [
      "Original packaging",
      "Original accessories",
      "User manuals",
      "Warranty cards (if applicable)",
      "Free promotional items received with the order (if applicable)",
    ],
  },

  {
    id: "return-rejection",
    title: "8. Return Rejection",
    intro: "Shopinger reserves the right to reject a return request if:",
    list: [
      "The product has been damaged due to customer misuse or negligence.",
      "The product has been used beyond reasonable inspection.",
      "Original accessories or packaging are missing.",
      "The return request is submitted after the applicable return period.",
      "The product is not eligible for return under this Policy.",
    ],
  },

  {
    id: "exchange-policy",
    title: "9. Exchange Policy",
    intro: "Eligible products may be exchanged for:",
    list: ["The same product.", "Another size.", "Another colour or variant."],
    note: "Exchange requests are subject to stock availability, seller approval, and the product category.",
  },

  {
    id: "exceptions",
    title: "10. Exceptions",
    intro:
      "Shopinger reserves the right to refuse any cancellation, return, replacement, exchange, or refund request where:",
    list: [
      "The request is fraudulent or abusive.",
      "False or misleading information has been provided.",
      "The product has been intentionally damaged after delivery.",
      "The customer repeatedly misuses the return or refund process.",
      "The request does not satisfy the conditions of this Policy.",
    ],
  },

  {
    id: "contact-us",
    title: "11. Contact Us",
    paragraphs: [
      "If you have any questions, concerns, feedback, or require assistance regarding cancellations, returns, replacements, exchanges, or refunds, please contact our Customer Support Team.",
    ],
    intro: "Customer Support",
    note: "Our Customer Support Team will make reasonable efforts to respond to your queries during the above business hours.",
    contact: {
      company: process.env.NEXT_PUBLIC_COMPANY_NAME,
      email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      phone: process.env.NEXT_PUBLIC_ADMIN_PHONE,
      website: process.env.NEXT_PUBLIC_BASE_URL,
    },
  },
];
const CancellationAndRefundPolicy: NextPageWithLayout = () => {
  return (
    <div className="w-full bg-gray-50 py-2 sm:py-4">
      <div className="mx-auto mt-(--header-height) max-w-7xl px-2.5 sm:px-4">
        <PolicySection policies={policies} />
      </div>
    </div>
  );
};

export default CancellationAndRefundPolicy;

CancellationAndRefundPolicy.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
