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
    id: "welcome",
    title: "Welcome Statement",
    content: [
      {
        type: "text",
        text: 'Welcome to Shopinger, operated by Shopinger International Private Limited ("Shopinger", "Company", "we", "our", or "us").',
      },
      {
        type: "text",
        text: 'These Terms & Conditions ("Terms") govern your access to and use of the Shopinger website, mobile applications, Seller Platform, Business Partner Platform, Delivery Partner Platform, and all related services (collectively, the "Platform").',
      },
      {
        type: "note",
        text: "By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree with these Terms, please discontinue using the Platform.",
      },
    ],
  },
  {
    id: "1",
    title: "1. Acceptance of Terms",
    content: [
      {
        type: "text",
        text: "By using the Platform, you agree to comply with these Terms & Conditions, our Privacy Policy, Cancellation & Refund Policy, Shipping Policy, and any other policies published by Shopinger from time to time.",
      },
    ],
  },
  {
    id: "2",
    title: "2. Eligibility",
    content: [
      {
        type: "text",
        text: "You must be at least 18 years of age or otherwise legally competent under applicable law to use the Platform. Users below 18 years may use the Platform only under the supervision of a parent or legal guardian.",
      },
    ],
  },
  {
    id: "3",
    title: "3. User Account",
    content: [
      {
        type: "text",
        text: "You are responsible for maintaining the confidentiality of your account credentials.",
      },
      {
        type: "text",
        text: "You agree to provide accurate information, keep your account updated, and accept responsibility for all activities carried out through your account.",
      },
      {
        type: "highlight",
        text: "Shopinger may suspend or terminate accounts found to contain false information or involved in fraudulent activities.",
      },
    ],
  },
  {
    id: "4",
    title: "4. Marketplace Services",
    content: [
      {
        type: "text",
        text: "Shopinger operates an online marketplace connecting customers with Shopinger and independent sellers, licensed pharmacies, brands, warehouses, and delivery partners.",
      },
      {
        type: "text",
        text: "Product availability, prices, offers, and delivery timelines may vary by location and seller.",
      },
    ],
  },
  {
    id: "5",
    title: "5. Orders",
    content: [
      {
        type: "text",
        text: "All orders are subject to verification, availability, and acceptance.",
      },
      {
        type: "note",
        text: "Shopinger reserves the right to accept, reject, cancel, or limit any order, request additional verification, or refuse service where necessary.",
      },
    ],
  },
  {
    id: "6",
    title: "6. Pricing & Payments",
    content: [
      {
        type: "text",
        text: "All prices are displayed in Indian Rupees (INR).",
      },
      {
        type: "text",
        text: "Applicable taxes, delivery charges, convenience fees, platform fees, and other charges will be displayed during checkout.",
      },
      {
        type: "list",
        title:
          "Payments may be made using approved payment methods, including:",
        items: [
          "UPI",
          "Credit Cards",
          "Debit Cards",
          "Net Banking",
          "Digital Wallets",
          "Cash on Delivery (where available)",
        ],
      },
    ],
  },
  {
    id: "7",
    title: "7. Prescription Medicines",
    content: [
      {
        type: "text",
        text: "Prescription medicines are sold only by licensed pharmacies or authorized sellers in accordance with applicable laws.",
      },
      {
        type: "note",
        text: "By placing an order, you confirm that any prescription uploaded is genuine, valid, and legally belongs to the patient for whom the medicines are being purchased.",
      },
      {
        type: "highlight",
        text: "Shopinger acts solely as a technology platform and does not provide medical advice or treatment.",
      },
    ],
  },
  {
    id: "8",
    title: "8. Seller Responsibility",
    content: [
      {
        type: "text",
        text: "Independent sellers are solely responsible for their products, including quality, authenticity, pricing, descriptions, warranties, packaging, and compliance with applicable laws.",
      },
      {
        type: "text",
        text: "Shopinger facilitates transactions and is not responsible for third-party seller products unless expressly stated.",
      },
    ],
  },
  {
    id: "9",
    title: "9. Delivery",
    content: [
      {
        type: "text",
        text: "Estimated delivery times are indicative and may vary due to operational requirements, weather conditions, traffic, seller processing, public holidays, or circumstances beyond Shopinger's reasonable control.",
      },
    ],
  },
  {
    id: "10",
    title: "10. Cancellation, Return & Refund",
    content: [
      {
        type: "text",
        text: "Cancellation, Return, Replacement, and Refund requests shall be governed by the applicable Shopinger policies published on the Platform.",
      },
      {
        type: "note",
        text: "Certain products, including medicines, perishables, customized products, and personal care items, may not be eligible for return unless required by law.",
      },
    ],
  },
  {
    id: "11",
    title: "11. User Responsibilities",
    content: [
      {
        type: "list",
        title: "You agree not to:",
        items: [
          "Provide false information.",
          "Upload fake prescriptions.",
          "Engage in fraud or illegal activities.",
          "Abuse promotional offers.",
          "Upload malicious software.",
          "Violate intellectual property rights.",
          "Interfere with the operation or security of the Platform.",
        ],
      },
      {
        type: "highlight",
        text: "Violation may result in suspension, termination, or legal action.",
      },
    ],
  },
  {
    id: "12",
    title: "12. Intellectual Property",
    content: [
      {
        type: "text",
        text: "All trademarks, logos, software, graphics, content, images, videos, designs, and other intellectual property on the Platform are owned by or licensed to Shopinger International Private Limited.",
      },
      {
        type: "highlight",
        text: "Unauthorized use is strictly prohibited.",
      },
    ],
  },
  {
    id: "13",
    title: "13. Privacy",
    content: [
      {
        type: "text",
        text: "Your use of the Platform is also governed by the Shopinger Privacy Policy, which explains how your personal information is collected, processed, stored, and protected.",
      },
    ],
  },
  {
    id: "14",
    title: "14. Third-Party Services",
    content: [
      {
        type: "text",
        text: "The Platform may integrate third-party services such as payment gateways, logistics providers, mapping services, communication providers, and analytics services.",
      },
      {
        type: "text",
        text: "Shopinger is not responsible for the availability, content, or practices of third-party services.",
      },
    ],
  },
  {
    id: "15",
    title: "15. Limitation of Liability",
    content: [
      {
        type: "text",
        text: "To the maximum extent permitted by law, Shopinger shall not be liable for indirect, incidental, consequential, or special damages, including loss of profits, business interruption, data loss, seller-related disputes, product misuse, or delays beyond its reasonable control.",
      },
      {
        type: "note",
        text: "Where liability cannot be excluded under applicable law, Shopinger's liability shall be limited to the value of the relevant order.",
      },
    ],
  },
  {
    id: "16",
    title: "16. Suspension & Termination",
    content: [
      {
        type: "text",
        text: "Shopinger reserves the right to suspend, restrict, or permanently terminate any account without prior notice if a user violates these Terms, engages in fraudulent activities, misuses the Platform, or violates applicable laws.",
      },
    ],
  },
  {
    id: "17",
    title: "17. Force Majeure",
    content: [
      {
        type: "text",
        text: "Shopinger shall not be liable for delays or failures resulting from events beyond its reasonable control, including natural disasters, pandemics, cyberattacks, strikes, government actions, internet failures, or other force majeure events.",
      },
    ],
  },
  {
    id: "18",
    title: "18. Governing Law & Jurisdiction",
    content: [
      {
        type: "text",
        text: "These Terms shall be governed by the laws of India.",
      },
      {
        type: "text",
        text: "Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the competent courts located in Gorakhpur, Uttar Pradesh, India, unless otherwise required by applicable law.",
      },
    ],
  },
  {
    id: "19",
    title: "19. Changes to These Terms",
    content: [
      {
        type: "text",
        text: "Shopinger reserves the right to modify these Terms & Conditions at any time.",
      },
      {
        type: "text",
        text: "Any revised Terms will become effective upon publication on the Platform. Continued use of the Platform after such changes constitutes your acceptance of the updated Terms.",
      },
    ],
  },
  {
    id: "20",
    title: "20. Contact Us",
    content: [
      {
        type: "text",
        text: "If you have any questions, concerns, feedback, suggestions, or require assistance regarding these Terms & Conditions or any of our services, please contact our Customer Support Team.",
      },
      {
        type: "list",
        title: "Contact Details",
        items: [
          `Company: ${process.env.NEXT_PUBLIC_COMPANY_NAME}`,
          `Email: ${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`,
          `Phone: ${process.env.NEXT_PUBLIC_ADMIN_PHONE}`,
          `Website: ${process.env.NEXT_PUBLIC_BASE_URL}`,
        ],
      },
      {
        type: "text",
        text: "Our Customer Support Team will make reasonable efforts to respond to your queries during our business hours.",
      },
    ],
  },
];

const TermsAndConditionsPage: NextPageWithLayout = () => {
  const is_prod = process.env.NODE_ENV == "production";
  const title = "Terms & Conditions | Shopinger";

  const description =
    "Read the Shopinger Terms & Conditions governing your access to and use of our platform, products, services, and applications.";
  return (
    <>
      <Seo
        title={title}
        description={description}
        is_prod={is_prod}
        url={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/terms-and-conditions`}
        image="https://shopinger-uploads.s3.ap-south-1.amazonaws.com/uploads/assets/dark-mobile-logo.png"
      />
      <div className="w-full bg-gray-50 py-2 sm:py-4">
        <div className="mx-auto mt-(--header-height) max-w-7xl px-2.5 sm:px-4">
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Shopinger – Terms & Conditions
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

export default TermsAndConditionsPage;

TermsAndConditionsPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
