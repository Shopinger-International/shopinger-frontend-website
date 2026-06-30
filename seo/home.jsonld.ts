import { WebPage, WebSite, WithContext } from "schema-dts";

interface IHomeArgs {
  title: string;
  description: string;
  url: string;
}

const createHomeJSONLD = ({
  title,
  description,
  url,
}: IHomeArgs): Array<WithContext<WebSite | WebPage>> => {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${url}#website`,
      url,
      name: title,
      description,
      inLanguage: "en-IN",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: "en-IN",
      isPartOf: {
        "@id": `${url}#website`,
      },
    },
  ];
};

export default createHomeJSONLD;
