import Link from "next/link";
import Image from "next/image";
// types
import type { FC } from "react";

const social_links = [
  {
    name: "linkedin",
    href: `https://www.linkedin.com/company/shopinger-international-private-limited/?viewAsMember=true`,
    src: "/footer/linkedin.svg",
  },
  {
    name: "facebook",
    href: "https://www.facebook.com/people/Shopinger/61573405647086/?sk=about_contact_and_basic_info",
    src: "/footer/facebook.svg",
  },
  {
    name: "instagram",
    href: "https://www.instagram.com/shopinger.in/",
    src: "/footer/instagram.svg",
  },
  {
    name: "twitter",
    href: "https://x.com/Shopinger_India",
    src: "/footer/twitter.svg",
  },
  {
    name: "youtube",
    href: "https://www.youtube.com/@shopinger",
    src: "/footer/youtube.svg",
  },
  {
    name: "whatsapp",
    href: `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_PHONE}`,
    src: "/footer/whatsapp.svg",
  },
];
const FooterSocial: FC = () => {
  return (
    <div className="mt-2 flex items-center gap-3">
      {social_links.map(({ name, href, src }) => (
        <Link key={name} href={href} aria-label={name} target="_blank">
          <Image
            src={src}
            alt={name}
            width={40}
            height={40}
            className="size-6 lg:size-8"
          />
        </Link>
      ))}
    </div>
  );
};
export default FooterSocial;
