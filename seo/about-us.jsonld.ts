import { AboutPage, WebSite, WithContext } from "schema-dts";

interface IAboutArgs {
  title: string;
  description: string;
  url: string;
}

const createAboutJSONLD = ({
  title,
  description,
  url,
}: IAboutArgs): Array<WithContext<WebSite | AboutPage>> => {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${url}#website`,
      url,
      name: `${process.env.NEXT_PUBLIC_COMPANY_NAME}`,
      description,
      inLanguage: "en-IN",
    },
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: "en-IN",
      isPartOf: {
        "@id": `${url}#website`,
      },
      about: {
        "@type": "Organization",
        name: `${process.env.NEXT_PUBLIC_COMPANY_NAME}`,
        url,
      },
    },
  ];
};

export default createAboutJSONLD;
