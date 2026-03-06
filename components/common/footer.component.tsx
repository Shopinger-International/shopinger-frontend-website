import Link from "next/link";
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

const Footer: FC = () => {
  return (
    <div className="w-full">
      {/* Footer */}
      <footer className="bg-[#1f1f1f] text-white">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-3 gap-10 px-4 py-12 md:grid-cols-3 lg:grid-cols-5">
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
          <div className="col-span-3 space-y-3 lg:col-span-1">
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
          <div className="col-span-3 space-y-3 lg:col-span-1">
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

            {/* <div className="flex gap-3 pt-2">
              <Facebook size={20} />
              <Linkedin size={20} />
              <Instagram size={20} />
              <Twitter size={20} />
              <Youtube size={20} />
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
