import Link from "next/link";
// types
import type { FC } from "react";

const footer_sections = [
  {
    title: "About",
    list: [{ label: "Shopinger", href: "/about-us" }],
  },
  {
    title: "Help",
    list: [
      { label: "Contact Us", href: "/contact-us" },
      { label: "FAQ's", href: "/faqs" },
      { label: "+91 94157 61434", href: "tel:+919415761434" },
      {
        label: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        href: `mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`,
      },
    ],
  },
  {
    title: "Consumer Policy",
    list: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Payment Policy", href: "/payment-policy" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      {
        label: "Cancellation & Refund Policy",
        href: "/cancellation-and-refund-policy",
      },
    ],
  },
  {
    title: "Business",
    list: [
      {
        label: "Sell on Shopinger",
        href: process.env.NEXT_PUBLIC_SELLER_URL as string,
      },
      { label: "Warehouse Franchise", href: "/contact-us" },
      { label: "Delivery Partner", href: "/contact-us" },
      { label: "Advertise With Us", href: "/contact-us" },
    ],
  },
];
const FooterLinks: FC = () => {
  return footer_sections.map(({ title, list }) => (
    <div key={title} className="space-y-3">
      <h4 className="font-semibold text-white uppercase">{title}</h4>

      <ul className="space-y-2 text-sm">
        {list.map((item, index) => (
          <li key={`${title}-${index}`}>
            {item.href.startsWith("tel:") || item.href.startsWith("mailto:") ? (
              <a
                href={item.href}
                className="font-medium text-white/80 hover:text-white"
              >
                {item.label}
              </a>
            ) : (
              <Link
                target="_blank"
                href={item.href}
                className="font-medium text-white/80 hover:text-white"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  ));
};

export default FooterLinks;
