const IS_PROD = process.env.NEXT_PUBLIC_APP_ENV === "production";

export const ALGOLIA_INDEX = {
  PRODUCTS: IS_PROD ? "prod_products" : "stage_products",
  QUERIES: IS_PROD ? "prod_product_queries" : "stage_product_queries",
};
