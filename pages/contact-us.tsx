import Link from "next/link";
// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { IconType } from "react-icons/lib";
import type { ReactElement, FC } from "react";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import ContactUsForm from "@/components/contact-us/contact-us-form.component";

// icons
import { BsTwitterX } from "react-icons/bs";
import { BsWhatsapp } from "react-icons/bs";
import { LuMail } from "react-icons/lu";
import { FiPhone } from "react-icons/fi";

export const CONTACT_CARDS = [
  {
    icon: LuMail,
    title: "Email Us",
    href: "mailto:support@shopinger.co.in",
  },
  {
    icon: FiPhone,
    title: "Call Us",
    href: `tel:${process.env.NEXT_PUBLIC_ADMIN_PHONE}`,
  },
  {
    icon: BsWhatsapp,
    title: "WhatsApp",
    href: `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_PHONE}`,
  },
  {
    icon: BsTwitterX,
    title: "Follow Us",
    href: "https://x.com/Shopinger_India",
  },
];
type IProps = {
  icon: IconType;
  title: string;
  href: string;
};
const ContactCard: FC<IProps> = ({ icon: Icon, title, href }) => {
  return (
    <Link
      target="_blank"
      href={href}
      className="w-full rounded-xl border border-gray-300 p-4"
    >
      <div className="mb-2 inline-block size-fit rounded-lg border border-gray-100 bg-orange-50 p-2">
        <Icon className="size-5 text-orange-500" />
      </div>
      <h2 className="mb-0.5 font-semibold text-gray-900">{title}</h2>
    </Link>
  );
};
const ContactUs: NextPageWithLayout = () => {
  return (
    <div className="mx-auto mt-(--header-height) max-w-6xl px-4 pt-2 pb-6 sm:py-6">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
        {/* Left Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl font-semibold sm:text-3xl">Contact Us</h1>

            <p className="max-w-2xl text-sm font-medium text-gray-600 sm:text-base">
              Need help with your order, delivery, or account? Reach out to us
              and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {CONTACT_CARDS.map((prop) => (
              <ContactCard key={prop.title} {...prop} />
            ))}
          </div>
        </div>

        {/* Right Section */}
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactUs;

ContactUs.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
