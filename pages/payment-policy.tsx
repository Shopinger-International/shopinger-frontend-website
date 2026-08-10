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
        text: 'This Payment Policy explains the payment methods accepted on the Shopinger Platform, how payments are processed, payment security practices, refund processing, and the responsibilities of customers while making purchases through the Shopinger website, mobile applications, Seller Platform, Business Partner Platform, Delivery Partner Platform, and related services (collectively, the "Platform").',
      },
      {
        type: "note",
        text: "By placing an order or making a payment through the Platform, you agree to this Payment Policy.",
      },
    ],
  },
  {
    id: "1",
    title: "1. Trusted Payment Partner",
    content: [
      {
        type: "text",
        text: "Shopinger securely processes all online payments through Razorpay, one of India's trusted payment gateway providers.",
      },
      {
        type: "text",
        text: "Razorpay uses advanced encryption and industry-standard security measures to process digital payments securely.",
      },
      {
        type: "list",
        title: "For more information, please visit:",
        items: ["Website: https://razorpay.com"],
      },
    ],
  },
  {
    id: "2",
    title: "2. Accepted Payment Methods",
    content: [
      {
        type: "list",
        title: "Shopinger currently accepts payments through:",
        items: [
          "UPI",
          "Credit Cards",
          "Debit Cards",
          "Net Banking",
          "Digital Wallets",
          "EMI (where available)",
          "Cash on Delivery (COD) (where available)",
        ],
      },
      {
        type: "note",
        text: "Available payment methods may vary depending on the product, seller, delivery location, and order value.",
      },
    ],
  },
  {
    id: "3",
    title: "3. Payment Authorization",
    content: [
      {
        type: "text",
        text: "By completing a payment on Shopinger, you authorize Shopinger and its authorized payment partner, Razorpay, to process your payment for the order placed through the Platform.",
      },
      {
        type: "highlight",
        text: "Shopinger reserves the right to verify any payment transaction before processing an order to prevent fraud, unauthorized transactions, or misuse of the Platform.",
      },
    ],
  },
  {
    id: "4",
    title: "4. Currency & Taxes",
    content: [
      {
        type: "text",
        text: "All payments on Shopinger are processed in Indian Rupees (INR).",
      },
      {
        type: "text",
        text: "Applicable GST, delivery charges, convenience fees, platform fees, and other statutory charges, wherever applicable, will be displayed during checkout before payment confirmation.",
      },
    ],
  },
  {
    id: "5",
    title: "5. Secure Payments",
    content: [
      {
        type: "text",
        text: "Your payment security is our highest priority. All online payments are securely processed through Razorpay using encrypted and industry-standard security technologies.",
      },
      {
        type: "list",
        title: "Shopinger does NOT store your:",
        items: [
          "Credit Card Number",
          "Debit Card Number",
          "CVV",
          "UPI PIN",
          "ATM PIN",
          "Internet Banking Username",
          "Internet Banking Password",
          "Bank Account Password",
          "Payment Authentication Credentials",
        ],
      },
      {
        type: "text",
        text: "Sensitive payment information is securely processed by Razorpay in accordance with applicable security standards.",
      },
    ],
  },
  {
    id: "6",
    title: "6. Important Security Notice",
    content: [
      {
        type: "highlight",
        text: "For your safety, Shopinger will NEVER call, message, email, WhatsApp, or contact you to request your payment or banking details.",
      },
      {
        type: "list",
        title: "We will never ask you to share:",
        items: [
          "One-Time Password (OTP)",
          "UPI PIN",
          "Credit or Debit Card Number",
          "CVV",
          "ATM PIN",
          "Internet Banking Username or Password",
          "Bank Account Password",
          "Payment Authentication Codes",
          "Screen-sharing access through AnyDesk, TeamViewer, QuickSupport, or similar applications",
        ],
      },
      {
        type: "list",
        title: "We will also never ask you to transfer money to receive:",
        items: [
          "Refunds",
          "Cashbacks",
          "Rewards",
          "Discounts",
          "Promotional Offers",
          "Lucky Draw Prizes",
          "Gift Vouchers",
        ],
      },
      {
        type: "note",
        text: "If anyone claiming to represent Shopinger requests your payment or banking information, do not share any confidential information. Please report such incidents immediately to our Customer Support Team.",
      },
    ],
  },
  {
    id: "7",
    title: "7. Transaction Confirmation",
    content: [
      {
        type: "text",
        text: "Once your payment is successfully completed, you will receive an order confirmation through the Shopinger Platform, email, SMS, or WhatsApp, wherever applicable.",
      },
    ],
  },
  {
    id: "8",
    title: "8. Cash on Delivery (COD)",
    content: [
      {
        type: "text",
        text: "Shopinger offers Cash on Delivery (COD) for eligible products and serviceable locations across selected cities.",
      },
      {
        type: "text",
        text: "Cash on Delivery is available for orders with a total order value of up to ₹25,000 (Indian Rupees Twenty-Five Thousand only).",
      },
      {
        type: "note",
        text: "COD availability is subject to the product category, seller, delivery location, order value, customer order history, and operational feasibility. Certain products, sellers, or locations may not be eligible for COD.",
      },
      {
        type: "highlight",
        text: "Shopinger reserves the right to refuse, restrict, suspend, or disable the Cash on Delivery (COD) facility for customers with a history of repeated order cancellations, failed deliveries, fraudulent activities, misuse of the COD facility, or any other activity that may adversely affect our operations.",
      },
      {
        type: "text",
        text: "Shopinger also reserves the right to enable, restrict, suspend, or withdraw the Cash on Delivery (COD) facility for any order, customer account, product, seller, or location at its sole discretion without prior notice.",
      },
      {
        type: "text",
        text: "Customers are requested to keep the exact payable amount ready at the time of delivery wherever possible.",
      },
    ],
  },
  {
    id: "9",
    title: "9. Fraud Prevention",
    content: [
      {
        type: "text",
        text: "To protect customers, sellers, and the integrity of the Platform, Shopinger continuously monitors payment transactions for suspicious or fraudulent activities.",
      },
      {
        type: "list",
        title: "Shopinger reserves the right to:",
        items: [
          "Verify payment transactions before processing an order.",
          "Cancel suspicious or unauthorized transactions.",
          "Request additional verification or identity proof where necessary.",
          "Suspend or cancel orders associated with fraudulent activities.",
          "Report suspected fraudulent activities to the appropriate authorities where required by applicable law.",
        ],
      },
    ],
  },
  {
    id: "10",
    title: "10. Failed Transactions",
    content: [
      {
        type: "text",
        text: "If your payment is successfully debited but your order is not confirmed, the payment may be automatically reversed by your bank or payment service provider.",
      },
      {
        type: "note",
        text: "If the amount is not reversed within the applicable timeframe, please contact our Customer Support Team with your transaction details.",
      },
      {
        type: "text",
        text: "Shopinger shall not be responsible for any payment failure, delay, or interruption caused by banks, payment gateways, UPI service providers, card networks, internet service providers, or any third-party financial institutions beyond Shopinger's reasonable control.",
      },
    ],
  },
  {
    id: "11",
    title: "11. Refund Processing",
    content: [
      {
        type: "text",
        text: "Approved refunds will be initiated to the original payment method used during the purchase unless otherwise required by applicable law.",
      },
      {
        type: "text",
        text: "Refunds are generally initiated within 3-7 business days after approval. However, the final credit timeline depends on your bank, card issuer, UPI provider, or payment service provider.",
      },
      {
        type: "note",
        text: "Shopinger is not responsible for delays caused by banks or third-party payment providers after the refund has been successfully initiated.",
      },
    ],
  },
  {
    id: "12",
    title: "12. Customer Responsibility",
    content: [
      {
        type: "list",
        title: "Customers are responsible for:",
        items: [
          "Providing accurate payment information.",
          "Keeping their banking credentials confidential.",
          "Verifying payment details before confirming payment.",
          "Reporting any unauthorized transaction immediately.",
          "Ensuring sufficient balance or credit limit before completing a transaction.",
        ],
      },
      {
        type: "highlight",
        text: "Never share your OTP, UPI PIN, CVV, ATM PIN, passwords, or banking credentials with anyone, including individuals claiming to represent Shopinger.",
      },
    ],
  },
  {
    id: "13",
    title: "13. Payment Disputes",
    content: [
      {
        type: "text",
        text: "If you believe you have been incorrectly charged or experience any payment-related issue, please contact Shopinger Customer Support before initiating a chargeback or dispute with your bank or payment service provider.",
      },
      {
        type: "text",
        text: "Customers must provide relevant information, including the Order ID, Transaction ID, payment receipt, or any other supporting documents requested by Shopinger to facilitate the investigation.",
      },
      {
        type: "text",
        text: "Shopinger will make reasonable efforts to investigate and resolve genuine payment-related concerns as quickly as possible.",
      },
    ],
  },
  {
    id: "14",
    title: "14. Disclaimer",
    content: [
      {
        type: "list",
        title:
          "Shopinger shall not be responsible for any payment failure, transaction delay, interruption, technical error, or unsuccessful payment caused by:",
        items: [
          "Banks or financial institutions",
          "Razorpay or other authorized payment gateways",
          "UPI service providers",
          "Card networks",
          "Internet service providers",
          "Mobile network failures",
          "Customer device or software issues",
          "Any third-party system beyond Shopinger's reasonable control",
        ],
      },
      {
        type: "text",
        text: "Shopinger shall not be liable for any indirect, incidental, special, or consequential losses arising from such events, except where required by applicable law.",
      },
    ],
  },
  {
    id: "15",
    title: "15. Compliance",
    content: [
      {
        type: "list",
        title:
          "Shopinger reserves the right to suspend, reject, cancel, or refuse any payment transaction that appears suspicious, unauthorized, fraudulent, or in violation of:",
        items: [
          "Applicable laws and regulations",
          "This Payment Policy",
          "Shopinger Terms & Conditions",
          "Any other policies published by Shopinger",
        ],
      },
      {
        type: "text",
        text: "Where required by law, Shopinger may cooperate with banks, payment gateways, financial institutions, and government authorities during investigations relating to fraudulent or unlawful transactions.",
      },
    ],
  },
  {
    id: "16",
    title: "16. Changes to this Payment Policy",
    content: [
      {
        type: "text",
        text: "Shopinger reserves the right to amend, modify, or update this Payment Policy at any time without prior notice.",
      },
      {
        type: "text",
        text: "Any revised Payment Policy shall become effective immediately upon publication on the Shopinger Platform.",
      },
      {
        type: "note",
        text: "Your continued use of the Platform after any changes constitutes your acceptance of the updated Payment Policy.",
      },
    ],
  },
  {
    id: "17",
    title: "17. Contact Us",
    content: [
      {
        type: "text",
        text: "If you have any questions, concerns, feedback, suggestions, or require assistance regarding payments or payment security, please contact our Customer Support Team.",
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

const PaymentPolicy: NextPageWithLayout = () => {
  const is_prod = process.env.NODE_ENV == "production";
  const title = "Payment Policy | Shopinger";

  const description =
    "Read Shopinger's Payment Policy to understand the accepted payment methods, billing process, payment authorization, refunds, and transaction guidelines.";

  const page_url = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/payment-policy`;
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
              Shopinger – Payment Policy
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

export default PaymentPolicy;

PaymentPolicy.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
