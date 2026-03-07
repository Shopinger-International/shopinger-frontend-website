import Image from "next/image";
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
const social_links = [
  { name: "facebook", href: "/", src: "/footer/facebook.svg" },
  { name: "instagram", href: "/", src: "/footer/instagram.svg" },
  { name: "twitter", href: "/", src: "/footer/twitter.svg" },
  { name: "youtube", href: "/", src: "/footer/youtube.svg" },
  { name: "whatsapp", href: "/", src: "/footer/whatsapp.svg" },
];
const Footer: FC = () => {
  return (
    <div className="w-full">
      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 px-4 py-12 md:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_1.5fr_1.5fr]">
          {/* Dynamic sections */}
          {footer_sections.map(({ title, list }) => (
            <div key={title} className="space-y-3">
              <h6 className="lg:text-md font-semibold text-white uppercase">
                {title}
              </h6>

              <ul className="space-y-3 text-sm lg:text-base">
                {list.map((item) => (
                  <li key={item.href}>
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
          ))}

          {/* Corporate Address */}
          <div className="col-span-2 space-y-3 lg:col-span-1">
            <h6 className="lg:text-md font-semibold text-white uppercase">
              Corporate Office Address
            </h6>

            <p className="text-sm font-medium text-white/80 lg:text-base">
              Shopinger International Private Limited
              <br />
              Patel Nagar, New Delhi – 110008, India
            </p>

            <p className="text-sm font-medium text-white/80 lg:text-base">
              CIN: U47912UP2025PTC219935
            </p>

            <p className="text-sm font-medium text-white/80 lg:text-base">
              +91 94157 61434
            </p>

            <p className="text-sm font-medium text-white/80 lg:text-base">
              info@shopinger.co.in
            </p>
          </div>

          {/* Registered Address */}
          <div className="col-span-2 space-y-3 lg:col-span-1">
            <h6 className="lg:text-md text-base font-semibold text-white uppercase">
              Registered Office Address
            </h6>

            <p className="text-sm text-white/80 lg:text-base">
              Shopinger International Private Limited
              <br />
              Bharvaliya Bujurg, Near Maurya Complex,
              <br />
              Taramandal, Gorakhpur,
              <br />
              Uttar Pradesh – 273015, India
            </p>

            <p className="text-sm text-white/80 lg:text-base">
              CIN: U47912UP2025PTC219935
            </p>

            <div className="mt-2 flex items-center gap-3">
              {social_links.map(({ name, href, src }) => (
                <Link key={name} href={href}>
                  <Image
                    src={src}
                    alt={name}
                    width={40}
                    height={40}
                    className="size-9 lg:size-10"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full bg-orange-500 text-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3">
            {/* Left section */}
            <div className="flex flex-wrap items-center gap-6">
              <span className="font-medium">©2025–2026 Shopinger</span>

              <Link
                href="/sell"
                className="flex items-center gap-2 font-medium hover:underline"
              >
                <Image
                  className="size-4 lg:size-5"
                  src="/footer/handbag.svg"
                  alt="seller"
                  width={16}
                  height={16}
                />
                Become a Seller
              </Link>

              <Link
                href="/advertise"
                className="flex items-center gap-2 font-medium hover:underline"
              >
                <Image
                  className="size-4 lg:size-5"
                  src="/footer/mike.svg"
                  alt="advertise"
                  width={16}
                  height={16}
                />
                Advertise with us
              </Link>
            </div>

            {/* Right section */}
            <div className="flex flex-wrap items-center gap-3">
              {[
                "google-pay",
                "paypal",
                "visa",
                "rupay",
                "cash-on-delivery",
                "emi-options",
              ].map((icon) => (
                <Image
                  key={icon}
                  src={`/footer/payment-method/${icon}.png`}
                  alt={icon}
                  width={40}
                  height={24}
                  className="rounded bg-white p-1 w-auto h-7"
                />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
