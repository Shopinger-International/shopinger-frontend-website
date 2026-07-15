import { AboutPage, WithContext } from "schema-dts";

interface IAboutArgs {
  title: string;
  description: string;
  url: string;
}

const createAboutJSONLD = ({
  title,
  description,
  url,
}: IAboutArgs): WithContext<AboutPage> => {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL!;

  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
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

export default createAboutJSONLD;
