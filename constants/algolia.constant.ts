const IS_PROD = process.env.NODE_ENV === "production";
console.log("value of prod", IS_PROD);

export const ALGOLIA_INDEX = {
  PRODUCTS: IS_PROD ? "prod_products" : "stage_products",
  QUERIES: IS_PROD ? "prod_product_queries" : "stage_product_queries",
};
