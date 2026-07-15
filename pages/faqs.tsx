import { useState } from "react";
// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import Badge from "@/components/about-us/badge.component";

const faqs_data = [
  {
    category: "General",
    questions: [
      {
        id: 1,
        question: "What is Shopinger?",
        answer:
          "Shopinger is an Indian Quick Commerce and Online Marketplace platform that enables customers to shop from 30,000+ products through the Shopinger website and mobile application. Shopinger currently serves Gorakhpur, Uttar Pradesh, and selected PIN codes in New Delhi, with plans to expand to more cities across India.",
      },
      {
        id: 2,
        question: "Where is Shopinger currently available?",
        answer:
          "Shopinger currently operates in Gorakhpur, Uttar Pradesh, and selected PIN codes in New Delhi. Service availability depends on your delivery address or PIN code.",
      },
      {
        id: 3,
        question: "How can I check whether Shopinger delivers to my location?",
        answer:
          "Enter your delivery address or PIN code on the Shopinger website or mobile application. If your location is serviceable, available products and estimated delivery time will be displayed.",
      },
      {
        id: 4,
        question: "What products are available on Shopinger?",
        answer:
          "Shopinger offers 30,000+ products across multiple categories, including groceries, fresh fruits & vegetables, dairy, bakery, beverages, snacks, household essentials, personal care, beauty products, baby care, pet care, health & wellness products, electronics, fashion, stationery, and more. Product availability may vary depending on your location.",
      },
      {
        id: 5,
        question:
          "Does Shopinger sell cigarettes, tobacco products, and sexual wellness products?",
        answer:
          "Yes. Shopinger may offer eligible tobacco products and sexual wellness products, including condoms, in selected serviceable locations where permitted by applicable laws. Customers purchasing tobacco products must be 18 years of age or older, and age verification may be required at the time of delivery. Sexual wellness products are delivered in discreet packaging to protect customer privacy.",
      },
    ],
  },
  {
    category: "Orders",
    questions: [
      {
        id: 6,
        question: "How do I place an order?",
        answer:
          "Browse products, add your preferred items to your cart, proceed to checkout, select your delivery address and payment method, and confirm your order.",
      },
      {
        id: 7,
        question: "Can I modify or cancel my order?",
        answer:
          "Orders may be modified or cancelled before they are packed or dispatched, subject to availability and the applicable Shopinger Cancellation Policy.",
      },
      {
        id: 8,
        question: "Why was my order or an item in my order cancelled?",
        answer:
          "Orders or individual items may be cancelled due to product unavailability, payment failure, pricing errors, delivery restrictions, suspected fraudulent activity, or other operational or legal reasons. Any eligible refund will be processed in accordance with the Shopinger Refund Policy.",
      },
      {
        id: 9,
        question: "How can I track my order?",
        answer:
          "You can track your order from the My Orders section of your Shopinger account. You may also receive order updates through SMS, email, or push notifications.",
      },
      {
        id: 10,
        question: "What should I do if my order is delayed?",
        answer:
          "Delivery may be delayed due to weather conditions, traffic, high order volumes, product availability, or other operational reasons. You can check your order status in My Orders or contact Customer Support.",
      },
    ],
  },
  {
    category: "Delivery",
    questions: [
      {
        id: 11,
        question: "How long does delivery take?",
        answer:
          "Estimated delivery time is displayed before you place your order. Delivery timelines may vary depending on your location, product availability, weather conditions, traffic, and operational requirements.",
      },
      {
        id: 12,
        question: "Is there a delivery fee?",
        answer:
          "Delivery charges, if applicable, are displayed during checkout before you confirm your order.",
      },
      {
        id: 13,
        question:
          "What happens if a product becomes unavailable after I place my order?",
        answer:
          "If a product becomes unavailable before dispatch, Shopinger may remove the item from your order or cancel the affected item. Any eligible refund will be processed in accordance with the Shopinger Refund Policy.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        id: 14,
        question: "What is Shopinger's Return, Replacement & Refund Policy?",
        answer:
          "Eligible products may be returned, replaced, or refunded in accordance with the Shopinger Return, Replacement & Refund Policy. Eligibility depends on the product category and the reason for the request.",
      },
      {
        id: 15,
        question: "Which products are not eligible for return or replacement?",
        answer:
          "Certain products, including perishable goods, fresh fruits & vegetables, dairy products, frozen foods, personal care items, intimate products, and other specified categories, may not be eligible for return or replacement unless required under the applicable policy.",
      },
      {
        id: 16,
        question:
          "What should I do if I receive a damaged, defective, incorrect, or missing product?",
        answer:
          "Please report the issue through the Help & Support section or contact Customer Support as soon as possible after delivery. Eligible requests will be reviewed in accordance with the applicable policy.",
      },
      {
        id: 17,
        question: "When and how will I receive my refund?",
        answer:
          "Approved refunds are processed to the original payment method or another eligible refund method, as applicable. Processing time may vary depending on your bank or payment provider.",
      },
    ],
  },
  {
    category: "Payments & Security",
    questions: [
      {
        id: 18,
        question: "Which payment methods does Shopinger accept?",
        answer:
          "Shopinger accepts UPI, Debit Cards, Credit Cards, Net Banking, Digital Wallets, and Cash on Delivery (COD) for eligible orders.",
      },
      {
        id: 19,
        question:
          "What should I do if my payment fails or the amount is deducted but my order is not confirmed?",
        answer:
          "If your payment is unsuccessful but the amount has been debited, it is generally reversed automatically by your bank or payment provider. If the amount is not reversed within the applicable timeframe, please contact Customer Support with your transaction details.",
      },
      {
        id: 20,
        question: "Is my personal information secure?",
        answer:
          "Yes. Shopinger uses reasonable administrative, technical, and organizational security measures to protect your personal information. Please refer to our Privacy Policy for more information about how we collect, use, and safeguard your data.",
      },
    ],
  },
  {
    category: "Customer Support",
    questions: [
      {
        id: 21,
        question: "How can I contact Shopinger Customer Support?",
        answer:
          "If you need assistance with your orders, payments, deliveries, returns, or any other queries, you can contact us through: \n• Help & Support: Available on the Shopinger website and mobile application \n• Email: info@shopinger.co.in \n• Phone: +91 9415761434 \n\nIf your question is not answered here, please contact our Customer Support team, and we will be happy to assist you.",
      },
    ],
  },
];

const FAQSPage: NextPageWithLayout = () => {
  const [expanded_id, setExpandedId] = useState<number | null>(null);

  const toggleAccordion = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full bg-gray-50 py-2 sm:py-4">
      <div className="mx-auto mt-(--header-height) max-w-7xl px-2.5 sm:px-4">
        {/* Hero */}
        <div className="mb-4 text-center sm:mb-10">
          <Badge title="Help center" />

          <h1 className="mt-3 text-lg font-bold tracking-tight text-gray-900 sm:mt-4 sm:text-3xl">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-1 max-w-2xl text-sm leading-6 text-gray-600 sm:mt-4 sm:text-lg sm:leading-8">
            Find answers to common questions about orders, payments, deliveries,
            returns, accounts, and using Shopinger.
          </p>
        </div>

        <div className="space-y-10">
          {faqs_data.map((section) => (
            <section
              key={section.category}
              className="rounded-2xl border border-gray-200 bg-white shadow-xs"
            >
              {/* Category */}
              <div className="border-b border-gray-200 px-6 py-5">
                <h2 className="border-l-4 border-orange-500 pl-3 text-base font-semibold text-gray-900 sm:pl-4 sm:text-xl">
                  {section.category}
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {section.questions.map((item) => {
                  const is_open = expanded_id === item.id;

                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => toggleAccordion(item.id)}
                        className={`flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-200 hover:bg-gray-50 ${
                          is_open ? "bg-orange-50" : ""
                        }`}
                      >
                        <span className="pr-6 text-base font-medium text-gray-900">
                          {item.question}
                        </span>

                        <div
                          className={`flex size-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 sm:size-8 ${
                            is_open
                              ? "rotate-180 border-orange-500 bg-orange-500 text-white"
                              : "border-gray-300 text-gray-500"
                          }`}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          is_open ? "max-h-96" : "max-h-0"
                        }`}
                      >
                        <div className="border-t border-orange-100 bg-orange-50/30 px-6 py-5">
                          <p className="leading-8 whitespace-pre-line text-gray-600">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSPage;

FAQSPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
