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

export const policies: Array<IPolicySection> = [
  {
    id: "1",
    title: "1. Introduction",
    content: [
      {
        type: "text",
        text: 'Welcome to Shopinger ("Shopinger", "we", "our", or "us"). We value your privacy and are committed to protecting your personal information.',
      },
      {
        type: "text",
        text: 'This Privacy Policy explains how we collect, use, store, disclose, and safeguard your information when you access or use our website, mobile application, and related services (collectively referred to as the "Services").',
      },
      {
        type: "text",
        text: "Your trust is important to us. We strive to process your personal information responsibly, securely, and in accordance with applicable laws of India, including the Digital Personal Data Protection Act, 2023, the Information Technology Act, 2000, and other applicable regulations.",
      },
      {
        type: "note",
        text: "By accessing or using our Services, creating an account, placing an order, or otherwise interacting with Shopinger, you acknowledge that you have read, understood, and agreed to the terms of this Privacy Policy and our Terms of Use. If you do not agree with this Privacy Policy, please discontinue using our Services.",
      },
    ],
  },
  {
    id: "2",
    title: "2. Scope and Applicability",
    content: [
      {
        type: "list",
        title:
          "This Privacy Policy applies to all personal information collected by Shopinger through:",
        items: [
          "Our official website;",
          "Our mobile applications;",
          "Customer support channels;",
          "Marketing communications;",
          "Social media pages managed by Shopinger;",
          "Online and offline interactions related to our Services.",
        ],
      },
      {
        type: "list",
        title: "This Privacy Policy governs information collected from:",
        items: [
          "Customers;",
          "Registered users;",
          "Guest users;",
          "Sellers and merchants;",
          "Delivery partners;",
          "Warehouse partners;",
          "Job applicants;",
          "Visitors to our offices or facilities where applicable.",
        ],
      },
      {
        type: "list",
        title: "This Privacy Policy does not apply to:",
        items: [
          "Third-party websites or applications linked from our Services;",
          "Payment gateways or financial institutions;",
          "Third-party marketplaces or services operating independently of Shopinger;",
          "Any website or service that maintains its own privacy policy.",
        ],
      },
      {
        type: "text",
        text: "We encourage you to review the privacy policies of such third parties before sharing your personal information with them.",
      },
    ],
  },
  {
    id: "3",
    title: "3. Acceptance of this Privacy Policy",
    content: [
      {
        type: "text",
        text: "By accessing or using our Services, you expressly consent to the collection, use, storage, processing, and disclosure of your information as described in this Privacy Policy.",
      },
      {
        type: "text",
        text: "If you provide personal information on behalf of another individual, you confirm that you are authorized to do so and have obtained all necessary permissions.",
      },
      {
        type: "text",
        text: "Your continued use of the Services after any changes to this Privacy Policy become effective constitutes your acceptance of the updated Privacy Policy.",
      },
    ],
  },
  {
    id: "4",
    title: "4. Eligibility",
    content: [
      {
        type: "text",
        text: "Our Services are intended for individuals who are legally capable of entering into a binding agreement under applicable law.",
      },
      {
        type: "text",
        text: "Users under the age of 18 years should use our Services only under the supervision and consent of a parent or legal guardian.",
      },
      {
        type: "text",
        text: "We do not knowingly collect personal information from children in violation of applicable laws. If we become aware that such information has been collected without appropriate consent, we will take reasonable steps to delete it.",
      },
    ],
  },
  {
    id: "table-of-contents-preview",
    title: "Information We Collect Overview",
    content: [
      {
        type: "list",
        title:
          "The section covers Personal Information, Account Information, Order Information, Payment Information, Device Information, Location Data, Communications, Images & CCTV, Job Applicants, Automatic Data Collection, and Cookies & Tracking Technologies.",
        items: [
          "Shopinger collects information to provide, improve, secure, and personalize its Services.",
          "The information we collect depends on how you interact with our website, mobile application, and related services.",
        ],
      },
    ],
  },
  {
    id: "5",
    title: "5. Information We Collect",
    content: [
      {
        type: "text",
        text: "We may collect information directly from you, automatically through your use of our Services, and from authorized third-party sources.",
      },
      {
        type: "list",
        title: "The categories of information we collect include:",
        items: [
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
    ],
  },
  {
    id: "5.1",
    title: "5.1 Information You Provide to Us",
    content: [
      {
        type: "text",
        text: "When you create an account, place an order, contact customer support, participate in promotional activities, apply for a job, register as a seller, warehouse partner, or delivery partner, or otherwise interact with our Services, we may collect information including:",
      },
      {
        type: "list",
        title: "Personal Information",
        items: [
          "Full Name",
          "Mobile Number",
          "Email Address",
          "Delivery Address",
          "Billing Address",
          "PIN Code",
          "Date of Birth (where required)",
          "Gender (optional)",
          "Profile Photograph (optional)",
          "Government-issued identification where required for verification",
        ],
      },
      {
        type: "note",
        text: "Providing certain information may be mandatory to access specific Services. If required information is not provided, some Services may not be available.",
      },
      {
        type: "list",
        title: "Account Information (When you register with Shopinger)",
        items: [
          "Username",
          "Password (stored using secure encryption techniques)",
          "Login credentials",
          "Account preferences",
          "Saved addresses",
          "Wishlist",
          "Language preferences",
          "Notification preferences",
          "Referral information",
          "Loyalty or rewards information (if applicable)",
        ],
      },
      {
        type: "list",
        title: "Order and Transaction Information (When you place an order)",
        items: [
          "Products ordered",
          "Quantity",
          "Order value",
          "Delivery instructions",
          "Invoice details",
          "Order history",
          "Refund requests",
          "Return requests",
          "Cancellation details",
          "Customer feedback",
          "Ratings and reviews",
        ],
      },
      {
        type: "text",
        text: "This information enables us to process and fulfil your orders efficiently.",
      },
      {
        type: "text",
        title: "Payment Information",
        text: "When you make a purchase, payments are processed through authorised third-party payment service providers. ",
      },

      {
        type: "text",
        text: "Depending on your selected payment method, information may include: ",
      },
      {
        type: "list",
        items: [
          "Payment method",
          "UPI ID",
          "Bank name",
          "Wallet provider",
          "Transaction reference number",
          "Billing address",
          "Payment status",
        ],
      },
      {
        type: "highlight",
        title: "Data Exclusions",
        text: "Shopinger does not store your complete Debit card number, Credit card number, CVV, UPI PIN, Net banking passwords, or Card PIN. Payment information is securely processed by PCI DSS-compliant payment service providers.",
      },
      {
        type: "list",
        title: "Communications (When you contact Shopinger)",
        items: [
          "Emails",
          "Chat conversations",
          "Customer support tickets",
          "Telephone recordings (where legally permitted)",
          "WhatsApp conversations",
          "Feedback",
          "Survey responses",
          "Complaint details",
        ],
      },
      {
        type: "text",
        text: "These communications help us improve customer service and resolve disputes.",
      },
      {
        type: "list",
        title: "User-Generated Content (Voluntarily submitted)",
        items: [
          "Product reviews",
          "Ratings",
          "Comments",
          "Suggestions",
          "Photographs",
          "Videos",
          "Questions and answers",
          "Testimonials",
        ],
      },
      {
        type: "text",
        text: "By submitting such content, you grant Shopinger the right to display, publish, and use it in accordance with our Terms of Use.",
      },
      {
        type: "list",
        title: "Seller, Warehouse Partner and Delivery Partner Information",
        items: [
          "Business name",
          "Contact details",
          "GST details",
          "PAN",
          "Bank account information",
          "Identity verification documents",
          "Business licences",
          "Warehouse information",
          "Delivery vehicle information",
          "Driver licence details",
          "Insurance information",
        ],
      },
      {
        type: "text",
        text: "Such information is collected only where necessary for onboarding, compliance, operational, or legal purposes.",
      },
      {
        type: "list",
        title: "Job Applicant Information (Used solely for recruitment)",
        items: [
          "Resume/CV",
          "Educational qualifications",
          "Employment history",
          "Skills",
          "Certifications",
          "References",
          "Identity documents",
          "Background verification information where permitted by law",
        ],
      },
    ],
  },
  {
    id: "5.2",
    title: "5.2 Information Collected Automatically",
    content: [
      {
        type: "list",
        title: "Device Information",
        items: [
          "Device model",
          "Operating system",
          "Browser type",
          "Browser version",
          "Device identifiers",
          "Mobile network information",
          "Screen resolution",
          "App version",
          "Crash reports",
          "Performance diagnostics",
        ],
      },
      {
        type: "list",
        title: "Log Information",
        items: [
          "IP Address",
          "Login date and time",
          "Pages visited",
          "Session duration",
          "Clickstream data",
          "Referring URLs",
          "Search history within the Services",
          "Error logs",
          "App usage statistics",
        ],
      },
      {
        type: "list",
        title: "Location Information (Collected with permission)",
        items: [
          "GPS location",
          "Approximate location",
          "Delivery location",
          "Real-time device location",
        ],
      },
      {
        type: "list",
        title: "Location purposes include:",
        items: [
          "Display nearby products",
          "Calculate delivery availability",
          "Improve delivery accuracy",
          "Prevent fraudulent transactions",
          "Provide location-based offers",
        ],
      },
      {
        type: "note",
        text: "You may disable location permissions through your device settings. However, certain location-based Services may not function correctly.",
      },
      {
        type: "list",
        title:
          "Cookies and Similar Technologies (Cookies, pixels, web beacons, SDKs, local storage)",
        items: [
          "Keep you signed in",
          "Remember preferences",
          "Improve website performance",
          "Analyse traffic",
          "Measure marketing effectiveness",
          "Prevent fraud",
          "Enhance security",
          "Personalise content",
          "Recommend products",
          "Improve user experience",
        ],
      },
      {
        type: "note",
        text: "You may manage cookies through your browser settings. Disabling cookies may affect the functionality of certain Services.",
      },
      {
        type: "list",
        title: "Analytics (Tools used to understand metrics for improvements)",
        items: [
          "User behaviour",
          "Feature usage",
          "Performance metrics",
          "Customer engagement",
          "Purchase trends",
          "Website traffic",
          "App performance",
        ],
      },
      {
        type: "text",
        title: "Advertising Information",
        text: "Where permitted by law, we may collect information relating to advertisements viewed, clicked, or interacted with to measure campaign effectiveness and provide more relevant promotional content.",
      },
      {
        type: "note",
        text: "Users may opt out of certain marketing communications through their account settings or by following unsubscribe instructions.",
      },
    ],
  },
  {
    id: "6",
    title: "6. Information We Receive from Third Parties",
    content: [
      {
        type: "list",
        title:
          "We may receive information about you from trusted third parties, including:",
        items: [
          "Payment service providers",
          "Logistics and delivery partners",
          "Sellers and merchants",
          "Identity verification providers",
          "Marketing and advertising partners",
          "Social media platforms (when you choose to sign in using them)",
          "Analytics providers",
          "Government authorities where legally required",
        ],
      },
      {
        type: "text",
        text: "We combine such information with information already available to us to improve our Services, verify user identities, detect fraud, and comply with legal obligations.",
      },
    ],
  },
  {
    id: "7",
    title: "7. How We Use Your Information",
    content: [
      {
        type: "list",
        title:
          "We use your information for legitimate business and operational purposes, including to:",
        items: [
          "Create and manage your account.",
          "Process, confirm, and deliver your orders.",
          "Process returns, exchanges, and refunds.",
          "Verify your identity and prevent fraud.",
          "Provide customer support.",
          "Communicate important updates regarding your account or orders.",
          "Improve our website, mobile application, and Services.",
          "Personalize your shopping experience.",
          "Recommend products and services based on your interests.",
          "Send promotional offers, discounts, newsletters, and marketing communications where permitted by law.",
          "Conduct surveys and research.",
          "Analyze customer behavior and improve business operations.",
          "Monitor platform performance and security.",
          "Detect, investigate, and prevent fraudulent or illegal activities.",
          "Enforce our Terms of Use and other policies.",
          "Comply with applicable laws, court orders, and regulatory requirements.",
        ],
      },
    ],
  },
  {
    id: "8",
    title: "8. Legal Basis for Processing Personal Information",
    content: [
      {
        type: "list",
        title:
          "Where required under applicable law, Shopinger processes personal information based on one or more of the following grounds:",
        items: [
          "Your consent.",
          "Performance of a contract with you.",
          "Compliance with legal obligations.",
          "Protection against fraud and misuse.",
          "Legitimate business interests, provided they do not override your rights.",
        ],
      },
    ],
  },
  {
    id: "9",
    title: "9. Sharing of Personal Information",
    content: [
      {
        type: "highlight",
        text: "Shopinger does not sell your personal information.",
      },
      {
        type: "list",
        title: "We may share information with:",
        items: [
          "Service Providers: Including payment processors, cloud hosting providers, customer support providers, SMS and email service providers, analytics providers, IT support vendors, and fraud detection partners.",
          "Sellers: To process and fulfil your orders, your delivery details and order-related information may be shared with the relevant seller.",
          "Delivery Partners: To enable successful delivery of your orders.",
          "Warehouse Partners: Where required for inventory management, order fulfilment, and logistics.",
          "Financial Institutions: Banks, payment gateways, UPI providers, and wallet providers for processing transactions.",
          "Government Authorities: Where disclosure is required by law, court order, or governmental request.",
          "Corporate Transactions: If Shopinger is involved in a merger, acquisition, restructuring, investment, sale of assets, or similar corporate transaction, your information may be transferred as part of that transaction, subject to applicable law.",
        ],
      },
    ],
  },
  {
    id: "10",
    title: "10. Cookies and Similar Technologies",
    content: [
      {
        type: "list",
        title: "We use cookies and similar technologies to:",
        items: [
          "Authenticate users.",
          "Remember preferences.",
          "Improve website functionality.",
          "Analyse traffic.",
          "Measure advertising performance.",
          "Prevent fraud.",
          "Enhance security.",
          "Personalize content.",
        ],
      },
      {
        type: "note",
        text: "You may disable cookies through your browser settings. Certain features may not function correctly if cookies are disabled.",
      },
    ],
  },
  {
    id: "11",
    title: "11. Marketing Communications",
    content: [
      {
        type: "list",
        title:
          "With your consent or where otherwise permitted by law, Shopinger may send:",
        items: [
          "Promotional emails",
          "SMS",
          "WhatsApp messages",
          "Push notifications",
          "App notifications",
          "Special offers",
          "Product recommendations",
          "Service updates",
        ],
      },
      {
        type: "note",
        text: "You may opt out of promotional communications at any time by following the unsubscribe instructions or updating your communication preferences. You will continue to receive transactional communications related to your account or orders.",
      },
    ],
  },
  {
    id: "12",
    title: "12. Data Security",
    content: [
      {
        type: "text",
        text: "Shopinger maintains reasonable administrative, technical, and physical safeguards designed to protect personal information against unauthorized access, loss, misuse, alteration, or disclosure.",
      },
      {
        type: "list",
        title: "Security measures may include:",
        items: [
          "SSL/TLS encryption",
          "Encrypted passwords",
          "Secure payment processing",
          "Firewalls",
          "Access controls",
          "Security monitoring",
          "Employee confidentiality obligations",
          "Regular security assessments",
        ],
      },
      {
        type: "note",
        text: "Despite our efforts, no method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security.",
      },
    ],
  },
  {
    id: "13",
    title: "13. Data Retention",
    content: [
      {
        type: "list",
        title:
          "We retain personal information only for as long as necessary to:",
        items: [
          "Provide our Services.",
          "Complete transactions.",
          "Resolve disputes.",
          "Enforce agreements.",
          "Prevent fraud.",
          "Meet accounting, tax, audit, and legal obligations.",
        ],
      },
      {
        type: "text",
        text: "When information is no longer required, it is securely deleted, anonymized, or otherwise disposed of in accordance with applicable law.",
      },
    ],
  },
  {
    id: "14",
    title: "14. Your Rights",
    content: [
      {
        type: "list",
        title: "Subject to applicable law, you may have the right to:",
        items: [
          "Access your personal information.",
          "Correct inaccurate information.",
          "Update your account information.",
          "Request deletion of your account.",
          "Withdraw consent where applicable.",
          "Restrict or object to certain processing activities.",
          "Request information regarding how your personal information is processed.",
          "Lodge complaints with the appropriate authority where permitted by law.",
        ],
      },
      {
        type: "text",
        text: "Requests may be subject to verification of your identity.",
      },
    ],
  },
  {
    id: "15",
    title: "15. Account Deletion",
    content: [
      {
        type: "text",
        text: "You may request deletion of your Shopinger account by contacting Customer Support or through any account deletion feature provided within the Services. Following verification, we will process your request in accordance with applicable law.",
      },
      {
        type: "list",
        title:
          "Certain information may continue to be retained where required for:",
        items: [
          "Legal compliance",
          "Tax purposes",
          "Fraud prevention",
          "Dispute resolution",
          "Enforcement of agreements",
        ],
      },
    ],
  },
  {
    id: "16",
    title: "16. Children's Privacy",
    content: [
      {
        type: "text",
        text: "Our Services are not intended for children under the age of 18 without parental or guardian supervision. We do not knowingly collect personal information from children in violation of applicable law.",
      },
      {
        type: "text",
        text: "If you believe that a child has provided us with personal information without appropriate authorization, please contact us so we can take appropriate action.",
      },
    ],
  },
  {
    id: "17",
    title: "17. Third-Party Websites and Services",
    content: [
      {
        type: "text",
        text: "Our Services may contain links to third-party websites or services. Shopinger is not responsible for the privacy practices, content, or security of third-party websites.",
      },
      {
        type: "text",
        text: "Users should review the privacy policies of those third parties before providing personal information.",
      },
    ],
  },
  {
    id: "18",
    title: "18. International Data Transfers",
    content: [
      {
        type: "text",
        text: "Where required for business operations, personal information may be processed or stored outside India by trusted service providers.",
      },
      {
        type: "text",
        text: "Where such transfers occur, Shopinger will take reasonable steps to ensure appropriate safeguards consistent with applicable law.",
      },
    ],
  },
  {
    id: "19",
    title: "19. Changes to this Privacy Policy",
    content: [
      {
        type: "text",
        text: "Shopinger may update this Privacy Policy from time to time to reflect changes in law, technology, business operations, or our Services.",
      },
      {
        type: "text",
        text: 'Any revised Privacy Policy will be published on our website and mobile application with the updated "Last Updated" date.',
      },
      {
        type: "text",
        text: "Your continued use of the Services after such changes become effective constitutes acceptance of the revised Privacy Policy.",
      },
    ],
  },
  {
    id: "20",
    title: "20. Contact Us",
    content: [
      {
        type: "list",
        title:
          "If you have any questions, concerns, or requests regarding this Privacy Policy or the processing of your personal information, please contact us:",
        items: [
          `Company: ${process.env.NEXT_PUBLIC_COMPANY_NAME}`,
          `Email: ${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`,
          `Phone: ${process.env.NEXT_PUBLIC_ADMIN_PHONE}`,
          `Website: ${process.env.NEXT_PUBLIC_BASE_URL}`,
        ],
      },
    ],
  },
];

const PrivacyPolicyPage: NextPageWithLayout = () => {
  const is_prod = process.env.NODE_ENV == "production";
  return (
    <>
      <Seo
        title="Privacy Policy | Shopinger"
        description="Read Shopinger's Privacy Policy to understand how we collect, use, disclose, and protect your personal information."
        is_prod={is_prod}
        url={`${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`}
        image="https://shopinger-uploads.s3.ap-south-1.amazonaws.com/uploads/assets/dark-mobile-logo.png"
      />
      <div className="w-full bg-gray-50 py-2 sm:py-4">
        <div className="mx-auto mt-(--header-height) max-w-7xl px-2.5 sm:px-4">
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Privacy Policy
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

export default PrivacyPolicyPage;

PrivacyPolicyPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
