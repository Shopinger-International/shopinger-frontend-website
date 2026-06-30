import { Product, WithContext } from "schema-dts";

interface IProductArgs {
  title: string;
  description: string;
  images_url: Array<string>;
  sku: string;
  brand: string;
  category: string;
  url: string;
  price: number;
  in_stock: boolean;
  manufacture: string;
}

const createProductJSONLD = ({
  title,
  description,
  images_url,
  sku,
  brand,
  category,
  url,
  price,
  in_stock,
  manufacture,
}: IProductArgs): WithContext<Product> => {
  return {
    "@context": "https://schema.org",
    "@id": `${url}#product`,
    "@type": "Product",
    name: title,
    description: description,
    sku,
    image: images_url,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    manufacturer: {
      "@type": "Organization",
      name: manufacture,
    },
    category,
    url,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price,
      availability: in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Shopinger",
      },
    },
  };
};

export default createProductJSONLD;
