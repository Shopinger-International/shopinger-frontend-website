import Link from "next/link";
// types
import type { FC } from "react";

const footer_sections = [
  {
    title: "About",
    list: [
      { label: "Contact Us", href: "/contact-us" },
      { label: "About Us", href: "/about-us" },
      { label: "Shopinger Stories", href: "/shopinger-stories" },
      { label: "Feedback", href: "/feedback" },
    ],
  },
  {
    title: "Help",
    list: [
      { label: "Support Center", href: "/support" },
      { label: "Payment", href: "/payment" },
      { label: "Shipping", href: "/shipping" },
      { label: "FAQ’s", href: "/faqs" },
    ],
  },
  {
    title: "Consumer Policy",
    list: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Cancellation & Returns", href: "/returns" },
      { label: "FSSAI Food Safety Connect", href: "/fssai" },
    ],
  },
];
const FooterLinks: FC = () => {
  return footer_sections.map(({ title, list }) => (
    <div key={title} className="space-y-3">
      <h6 className="font-semibold text-white uppercase">{title}</h6>

      <ul className="space-y-2 text-sm">
        {list.map((item, index) => (
          <li key={`${title}-${index}`}>
            <Link
              href={item.href}
              className="font-medium text-white/80 hover:text-white"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  ));
};

export default FooterLinks;