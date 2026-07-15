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
        text: "This Cancellation, Return & Refund Policy explains the conditions under which customers may cancel orders, request returns, replacements, exchanges, or refunds for products purchased through the Shopinger Platform.",
      },
      {
        type: "note",
        text: "By placing an order on Shopinger, you agree to this Policy.",
      },
    ],
  },
  {
    id: "1",
    title: "1. Order Cancellation",
    content: [
      {
        type: "text",
        text: "Customers may cancel an order before it has been accepted by the seller, packed, shipped, or marked as Out for Delivery, unless otherwise stated on the product page.",
      },
      {
        type: "highlight",
        text: "Shopinger reserves the right to cancel any order due to product unavailability, pricing or technical errors, payment verification failure, suspected fraudulent activity, legal requirements, or other operational reasons. Eligible refunds, if applicable, will be processed in accordance with this Policy.",
      },
    ],
  },
  {
    id: "2",
    title: "2. Return Eligibility",
    content: [
      {
        type: "list",
        title: "Products may be eligible for return if:",
        items: [
          "The product is received in a damaged condition.",
          "The product is defective or not functioning as intended.",
          "An incorrect product has been delivered.",
          "Accessories or items are missing from the package.",
          "The product is materially different from its description on the Platform.",
        ],
      },
      {
        type: "note",
        text: "Return requests must be submitted within the return period specified on the respective product page.",
      },
    ],
  },
  {
    id: "3",
    title: "3. Non-Returnable Products",
    content: [
      {
        type: "list",
        title:
          "Unless otherwise required under applicable law, the following products are generally not eligible for return:",
        items: [
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
    ],
  },
  {
    id: "4",
    title: "4. Replacement Policy",
    content: [
      {
        type: "text",
        text: "Eligible products may qualify for a replacement instead of a refund, subject to product availability and seller approval.",
      },
      {
        type: "note",
        text: "If a replacement is unavailable, Shopinger may process a refund in accordance with this Policy.",
      },
    ],
  },
  {
    id: "5",
    title: "5. Open Box Delivery",
    content: [
      {
        type: "text",
        text: "For products delivered under the Open Box Delivery service, customers must inspect the product in the presence of the Shopinger Delivery Partner before accepting delivery.",
      },
      {
        type: "text",
        text: "Visible physical damage, incorrect products, or missing items must be reported immediately during delivery.",
      },
      {
        type: "highlight",
        text: "Once the customer accepts the product after Open Box Delivery, claims relating to visible physical damage, incorrect product delivery, or missing items may not be accepted, except where required under applicable law.",
      },
    ],
  },
  {
    id: "6",
    title: "6. Refund Policy",
    content: [
      {
        type: "text",
        text: "Approved refunds will be initiated after successful verification of the returned product or approval of the cancellation request, as applicable.",
      },
      {
        type: "list",
        title: "Refund Assignment Details",
        items: [
          "Prepaid orders will generally be refunded to the original payment method.",
          "Cash on Delivery (COD) orders may be refunded to the customer's bank account, UPI ID, or Shopinger Wallet (where available).",
        ],
      },
      {
        type: "note",
        text: "Refunds are generally initiated within 3–7 business days after approval. The final credit timeline depends on the customer's bank or payment service provider.",
      },
    ],
  },
  {
    id: "7",
    title: "7. Return Pickup",
    content: [
      {
        type: "text",
        text: "Where return pickup is available, Shopinger or its authorized logistics partner will arrange the collection of eligible products.",
      },
      {
        type: "list",
        title: "Customers should return the product along with:",
        items: [
          "Original packaging",
          "Original accessories",
          "User manuals",
          "Warranty cards (if applicable)",
          "Free promotional items received with the order (if applicable)",
        ],
      },
    ],
  },
  {
    id: "8",
    title: "8. Return Rejection",
    content: [
      {
        type: "list",
        title: "Shopinger reserves the right to reject a return request if:",
        items: [
          "The product has been damaged due to customer misuse or negligence.",
          "The product has been used beyond reasonable inspection.",
          "Original accessories or packaging are missing.",
          "The return request is submitted after the applicable return period.",
          "The product is not eligible for return under this Policy.",
        ],
      },
    ],
  },
  {
    id: "9",
    title: "9. Exchange Policy",
    content: [
      {
        type: "list",
        title: "Eligible products may be exchanged for:",
        items: [
          "The same product.",
          "Another size.",
          "Another colour or variant.",
        ],
      },
      {
        type: "note",
        text: "Exchange requests are subject to stock availability, seller approval, and the product category.",
      },
    ],
  },
  {
    id: "10",
    title: "10. Exceptions",
    content: [
      {
        type: "list",
        title:
          "Shopinger reserves the right to refuse any cancellation, return, replacement, exchange, or refund request where:",
        items: [
          "The request is fraudulent or abusive.",
          "False or misleading information has been provided.",
          "The product has been intentionally damaged after delivery.",
          "The customer repeatedly misuses the return or refund process.",
          "The request does not satisfy the conditions of this Policy.",
        ],
      },
    ],
  },
  {
    id: "11",
    title: "11. Contact Us",
    content: [
      {
        type: "text",
        text: "If you have any questions, concerns, feedback, or require assistance regarding cancellations, returns, replacements, exchanges, or refunds, please contact our Customer Support Team.",
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

const CancellationAndRefundPolicy: NextPageWithLayout = () => {
  const is_prod = process.env.NODE_ENV == "production";
  const title = "Cancellation, Return & Refund Policy | Shopinger";

  const description =
    "Read Shopinger's Cancellation, Return & Refund Policy to understand order cancellations, return eligibility, refund processing, replacement requests, and applicable conditions.";

  const page_url = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/cancellation-and-refund-policy`;
  return (
    <>
      <Seo
        title={title}
        description={description}
        is_prod={is_prod}
        url={page_url}
        image="https://shopinger-uploads.s3.ap-south-1.amazonaws.com/uploads/assets/dark-mobile-logo.png"
      />
      <div className="w-full bg-gray-50 py-2 sm:py-4">
        <div className="mx-auto mt-(--header-height) max-w-7xl px-2.5 sm:px-4">
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Shopinger – Cancellation, Return & Refund Policy
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

export default CancellationAndRefundPolicy;

CancellationAndRefundPolicy.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
