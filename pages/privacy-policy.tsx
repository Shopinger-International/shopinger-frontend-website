// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import PolicySection from "@/components/common/policy-section.component";

const policies = [
  {
    id: "introduction",
    title: "1. Introduction",
    paragraphs: [
      'Welcome to Shopinger ("Shopinger", "we", "our", or "us"). We value your privacy and are committed to protecting your personal information.',
      'This Privacy Policy explains how we collect, use, store, disclose, and safeguard your information when you access or use our website, mobile application, and related services (collectively referred to as the "Services").',
      "Your trust is important to us. We strive to process your personal information responsibly, securely, and in accordance with applicable laws of India, including the Digital Personal Data Protection Act, 2023, the Information Technology Act, 2000, and other applicable regulations.",
      "By accessing or using our Services, creating an account, placing an order, or otherwise interacting with Shopinger, you acknowledge that you have read, understood, and agreed to the terms of this Privacy Policy and our Terms of Use.",
    ],
    note: "If you do not agree with this Privacy Policy, please discontinue using our Services.",
  },

  {
    id: "scope-applicability",
    title: "2. Scope and Applicability",
    intro:
      "This Privacy Policy applies to all personal information collected by Shopinger through:",
    list: [
      "Our official website",
      "Our mobile applications",
      "Customer support channels",
      "Marketing communications",
      "Social media pages managed by Shopinger",
      "Online and offline interactions related to our Services",
    ],
    paragraphs: [
      "This Privacy Policy governs information collected from: Customers, Registered users, Guest users, Sellers and merchants, Delivery partners, Warehouse partners, Job applicants, and Visitors to our offices or facilities where applicable.",
      "This Privacy Policy does not apply to third-party websites or applications linked from our Services, payment gateways or financial institutions, third-party marketplaces or services operating independently of Shopinger, or any website or service that maintains its own privacy policy.",
    ],
    note: "We encourage you to review the privacy policies of such third parties before sharing your personal information with them.",
  },

  {
    id: "acceptance",
    title: "3. Acceptance of this Privacy Policy",
    paragraphs: [
      "By accessing or using our Services, you expressly consent to the collection, use, storage, processing, and disclosure of your information as described in this Privacy Policy.",
      "If you provide personal information on behalf of another individual, you confirm that you are authorized to do so and have obtained all necessary permissions.",
      "Your continued use of the Services after any changes to this Privacy Policy become effective constitutes your acceptance of the updated Privacy Policy.",
    ],
  },

  {
    id: "eligibility",
    title: "4. Eligibility & Information Collection Overview",
    paragraphs: [
      "Our Services are intended for individuals who are legally capable of entering into a binding agreement under applicable law.",
      "Users under the age of 18 years should use our Services only under the supervision and consent of a parent or legal guardian.",
      "We do not knowingly collect personal information from children in violation of applicable laws. If we become aware that such information has been collected without appropriate consent, we will take reasonable steps to delete it.",
    ],
    intro: "Information We Collect, which will cover:",
    list: [
      "Personal Information",
      "Account Information",
      "Order Information",
      "Payment Information",
      "Device Information",
      "Location Data",
      "Communications",
      "Images & CCTV",
      "Job Applicants",
      "Automatic Data Collection",
      "Cookies & Tracking Technologies",
    ],
    note: "Shopinger collects information to provide, improve, secure, and personalize its Services. The information we collect depends on how you interact with our website, mobile application, and related services.",
  },
  {
    id: "information-categories",
    title: "5. Information We Collect",
    paragraphs: [
      "We may collect information directly from you, automatically through your use of our Services, and from authorized third-party sources.",
    ],
    intro: "The categories of information we collect include:",
    list: [
      "Personal Information",
      "Account Information",
      "Order and Transaction Information",
      "Payment Information",
      "Device and Technical Information",
      "Location Information",
      "Communications",
      "User-Generated Content",
      "Marketing Preferences",
      "Information from Third Parties",
      "Information collected through Cookies and Similar Technologies",
    ],
  },
  {
    id: "information-you-provide",
    title: "5.1 Information You Provide to Us",
    intro:
      "When you create an account, place an order, contact customer support, participate in promotional activities, apply for a job, register as a seller, warehouse partner, or delivery partner, or otherwise interact with our Services, we may collect information including:",
    list: [
      "Personal Information: Full Name, Mobile Number, Email Address, Delivery Address, Billing Address, PIN Code, Date of Birth (where required), Gender (optional), Profile Photograph (optional), and Government-issued identification where required for verification.",
      "Account Information: Username, Password (stored using secure encryption), Login credentials, Account preferences, Saved addresses, Wishlist, Language preferences, Notification preferences, Referral information, and Loyalty or rewards information (if applicable).",
      "Order and Transaction Information: Products ordered, Quantity, Order value, Delivery instructions, Invoice details, Order history, Refund requests, Return requests, Cancellation details, Customer feedback, Ratings and reviews.",
    ],
    note: "Providing certain information may be mandatory to access specific Services. If required information is not provided, some Services may not be available.",
  },

  {
    id: "payment-information",
    title: "Payment Information",
    intro:
      "When you make a purchase, payments are processed through authorised third-party payment service providers. Depending on your selected payment method, information may include:",
    list: [
      "Payment method",
      "UPI ID",
      "Bank name",
      "Wallet provider",
      "Transaction reference number",
      "Billing address",
      "Payment status",
    ],
    paragraphs: [
      "Shopinger does not store your complete Debit card number, Credit card number, CVV, UPI PIN, Net banking passwords, or Card PIN.",
    ],
    note: "Payment information is securely processed by PCI DSS-compliant payment service providers.",
  },

  {
    id: "communications",
    title: "Communications & User-Generated Content",
    intro:
      "When you contact Shopinger or interact with our platform, we may collect:",
    list: [
      "Emails, Chat conversations, Customer support tickets, Telephone recordings (where legally permitted), WhatsApp conversations, Feedback, Survey responses, and Complaint details.",
      "User-Generated Content: Product reviews, Ratings, Comments, Suggestions, Photographs, Videos, Questions and answers, and Testimonials.",
    ],
    paragraphs: [
      "By submitting user-generated content, you grant Shopinger the right to display, publish, and use it in accordance with our Terms of Use.",
    ],
  },

  {
    id: "partners-and-applicants",
    title: "Business Partner & Job Applicant Information",
    intro:
      "Where applicable, Shopinger may collect information necessary for compliance and operational purposes:",
    list: [
      "Seller, Warehouse and Delivery Partner Information: Business name, Contact details, GST details, PAN, Bank account information, Identity verification documents, Business licences, Warehouse information, Delivery vehicle information, Driver licence details, Insurance information.",
      "Job Applicant Information: Resume/CV, Educational qualifications, Employment history, Skills, Certifications, References, Identity documents, Background verification information where permitted by law.",
    ],
  },

  {
    id: "automatic-data-collection",
    title: "5.2 Information Collected Automatically",
    intro:
      "When you access or use our Services, certain information may be collected automatically, including:",
    list: [
      "Device Information: Device model, Operating system, Browser type, Browser version, Device identifiers, Mobile network information, Screen resolution, App version, Crash reports, Performance diagnostics.",
      "Log Information: IP Address, Login date and time, Pages visited, Session duration, Clickstream data, Referring URLs, Search history within the Services, Error logs, App usage statistics.",
      "Location Information: GPS location, Approximate location, Delivery location, Real-time device location (used to display nearby products, calculate delivery availability, improve delivery accuracy, prevent fraud, and provide location-based offers).",
    ],
    note: "You may disable location permissions through your device settings. However, certain location-based Services may not function correctly.",
  },

  {
    id: "cookies-and-analytics",
    title: "Cookies, Similar Technologies & Analytics",
    intro:
      "Shopinger uses cookies, pixels, web beacons, SDKs, local storage, and similar technologies to:",
    list: [
      "Keep you signed in and remember preferences.",
      "Improve website/app performance, analyze traffic, and evaluate customer engagement.",
      "Measure marketing effectiveness and advertising campaign performance.",
      "Prevent fraud, enhance security, and personalize content/product recommendations.",
    ],
    note: "You may manage cookies through your browser settings. Disabling cookies may affect the functionality of certain Services.",
  },

  {
    id: "third-party-receipt",
    title: "6. Information We Receive from Third Parties",
    intro:
      "We may receive information about you from trusted third parties, including:",
    list: [
      "Payment service providers, logistics and delivery partners.",
      "Sellers, merchants, and identity verification providers.",
      "Marketing, advertising, and analytics providers.",
      "Social media platforms (when you choose to sign in using them).",
      "Government authorities where legally required.",
    ],
    paragraphs: [
      "We combine such information with information already available to us to improve our Services, verify user identities, detect fraud, and comply with legal obligations.",
    ],
  },

  {
    id: "how-we-use-information",
    title: "7. How We Use Your Information",
    intro:
      "We use your information for legitimate business and operational purposes, including to:",
    list: [
      "Create and manage your account, verify your identity, and provide customer support.",
      "Process, confirm, deliver orders, and manage returns, exchanges, and refunds.",
      "Communicate important updates regarding your account or orders.",
      "Improve our website, mobile application, and personalization features.",
      "Send promotional offers, discounts, newsletters, and marketing communications where permitted by law.",
      "Conduct surveys, analyze customer behavior, and monitor platform security.",
      "Detect, investigate, prevent fraudulent or illegal activities, and enforce our terms.",
      "Comply with applicable laws, court orders, and regulatory requirements.",
    ],
  },

  {
    id: "legal-basis",
    title: "8. Legal Basis for Processing Personal Information",
    intro:
      "Where required under applicable law, Shopinger processes personal information based on one or more of the following grounds:",
    list: [
      "Your consent.",
      "Performance of a contract with you.",
      "Compliance with legal obligations.",
      "Protection against fraud and misuse.",
      "Legitimate business interests, provided they do not override your rights.",
    ],
  },

  {
    id: "information-sharing",
    title: "9. Sharing of Personal Information",
    paragraphs: ["Shopinger does not sell your personal information."],
    intro: "We may share information with:",
    list: [
      "Service Providers: payment processors, cloud hosting, customer support, SMS/email vendors, analytics, and fraud partners.",
      "Sellers, Delivery Partners, and Warehouse Partners: to process, fulfill, and deliver your orders.",
      "Financial Institutions: banks, payment gateways, UPI providers, and wallet providers for processing transactions.",
      "Government Authorities: where disclosure is required by law, court order, or governmental request.",
    ],
    highlight:
      "Corporate Transactions: If Shopinger is involved in a merger, acquisition, restructuring, investment, sale of assets, or similar corporate transaction, your information may be transferred as part of that transaction, subject to applicable law.",
  },

  {
    id: "marketing-communications",
    title: "11. Marketing Communications",
    intro:
      "With your consent or where otherwise permitted by law, Shopinger may send:",
    list: [
      "Promotional emails, SMS, and WhatsApp messages.",
      "Push notifications and app notifications.",
      "Special offers, product recommendations, and service updates.",
    ],
    paragraphs: [
      "You may opt out of promotional communications at any time by following the unsubscribe instructions or updating your communication preferences.",
    ],
    note: "You will continue to receive transactional communications related to your account or orders.",
  },

  {
    id: "data-security-retention",
    title: "12 & 13. Data Security and Data Retention",
    paragraphs: [
      "Shopinger maintains reasonable administrative, technical, and physical safeguards designed to protect personal information against unauthorized access, loss, misuse, alteration, or disclosure using SSL/TLS encryption, secure firewalls, and access controls.",
      "Despite our efforts, no method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security.",
      "We retain personal information only for as long as necessary to provide services, complete transactions, resolve disputes, enforce agreements, prevent fraud, and meet legal/tax obligations.",
    ],
  },

  {
    id: "user-rights",
    title: "14 & 15. Your Rights and Account Deletion",
    intro: "Subject to applicable law, you may have the right to:",
    list: [
      "Access, correct, or update your personal information.",
      "Request deletion of your account or withdraw consent where applicable.",
      "Restrict or object to processing activities and query how your information is processed.",
      "Lodge complaints with the appropriate authority where permitted by law.",
    ],
    paragraphs: [
      "You may request deletion of your Shopinger account by contacting Customer Support. Following verification, we will process your request in accordance with applicable law.",
    ],
    note: "Certain information may continue to be retained where required for legal compliance, tax purposes, fraud prevention, or dispute resolution.",
  },

  {
    id: "international-transfers",
    title: "18. International Data Transfers",
    paragraphs: [
      "Where required for business operations, personal information may be processed or stored outside India by trusted service providers. Where such transfers occur, Shopinger will take reasonable steps to ensure appropriate safeguards consistent with applicable law.",
    ],
  },

  {
    id: "policy-updates-contact",
    title: "19 & 20. Changes and Contact Information",
    paragraphs: [
      "Shopinger may update this Privacy Policy from time to time. Any revised Policy will be published with the updated 'Last Updated' date, and continued use constitutes acceptance.",
    ],
    intro:
      "For any questions, concerns, or requests, you can reach out to us at:",
    list: [
      "Company: Shopinger International Private Limited",
      `Email: ${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`,
      `Phone:${process.env.NEXT_PUBLIC_ADMIN_PHONE} `,
      `Website: ${process.env.NEXT_PUBLIC_BASE_URL}`,
    ],
    note: "Last Updated: 14 July 2026",
  },
];
const PrivacyPolicyPage: NextPageWithLayout = () => {
  return (
    <div className="w-full bg-gray-50 py-2 sm:py-4">
      <div className="mx-auto mt-(--header-height) max-w-7xl px-2.5 sm:px-4">
        <p className="mt-2 text-sm text-gray-600 -mb-3">
          Last Updated:{" "}
          <time dateTime="2026-07-14" className="font-medium text-gray-600">
            July 2026
          </time>
        </p>
        <PolicySection policies={policies} />
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

PrivacyPolicyPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
