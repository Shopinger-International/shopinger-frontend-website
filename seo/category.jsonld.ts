import { CollectionPage, WithContext } from "schema-dts";

interface ICategoryArgs {
  title: string;
  description: string;
  url: string;
}

const createCategoryJSONLD = ({
  title,
  description,
  url,
}: ICategoryArgs): WithContext<CollectionPage> => {
  return {
    "@context": "https://schema.org",
    "@id": `${url}#collection-page`,
    "@type": "CollectionPage",
    name: title,
    description: description,
    url,
    inLanguage: "en-IN",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/#website`,
    },
  };
};

export default createCategoryJSONLD;
