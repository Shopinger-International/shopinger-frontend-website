import { Organization, WithContext } from "schema-dts";

const createOrganizationJSONLD = (): WithContext<Organization> => {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base_url}/#organization`,
    name: "Shopinger",
    url: base_url,
    logo: {
      "@type": "ImageObject",
      url: "https://shopinger-uploads.s3.ap-south-1.amazonaws.com/uploads/assets/dark-mobile-logo.png",
    },
  };
};

export default createOrganizationJSONLD;
