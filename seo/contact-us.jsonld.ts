import { ContactPage, WithContext } from "schema-dts";

interface IContactUsArgs {
  title: string;
  description: string;
  url: string;
}

const createContactUsJSONLD = ({
  title,
  description,
  url,
}: IContactUsArgs): WithContext<ContactPage> => {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL!;

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: "en-IN",
    isPartOf: {
      "@id": `${base_url}#website`,
    },
    about: {
      "@id": `${base_url}#organization`,
    },
  };
};

export default createContactUsJSONLD;
