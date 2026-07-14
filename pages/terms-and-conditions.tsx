// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import Hero from "@/components/terms-and-conditions/hero.component";
import PolicySection from "@/components/common/policy-section.component";

const policies = [
  {
    id: "acceptance-of-terms",
    title: "Acceptance of Terms",
    paragraphs: [
      "By using the Platform, you agree to comply with these Terms & Conditions, our Privacy Policy, Cancellation & Refund Policy, Shipping Policy, and any other policies published by Shopinger from time to time.",
    ],
  },

  {
    id: "eligibility",
    title: "Eligibility",
    paragraphs: [
      "You must be at least 18 years of age or otherwise legally competent under applicable law to use the Platform.",
      "Users below 18 years may use the Platform only under the supervision of a parent or legal guardian.",
    ],
  },

  {
    id: "user-account",
    title: "User Account",
    intro: "By creating and using a Shopinger account, you agree to:",
    list: [
      "Maintain the confidentiality of your account credentials.",
      "Provide accurate and complete information.",
      "Keep your account information updated.",
      "Accept responsibility for all activities carried out through your account.",
    ],
    note: "Shopinger may suspend or terminate accounts found to contain false information or involved in fraudulent activities.",
  },

  {
    id: "marketplace-services",
    title: "Marketplace Services",
    paragraphs: [
      "Shopinger operates an online marketplace connecting customers with Shopinger and independent sellers, licensed pharmacies, brands, warehouses, and delivery partners.",
      "Product availability, prices, offers, and delivery timelines may vary by location and seller.",
    ],
  },

  {
    id: "orders",
    title: "Orders",
    paragraphs: [
      "All orders are subject to verification, availability, and acceptance.",
    ],
    note: "Shopinger reserves the right to accept, reject, cancel, or limit any order, request additional verification, or refuse service where necessary.",
  },

  {
    id: "pricing-payments",
    title: "Pricing & Payments",
    paragraphs: [
      "All prices are displayed in Indian Rupees (INR).",
      "Applicable taxes, delivery charges, convenience fees, platform fees, and other charges will be displayed during checkout.",
    ],
    intro: "Payments may be made using approved payment methods, including:",
    list: [
      "UPI",
      "Credit Cards",
      "Debit Cards",
      "Net Banking",
      "Digital Wallets",
      "Cash on Delivery (where available)",
    ],
  },

  {
    id: "prescription-medicines",
    title: "Prescription Medicines",
    paragraphs: [
      "Prescription medicines are sold only by licensed pharmacies or authorized sellers in accordance with applicable laws.",
      "By placing an order, you confirm that any prescription uploaded is genuine, valid, and legally belongs to the patient for whom the medicines are being purchased.",
    ],
    note: "Shopinger acts solely as a technology platform and does not provide medical advice or treatment.",
  },

  {
    id: "seller-responsibility",
    title: "Seller Responsibility",
    paragraphs: [
      "Independent sellers are solely responsible for their products, including quality, authenticity, pricing, descriptions, warranties, packaging, and compliance with applicable laws.",
    ],
    note: "Shopinger facilitates transactions and is not responsible for third-party seller products unless expressly stated.",
  },

  {
    id: "delivery",
    title: "Delivery",
    paragraphs: [
      "Estimated delivery times are indicative only and may vary due to operational requirements, weather conditions, traffic, seller processing, public holidays, or circumstances beyond Shopinger's reasonable control.",
    ],
  },

  {
    id: "cancellation-return-refund",
    title: "Cancellation, Return & Refund",
    paragraphs: [
      "Cancellation, Return, Replacement, and Refund requests shall be governed by the applicable Shopinger policies published on the Platform.",
    ],
    note: "Certain products, including medicines, perishables, customized products, and personal care items, may not be eligible for return unless required by law.",
  },

  {
    id: "user-responsibilities",
    title: "User Responsibilities",
    intro: "You agree not to:",
    list: [
      "Provide false information.",
      "Upload fake prescriptions.",
      "Engage in fraud or illegal activities.",
      "Abuse promotional offers.",
      "Upload malicious software.",
      "Violate intellectual property rights.",
      "Interfere with the operation or security of the Platform.",
    ],
    note: "Violation of these responsibilities may result in suspension, termination, or legal action.",
  },

  {
    id: "intellectual-property",
    title: "Intellectual Property",
    paragraphs: [
      "All trademarks, logos, software, graphics, content, images, videos, designs, and other intellectual property on the Platform are owned by or licensed to Shopinger International Private Limited.",
    ],
    note: "Unauthorized use is strictly prohibited.",
  },

  {
    id: "privacy",
    title: "Privacy",
    paragraphs: [
      "Your use of the Platform is also governed by the Shopinger Privacy Policy, which explains how your personal information is collected, processed, stored, and protected.",
    ],
  },

  {
    id: "third-party-services",
    title: "Third-Party Services",
    paragraphs: [
      "The Platform may integrate third-party services such as payment gateways, logistics providers, mapping services, communication providers, and analytics services.",
    ],
    note: "Shopinger is not responsible for the availability, content, or practices of third-party services.",
  },

  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law, Shopinger shall not be liable for indirect, incidental, consequential, or special damages, including loss of profits, business interruption, data loss, seller-related disputes, product misuse, or delays beyond its reasonable control.",
    ],
    highlight:
      "Where liability cannot be excluded under applicable law, Shopinger's liability shall be limited to the value of the relevant order.",
  },

  {
    id: "suspension-termination",
    title: "Suspension & Termination",
    paragraphs: [
      "Shopinger reserves the right to suspend, restrict, or permanently terminate any account without prior notice if a user violates these Terms, engages in fraudulent activities, misuses the Platform, or violates applicable laws.",
    ],
  },

  {
    id: "force-majeure",
    title: "Force Majeure",
    paragraphs: [
      "Shopinger shall not be liable for delays or failures resulting from events beyond its reasonable control, including natural disasters, pandemics, cyberattacks, strikes, government actions, internet failures, or other force majeure events.",
    ],
  },

  {
    id: "governing-law",
    title: "Governing Law & Jurisdiction",
    paragraphs: [
      "These Terms shall be governed by the laws of India.",
      "Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the competent courts located in Gorakhpur, Uttar Pradesh, India, unless otherwise required by applicable law.",
    ],
  },

  {
    id: "changes-to-terms",
    title: "Changes to These Terms",
    paragraphs: [
      "Shopinger reserves the right to modify these Terms & Conditions at any time.",
      "Any revised Terms will become effective upon publication on the Platform. Continued use of the Platform after such changes constitutes your acceptance of the updated Terms.",
    ],
  },

  {
    id: "contact-us",
    title: "Contact Us",
    intro:
      "If you have any questions, concerns, feedback, suggestions, or require assistance regarding these Terms & Conditions or any of our services, you can contact us through:",
    list: ["Phone: +91 94157 61434", "Email: info@shopinger.co.in"],
    note: "Our Customer Support Team will make reasonable efforts to respond to your queries during business hours.",
  },
];

const TermsAndConditionsPage: NextPageWithLayout = () => {
  return (
    <div className="w-full bg-gray-50 py-2 sm:py-4">
      <div className="mx-auto mt-(--header-height) max-w-7xl px-2.5 sm:px-4">
        <Hero />
        <PolicySection policies={policies}/>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;

TermsAndConditionsPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
