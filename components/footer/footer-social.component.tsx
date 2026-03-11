import Link from "next/link";
import Image from "next/image";
// types
import type { FC } from "react";

const social_links = [
  { name: "facebook", href: "/", src: "/footer/facebook.svg" },
  { name: "instagram", href: "/", src: "/footer/instagram.svg" },
  { name: "twitter", href: "/", src: "/footer/twitter.svg" },
  { name: "youtube", href: "/", src: "/footer/youtube.svg" },
  { name: "whatsapp", href: "/", src: "/footer/whatsapp.svg" },
];
const FooterSocial: FC = () => {
  return (
    <div className="mt-2 flex items-center gap-3">
      {social_links.map(({ name, href, src }) => (
        <Link key={name} href={href} aria-label={name}>
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
