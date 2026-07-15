// . ypes
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local component
import PolicySection from "@/components/common/policy-section.component";

const policies = [
  {
    id: "trusted-payment-partner",
    title: "1. Trusted Payment Partner",
    paragraphs: [
      "Shopinger securely processes all online payments through Razorpay, one of India's trusted payment gateway providers.",
      "Razorpay uses advanced encryption and industry-standard security measures to process digital payments securely.",
    ],
    note: "For more information, please visit: Website: https://razorpay.com",
  },

  {
    id: "accepted-payment-methods",
    title: "2. Accepted Payment Methods",
    intro: "Shopinger currently accepts payments through:",
    list: [
      "UPI",
      "Credit Cards",
      "Debit Cards",
      "Net Banking",
      "Digital Wallets",
      "EMI (where available)",
      "Cash on Delivery (COD) (where available)",
    ],
    note: "Available payment methods may vary depending on the product, seller, delivery location, and order value.",
  },

  {
    id: "payment-authorization",
    title: "3. Payment Authorization",
    paragraphs: [
      "By completing a payment on Shopinger, you authorize Shopinger and its authorized payment partner, Razorpay, to process your payment for the order placed through the Platform.",
      "Shopinger reserves the right to verify any payment transaction before processing an order to prevent fraud, unauthorized transactions, or misuse of the Platform.",
    ],
  },

  {
    id: "currency-taxes",
    title: "4. Currency & Taxes",
    paragraphs: [
      "All payments on Shopinger are processed in Indian Rupees (INR).",
      "Applicable GST, delivery charges, convenience fees, platform fees, and other statutory charges, wherever applicable, will be displayed during checkout before payment confirmation.",
    ],
  },

  {
    id: "secure-payments",
    title: "5. Secure Payments",
    paragraphs: [
      "Your payment security is our highest priority.",
      "All online payments are securely processed through Razorpay using encrypted and industry-standard security technologies.",
    ],
    intro: "Shopinger does NOT store your:",
    list: [
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
    note: "Sensitive payment information is securely processed by Razorpay in accordance with applicable security standards.",
  },

  {
    id: "important-security-notice",
    title: "6. Important Security Notice",
    paragraphs: [
      "For your safety, Shopinger will NEVER call, message, email, WhatsApp, or contact you to request your payment or banking details.",
    ],
    intro: "We will never ask you to share:",
    list: [
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
    note: "We will also never ask you to transfer money to receive: Refunds, Cashbacks, Rewards, Discounts, Promotional Offers, Lucky Draw Prizes, Gift Vouchers.",
    highlight:
      "If anyone claiming to represent Shopinger requests your payment or banking information, do not share any confidential information. Please report such incidents immediately to our Customer Support Team.",
  },

  {
    id: "transaction-confirmation",
    title: "7. Transaction Confirmation",
    paragraphs: [
      "Once your payment is successfully completed, you will receive an order confirmation through the Shopinger Platform, email, SMS, or WhatsApp, wherever applicable.",
    ],
  },

  {
    id: "cash-on-delivery",
    title: "8. Cash on Delivery (COD)",
    paragraphs: [
      "Shopinger offers Cash on Delivery (COD) for eligible products and serviceable locations across selected cities.",
      "Cash on Delivery is available for orders with a total order value of up to 25,000 (Indian Rupees Twenty-Five Thousand only).",
      "COD availability is subject to the product category, seller, delivery location, order value, customer order history, and operational feasibility. Certain products, sellers, or locations may not be eligible for COD.",
      "Shopinger reserves the right to refuse, restrict, suspend, or disable the Cash on Delivery (COD) facility for customers with a history of repeated order cancellations, failed deliveries, fraudulent activities, misuse of the COD facility, or any other activity that may adversely affect our operations.",
      "Shopinger also reserves the right to enable, restrict, suspend, or withdraw the Cash on Delivery (COD) facility for any order, customer account, product, seller, or location at its sole discretion without prior notice.",
    ],
    note: "Customers are requested to keep the exact payable amount ready at the time of delivery wherever possible.",
  },

  {
    id: "fraud-prevention",
    title: "9. Fraud Prevention",
    intro:
      "To protect customers, sellers, and the integrity of the Platform, Shopinger continuously monitors payment transactions for suspicious or fraudulent activities. Shopinger reserves the right to:",
    list: [
      "Verify payment transactions before processing an order.",
      "Cancel suspicious or unauthorized transactions.",
      "Request additional verification or identity proof where necessary.",
      "Suspend or cancel orders associated with fraudulent activities.",
      "Report suspected fraudulent activities to the appropriate authorities where required by applicable law.",
    ],
  },

  {
    id: "failed-transactions",
    title: "10. Failed Transactions",
    intro:
      "If your payment is successfully debited but your order is not confirmed:",
    list: [
      "The payment may be automatically reversed by your bank or payment service provider.",
    ],
    paragraphs: [
      "If the amount is not reversed within the applicable timeframe, please contact our Customer Support Team with your transaction details.",
      "Shopinger shall not be responsible for any payment failure, delay, or interruption caused by banks, payment gateways, UPI service providers, card networks, internet service providers, or any third-party financial institutions beyond Shopinger's reasonable control.",
    ],
  },

  {
    id: "refund-processing",
    title: "11. Refund Processing",
    paragraphs: [
      "Approved refunds will be initiated to the original payment method used during the purchase unless otherwise required by applicable law.",
      "Refunds are generally initiated within 3-7 business days after approval.",
      "However, the final credit timeline depends on your bank, card issuer, UPI provider, or payment service provider.",
      "Shopinger is not responsible for delays caused by banks or third-party payment providers after the refund has been successfully initiated.",
    ],
  },

  {
    id: "customer-responsibility",
    title: "12. Customer Responsibility",
    intro: "Customers are responsible for:",
    list: [
      "Providing accurate payment information.",
      "Keeping their banking credentials confidential.",
      "Verifying payment details before confirming payment.",
      "Reporting any unauthorized transaction immediately.",
      "Ensuring sufficient balance or credit limit before completing a transaction.",
    ],
    note: "Never share your OTP, UPI PIN, CVV, ATM PIN, passwords, or banking credentials with anyone, including individuals claiming to represent Shopinger.",
  },

  {
    id: "payment-disputes",
    title: "13. Payment Disputes",
    paragraphs: [
      "If you believe you have been incorrectly charged or experience any payment-related issue, please contact Shopinger Customer Support before initiating a chargeback or dispute with your bank or payment service provider.",
      "Customers must provide relevant information, including the Order ID, Transaction ID, payment receipt, or any other supporting documents requested by Shopinger to facilitate the investigation.",
      "Shopinger will make reasonable efforts to investigate and resolve genuine payment-related concerns as quickly as possible.",
    ],
  },

  {
    id: "disclaimer",
    title: "14. Disclaimer",
    intro:
      "Shopinger shall not be responsible for any payment failure, transaction delay, interruption, technical error, or unsuccessful payment caused by:",
    list: [
      "Banks or financial institutions",
      "Razorpay or other authorized payment gateways",
      "UPI service providers",
      "Card networks",
      "Internet service providers",
      "Mobile network failures",
      "Customer device or software issues",
      "Any third-party system beyond Shopinger's reasonable control",
    ],
    note: "Shopinger shall not be liable for any indirect, incidental, special, or consequential losses arising from such events, except where required by applicable law.",
  },

  {
    id: "compliance",
    title: "15. Compliance",
    intro:
      "Shopinger reserves the right to suspend, reject, cancel, or refuse any payment transaction that appears suspicious, unauthorized, fraudulent, or in violation of:",
    list: [
      "Applicable laws and regulations",
      "This Payment Policy",
      "Shopinger Terms & Conditions",
      "Any other policies published by Shopinger",
    ],
    note: "Where required by law, Shopinger may cooperate with banks, payment gateways, financial institutions, and government authorities during investigations relating to fraudulent or unlawful transactions.",
  },

  {
    id: "changes-payment-policy",
    title: "16. Changes to this Payment Policy",
    paragraphs: [
      "Shopinger reserves the right to amend, modify, or update this Payment Policy at any time without prior notice.",
      "Any revised Payment Policy shall become effective immediately upon publication on the Shopinger Platform.",
      "Your continued use of the Platform after any changes constitutes your acceptance of the updated Payment Policy.",
    ],
  },

  {
    id: "contact-us",
    title: "17. Contact Us",
    paragraphs: [
      "If you have any questions, concerns, feedback, suggestions, or require assistance regarding payments or payment security, please contact our Customer Support Team.",
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

const PaymentPolicy: NextPageWithLayout = () => {
  return (
    <div className="w-full bg-gray-50 py-2 sm:py-4">
      <div className="mx-auto mt-(--header-height) max-w-7xl px-2.5 sm:px-4">
        <PolicySection policies={policies} />
      </div>
    </div>
  );
};

export default PaymentPolicy;

PaymentPolicy.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
