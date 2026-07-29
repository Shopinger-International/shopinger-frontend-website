const IS_PROD = process.env.NODE_ENV === "production";
export const ALGOLIA_INDEX = {
  PRODUCTS: IS_PROD ? "prod_products" : "products",
  QUERIES: IS_PROD ? "prod_product_queries" : "product_queries",
};
