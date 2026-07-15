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
      "If you do not agree with this Privacy Policy, please discontinue using our Services.",
    ],
  },

  {
    id: "scope-and-applicability",
    title: "2. Scope and Applicability",
    intro:
      "This Privacy Policy applies to all personal information collected by Shopinger through:",
    list: [
      "Our official website;",
      "Our mobile applications;",
      "Customer support channels;",
      "Marketing communications;",
      "Social media pages managed by Shopinger;",
      "Online and offline interactions related to our Services.",
    ],
    paragraphs: [
      "This Privacy Policy governs information collected from: Customers; Registered users; Guest users; Sellers and merchants; Delivery partners; Warehouse partners; Job applicants; Visitors to our offices or facilities where applicable.",
      "This Privacy Policy does not apply to: Third-party websites or applications linked from our Services; Payment gateways or financial institutions; Third-party marketplaces or services operating independently of Shopinger; Any website or service that maintains its own privacy policy.",
    ],
    note: "We encourage you to review the privacy policies of such third parties before sharing your personal information with them.",
  },

  {
    id: "acceptance-of-this-privacy-policy",
    title: "3. Acceptance of this Privacy Policy",
    paragraphs: [
      "By accessing or using our Services, you expressly consent to the collection, use, storage, processing, and disclosure of your information as described in this Privacy Policy.",
      "If you provide personal information on behalf of another individual, you confirm that you are authorized to do so and have obtained all necessary permissions.",
      "Your continued use of the Services after any changes to this Privacy Policy become effective constitutes your acceptance of the updated Privacy Policy.",
    ],
  },

  {
    id: "eligibility-and-overview",
    title: "4. Eligibility",
    intro:
      "Our Services are intended for individuals who are legally capable of entering into a binding agreement under applicable law. Users under the age of 18 years should use our Services only under the supervision and consent of a parent or legal guardian. We do not knowingly collect personal information from children in violation of applicable laws. If we become aware that such information has been collected without appropriate consent, we will take reasonable steps to delete it. Information We Collect, which will cover:",
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
    id: "information-we-collect-overview",
    title: "5. Information We Collect",
    paragraphs: [
      "Shopinger collects information to provide, improve, secure, and personalize its Services. The information we collect depends on how you interact with our website, mobile application, and related services.",
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
    id: "information-you-provide-to-us",
    title: "5.1 Information You Provide to Us",
    intro:
      "When you create an account, place an order, contact customer support, participate in promotional activities, apply for a job, register as a seller, warehouse partner, or delivery partner, or otherwise interact with our Services, we may collect information including:",
    sections: [
      {
        heading: "Personal Information",
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
        heading: "Account Information",
        intro: "When you register with Shopinger, we may collect:",
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
        heading: "Order and Transaction Information",
        intro: "When you place an order through Shopinger, we may collect:",
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
        note: "This information enables us to process and fulfil your orders efficiently.",
      },
      {
        heading: "Payment Information",
        intro:
          "When you make a purchase, payments are processed through authorised third-party payment service providers. Depending on your selected payment method, information may include:",
        items: [
          "Payment method",
          "UPI ID",
          "Bank name",
          "Wallet provider",
          "Transaction reference number",
          "Billing address",
          "Payment status",
        ],
        outro: "Shopinger does not store your complete:",
        excludedItems: [
          "Debit card number",
          "Credit card number",
          "CVV",
          "UPI PIN",
          "Net banking passwords",
          "Card PIN",
        ],
        note: "Payment information is securely processed by PCI DSS-compliant payment service providers.",
      },
      {
        heading: "Communications",
        intro: "When you contact Shopinger, we may collect:",
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
        note: "These communications help us improve customer service and resolve disputes.",
      },
      {
        heading: "User-Generated Content",
        intro: "You may voluntarily submit content including:",
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
        note: "By submitting such content, you grant Shopinger the right to display, publish, and use it in accordance with our Terms of Use.",
      },
      {
        heading: "Seller, Warehouse Partner and Delivery Partner Information",
        intro:
          "Where applicable, Shopinger may collect information from business partners, including:",
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
        note: "Such information is collected only where necessary for onboarding, compliance, operational, or legal purposes.",
      },
      {
        heading: "Job Applicant Information",
        intro:
          "If you apply for employment or contractual opportunities with Shopinger, we may collect:",
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
        note: "This information is used solely for recruitment and related administrative purposes.",
      },
    ],
    note: "Providing certain information may be mandatory to access specific Services. If required information is not provided, some Services may not be available.",
  },

  {
    id: "information-collected-automatically",
    title: "5.2 Information Collected Automatically",
    intro:
      "When you access or use our Services, certain information may be collected automatically. This may include:",
    sections: [
      {
        heading: "Device Information",
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
        heading: "Log Information",
        intro: "We automatically record certain information including:",
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
        heading: "Location Information",
        intro: "With your permission, Shopinger may collect:",
        items: [
          "GPS location",
          "Approximate location",
          "Delivery location",
          "Real-time device location",
        ],
        outro: "Location information helps us:",
        benefits: [
          "Display nearby products",
          "Calculate delivery availability",
          "Improve delivery accuracy",
          "Prevent fraudulent transactions",
          "Provide location-based offers",
        ],
        note: "You may disable location permissions through your device settings. However, certain location-based Services may not function correctly.",
      },
      {
        heading: "Cookies and Similar Technologies",
        intro:
          "Shopinger uses cookies, pixels, web beacons, SDKs, local storage, and similar technologies to:",
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
        note: "You may manage cookies through your browser settings. Disabling cookies may affect the functionality of certain Services.",
      },
      {
        heading: "Analytics",
        intro: "We may use analytics tools to understand:",
        items: [
          "User behaviour",
          "Feature usage",
          "Performance metrics",
          "Customer engagement",
          "Purchase trends",
          "Website traffic",
          "App performance",
        ],
        note: "Analytics information is used to improve our Services and customer experience.",
      },
      {
        heading: "Advertising Information",
        paragraphs: [
          "Where permitted by law, we may collect information relating to advertisements viewed, clicked, or interacted with to measure campaign effectiveness and provide more relevant promotional content.",
        ],
        note: "Users may opt out of certain marketing communications through their account settings or by following unsubscribe instructions.",
      },
    ],
  },

  {
    id: "information-we-receive-from-third-parties",
    title: "6. Information We Receive from Third Parties",
    intro:
      "We may receive information about you from trusted third parties, including:",
    list: [
      "Payment service providers",
      "Logistics and delivery partners",
      "Sellers and merchants",
      "Identity verification providers",
      "Marketing and advertising partners",
      "Social media platforms (when you choose to sign in using them)",
      "Analytics providers",
      "Government authorities where legally required",
    ],
    paragraphs: [
      "We combine such information with information already available to us to improve our Services, verify user identities, detect fraud, and comply with legal obligations.",
    ],
  },

  {
    id: "how-we-use-your-information",
    title: "7. How We Use Your Information",
    intro:
      "We use your information for legitimate business and operational purposes, including to:",
    list: [
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

  {
    id: "legal-basis-for-processing",
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
    id: "sharing-of-personal-information",
    title: "9. Sharing of Personal Information",
    paragraphs: ["Shopinger does not sell your personal information."],
    intro: "We may share information with:",
    sections: [
      {
        heading: "Service Providers",
        description:
          "Including payment processors, cloud hosting providers, customer support providers, SMS and email service providers, analytics providers, IT support vendors, and fraud detection partners.",
      },
      {
        heading: "Sellers",
        description:
          "To process and fulfil your orders, your delivery details and order-related information may be shared with the relevant seller.",
      },
      {
        heading: "Delivery Partners",
        description: "To enable successful delivery of your orders.",
      },
      {
        heading: "Warehouse Partners",
        description:
          "Where required for inventory management, order fulfilment, and logistics.",
      },
      {
        heading: "Financial Institutions",
        description:
          "Banks, payment gateways, UPI providers, and wallet providers for processing transactions.",
      },
      {
        heading: "Government Authorities",
        description:
          "Where disclosure is required by law, court order, or governmental request.",
      },
      {
        heading: "Corporate Transactions",
        description:
          "If Shopinger is involved in a merger, acquisition, restructuring, investment, sale of assets, or similar corporate transaction, your information may be transferred as part of that transaction, subject to applicable law.",
      },
    ],
  },

  {
    id: "cookies-and-similar-technologies-section",
    title: "10. Cookies and Similar Technologies",
    intro: "We use cookies and similar technologies to:",
    list: [
      "Authenticate users.",
      "Remember preferences.",
      "Improve website functionality.",
      "Analyse traffic.",
      "Measure advertising performance.",
      "Prevent fraud.",
      "Enhance security.",
      "Personalize content.",
    ],
    note: "You may disable cookies through your browser settings. Certain features may not function correctly if cookies are disabled.",
  },

  {
    id: "marketing-communications",
    title: "11. Marketing Communications",
    intro:
      "With your consent or where otherwise permitted by law, Shopinger may send:",
    list: [
      "Promotional emails",
      "SMS",
      "WhatsApp messages",
      "Push notifications",
      "App notifications",
      "Special offers",
      "Product recommendations",
      "Service updates",
    ],
    paragraphs: [
      "You may opt out of promotional communications at any time by following the unsubscribe instructions or updating your communication preferences.",
      "You will continue to receive transactional communications related to your account or orders.",
    ],
  },

  {
    id: "data-security",
    title: "12. Data Security",
    paragraphs: [
      "Shopinger maintains reasonable administrative, technical, and physical safeguards designed to protect personal information against unauthorized access, loss, misuse, alteration, or disclosure.",
    ],
    intro: "Security measures may include:",
    list: [
      "SSL/TLS encryption",
      "Encrypted passwords",
      "Secure payment processing",
      "Firewalls",
      "Access controls",
      "Security monitoring",
      "Employee confidentiality obligations",
      "Regular security assessments",
    ],
    note: "Despite our efforts, no method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security.",
  },

  {
    id: "data-retention",
    title: "13. Data Retention",
    intro: "We retain personal information only for as long as necessary to:",
    list: [
      "Provide our Services.",
      "Complete transactions.",
      "Resolve disputes.",
      "Enforce agreements.",
      "Prevent fraud.",
      "Meet accounting, tax, audit, and legal obligations.",
    ],
    note: "When information is no longer required, it is securely deleted, anonymized, or otherwise disposed of in accordance with applicable law.",
  },

  {
    id: "your-rights",
    title: "14. Your Rights",
    intro: "Subject to applicable law, you may have the right to:",
    list: [
      "Access your personal information.",
      "Correct inaccurate information.",
      "Update your account information.",
      "Request deletion of your account.",
      "Withdraw consent where applicable.",
      "Restrict or object to certain processing activities.",
      "Request information regarding how your personal information is processed.",
      "Lodge complaints with the appropriate authority where permitted by law.",
    ],
    note: "Requests may be subject to verification of your identity.",
  },

  {
    id: "account-deletion",
    title: "15. Account Deletion",
    paragraphs: [
      "You may request deletion of your Shopinger account by contacting Customer Support or through any account deletion feature provided within the Services.",
      "Following verification, we will process your request in accordance with applicable law.",
    ],
    intro:
      "Certain information may continue to be retained where required for:",
    list: [
      "Legal compliance",
      "Tax purposes",
      "Fraud prevention",
      "Dispute resolution",
      "Enforcement of agreements",
    ],
  },

  {
    id: "childrens-privacy",
    title: "16. Children's Privacy",
    paragraphs: [
      "Our Services are not intended for children under the age of 18 without parental or guardian supervision.",
      "We do not knowingly collect personal information from children in violation of applicable law.",
      "If you believe that a child has provided us with personal information without appropriate authorization, please contact us so we can take appropriate action.",
    ],
  },

  {
    id: "third-party-websites",
    title: "17. Third-Party Websites and Services",
    paragraphs: [
      "Our Services may contain links to third-party websites or services.",
      "Shopinger is not responsible for the privacy practices, content, or security of third-party websites.",
      "Users should review the privacy policies of those third parties before providing personal information.",
    ],
  },

  {
    id: "international-data-transfers",
    title: "18. International Data Transfers",
    paragraphs: [
      "Where required for business operations, personal information may be processed or stored outside India by trusted service providers.",
      "Where such transfers occur, Shopinger will take reasonable steps to ensure appropriate safeguards consistent with applicable law.",
    ],
  },

  {
    id: "changes-to-privacy-policy",
    title: "19. Changes to this Privacy Policy",
    paragraphs: [
      "Shopinger may update this Privacy Policy from time to time to reflect changes in law, technology, business operations, or our Services.",
      'Any revised Privacy Policy will be published on our website and mobile application with the updated "Last Updated" date.',
      "Your continued use of the Services after such changes become effective constitutes acceptance of the revised Privacy Policy.",
    ],
  },

  {
    id: "contact-us",
    title: "20. Contact Us",
    paragraphs: [
      "If you have any questions, concerns, or requests regarding this Privacy Policy or the processing of your personal information, please contact us:",
      "Shopinger International Private Limited",
    ],
    contact: {
      company: process.env.NEXT_PUBLIC_COMPANY_NAME,
      email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      phone: process.env.NEXT_PUBLIC_ADMIN_PHONE,
      website: process.env.NEXT_PUBLIC_BASE_URL,
    },
  },
];
const PrivacyPolicyPage: NextPageWithLayout = () => {
  return (
    <div className="w-full bg-gray-50 py-2 sm:py-4">
      <div className="mx-auto mt-(--header-height) max-w-7xl px-2.5 sm:px-4">
        <PolicySection policies={policies} />
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

PrivacyPolicyPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
