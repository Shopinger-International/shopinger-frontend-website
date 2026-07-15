import { ContactPage, Organization, WebSite, WithContext } from "schema-dts";

interface IContactUsArgs {
  title: string;
  description: string;
  url: string;
}

const createContactUsJSONLD = ({
  title,
  description,
  url,
}: IContactUsArgs): Array<
  WithContext<WebSite | ContactPage | Organization>
> => {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${url}#website`,
      url,
      name: "Shopinger",
      inLanguage: "en-IN",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${url}#organization`,
      name: "Shopinger",
      url,
      email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      telephone: process.env.NEXT_PUBLIC_ADMIN_PHONE,
      sameAs: [
        "https://www.facebook.com/people/Shopinger/61573405647086/?sk=about_contact_and_basic_info",
        "https://www.instagram.com/shopinger.in/",
        "https://x.com/Shopinger_India",
        "https://www.youtube.com/@shopinger",
        `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_PHONE}`,
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: "en-IN",
      isPartOf: {
        "@id": `${url}#website`,
      },
      about: {
        "@id": `${url}#organization`,
      },
    },
  ];
};

export default createContactUsJSONLD;
