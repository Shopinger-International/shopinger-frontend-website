// types
import type { NextPageWithLayout } from "@/pages/_app";
import type {
  ReactElement,
  ReactNode,
  FC,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import type { LucideProps } from "lucide-react";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import ContactUsForm from "@/components/contact-us/contact-us-form.component";

// icons
import { Mail, Phone, MessageCircle, Twitter } from "lucide-react";

export const CONTACT_CARDS = [
  {
    icon: Mail,
    title: "Our Email",
    content: (
      <a
        href="mailto:support@shopinger.co.in"
        className="inline-block font-medium text-gray-600 underline"
      >
        support@shopinger.co.in
      </a>
    ),
  },
  {
    icon: Phone,
    title: "Call Us",
    content: (
      <a
        href={`tel:${process.env.NEXT_PUBLIC_ADMIN_PHONE}`}
        className="inline-block font-medium text-gray-600 underline"
      >
        {process.env.NEXT_PUBLIC_ADMIN_PHONE}
      </a>
    ),
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    content: (
      <a
        href="https://wa.me/919415761434"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-medium text-gray-600 underline"
      >
        Chat with us
      </a>
    ),
  },
  {
    icon: Twitter,
    title: "Twitter",
    content: (
      <a
        href="https://x.com/Shopinger_India"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-medium text-gray-600 underline"
      >
        @Shopinger_India
      </a>
    ),
  },
];

type IProps = {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  title: string;
  children: ReactNode;
};
const ContactCard: FC<IProps> = ({ icon: Icon, title, children }) => {
  return (
    <div className="w-full rounded-xl border border-gray-300 p-4">
      <div className="mb-2 inline-block size-fit rounded-lg border border-gray-100 bg-orange-50 p-2">
        <Icon className="size-5 text-orange-500" />
      </div>
      <h2 className="mb-0.5 font-semibold text-gray-900">{title}</h2>
      {children}
    </div>
  );
};
const ContactUs: NextPageWithLayout = () => {
  return (
    <div className="mx-auto mt-(--header-height) max-w-6xl px-4 py-6">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
        {/* Left Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">Contact Us</h1>

            <p className="mt-3 max-w-2xl text-sm font-medium text-gray-600 sm:text-base">
              Need help with your order, delivery, or account? Reach out to us
              and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CONTACT_CARDS.map(({ icon, title, content }) => (
              <ContactCard key={title} icon={icon} title={title}>
                {content}
              </ContactCard>
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
