import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, ShoppingCart } from "lucide-react";

import Campaign from "@/components/home/campaign.component";
import HomeProductRow from "@/components/home/home-product-row.component";
import HomeProductQuantityControl from "@/components/home/home-product-quantity-control.component";
import type { IHomeProduct } from "@/components/home/home-product-card.component";
import type { IResponseType } from "@/hooks/axios/categories/use-get-category-product.hook";
import useGetCategoryProducts from "@/hooks/axios/categories/use-get-category-product.hook";
import useAllCamapigns from "@/hooks/axios/campaign/use-campaigns.hook";
import useCategories from "@/hooks/axios/common/use-categories";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useCart from "@/hooks/axios/cart/use-cart.hook";
import { generateSlug } from "@/helpers/product.helper";

type IGroceryProductCard = IHomeProduct & {
  category_label: string;
  created_at: string;
  bought_last_month: number;
};

const get_variant_unit_label = (
  variant: IResponseType["products"][number]["variants"][number],
) =>
  variant.variant_attribute_values
    .filter(({ attribute }) => attribute.is_unit)
    .map(({ attribute, value }) => {
      const option_label =
        attribute.data_type === "enum"
          ? attribute.options?.find(
              ({ value: option_value }) => value == option_value,
            )?.label
          : undefined;
      const formatted_value = option_label ?? String(value ?? "").trim();
      return formatted_value
        ? `${attribute.name ? `${attribute.name}: ` : ""}${formatted_value}`
        : "";
    })
    .filter(Boolean)
    .join(" · ");

const category_groups = [
  {
    title: "Atta and Flours",
    matches: /\batta\b|\bflours?\b|\bwhole wheat\b/,
  },
  {
    title: "Milk and Dairy",
    matches: /\bmilk\b|\bdairy\b|\bcurd\b|\byogurt\b|\bpaneer\b|\bbutter\b|\bghee\b/,
  },
  {
    title: "Bread and Bakery",
    matches: /\bbread\b|\bbakery\b|\bbun\b|\btoast\b/,
  },
  {
    title: "Rice and Grains",
    matches: /\brice\b|\bgrain\b|\bgrains\b|\bpulses?\b|\bdal\b|\blentils?\b/,
  },
  {
    title: "Snacks and Treats",
    matches: /\bsnacks?\b|\bchips?\b|\bnamkeen\b|\bbiscuits?\b|\bcookies?\b/,
  },
  {
    title: "Drinks and Beverages",
    matches: /\bbeverages?\b|\bdrinks?\b|\bcold drinks?\b|\bjuices?\b|\bwater\b/,
  },
  {
    title: "Fruits and Vegetables",
    matches: /\bfruits?\b|\bvegetables?\b|\bveggies\b|\bfresh produce\b/,
  },
  {
    title: "Cooking Essentials",
    matches: /\bcooking\b|\boils?\b|\bsugar\b|\bsalt\b|\bspices?\b|\bmasala\b/,
  },
  {
    title: "Home and Cleaning",
    matches: /\bhousehold\b|\bhome care\b|\bcleaning\b|\bdetergents?\b|\bdishwash\b/,
  },
];

const product_groups = [
  {
    title: "Atta, Rice and Dal",
    subtitle: "Everyday grains and pantry staples",
    category_indexes: [0, 3],
  },
  {
    title: "Milk and Dairy",
    subtitle: "Fresh dairy for every day",
    category_indexes: [1],
  },
  {
    title: "Bread and Bakery",
    subtitle: "Bread and bakery essentials",
    category_indexes: [2],
  },
  {
    title: "Snacks and Treats",
    subtitle: "Everyday bites and snack-time favorites",
    category_indexes: [4],
  },
  {
    title: "Drinks and Beverages",
    subtitle: "Drinks for every day",
    category_indexes: [5],
  },
  {
    title: "Fruits and Vegetables",
    subtitle: "Fresh picks for everyday meals",
    category_indexes: [6],
  },
  {
    title: "Cooking Essentials",
    subtitle: "Everyday basics for your kitchen",
    category_indexes: [7],
  },
  {
    title: "Home and Cleaning Essentials",
    subtitle: "Daily essentials for a clean home",
    category_indexes: [8],
  },
  {
    title: "Daily Grocery Essentials",
    subtitle: "Everyday products for your home",
    category_indexes: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  },
];

const format_grocery_products = (
  products: IResponseType["products"],
): IGroceryProductCard[] =>
  products.flatMap((product) => {
    const first_variant = [...(product.variants ?? [])].sort(
      (a, b) =>
        Number(
          a.variant_pricing?.selling_price_with_commission ??
            a.variant_pricing?.selling_price ??
            0,
        ) -
        Number(
          b.variant_pricing?.selling_price_with_commission ??
            b.variant_pricing?.selling_price ??
            0,
        ),
    )[0];

    if (!first_variant) return [];

    const selling_price = Number(
      first_variant.variant_pricing?.selling_price_with_commission ??
        first_variant.variant_pricing?.selling_price ??
        0,
    );
    const mrp = Number(first_variant.variant_pricing?.mrp ?? selling_price);
    const discount_percentage =
      mrp > selling_price && mrp > 0
        ? Math.round(((mrp - selling_price) / mrp) * 100)
        : 0;

    return [
      {
        product_id: product.id,
        variant_id: first_variant.id,
        title: product.title,
        media_url:
          first_variant.variant_medias?.[0]?.media?.url ??
          product.product_medias?.[0]?.media?.url ??
          "",
        selling_price,
        mrp,
        discount_percentage,
        unit_label: get_variant_unit_label(first_variant),
        avg_rating: product.avg_rating,
        rating_count: product.reviews_count,
        reviews_count: product.reviews_count,
        sub_sub_category_id: product.sub_sub_category_id,
        have_variants: product.variants.length > 1,
        created_at: product.created_at,
        bought_last_month: product.bought_last_month,
        category_label: [
          product.title,
          product.sub_category?.name,
          product.sub_category?.slug,
          product.sub_sub_category?.name,
          product.sub_sub_category?.slug,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
      },
    ];
  });

function GroceryProductCard({
  product,
  user_id,
}: {
  product: IGroceryProductCard;
  user_id?: number;
}) {
  const product_href = `/${generateSlug(product.title)}/p/${product.product_id}/${product.variant_id}`;

  return (
    <article className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-2 transition-colors hover:border-gray-300 sm:p-2.5">
      <Link
        href={product_href}
        title={`View ${product.title}`}
        className="group block"
      >
        <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-gray-50">
          {(product.discount_percentage ?? 0) > 0 && (
            <span className="absolute left-1.5 top-1.5 z-10 rounded bg-emerald-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {product.discount_percentage ?? 0}% OFF
            </span>
          )}
          <Image
            src={product.media_url || "/shopinger-logo.svg"}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 140px, 180px"
            className="object-contain p-2 transition-transform duration-200 group-hover:scale-105"
          />
        </div>
        <h3 className="line-clamp-2 min-h-9 text-xs font-medium leading-4 text-gray-800 sm:text-sm">
          {product.title}
        </h3>
        {product.unit_label && (
          <span className="mt-1 inline-flex max-w-full truncate rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 sm:text-xs">
            {product.unit_label}
          </span>
        )}
      </Link>

      <div className="mt-auto border-t border-gray-100 pt-2">
        <div className="mb-2 flex min-h-9 items-end justify-between gap-1">
          <span className="text-sm font-bold leading-tight text-gray-900 sm:text-base">
            ₹{Number(product.selling_price).toLocaleString("en-IN")}
          </span>
          {Number(product.mrp) > Number(product.selling_price) && (
            <span className="pb-0.5 text-[10px] text-gray-400 line-through sm:text-xs">
              ₹{Number(product.mrp).toLocaleString("en-IN")}
            </span>
          )}
        </div>
        {product.have_variants ? (
          <Link
            href={product_href}
            className="flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-emerald-700 bg-emerald-50 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
          >
            View options
            <ChevronRight aria-hidden="true" className="size-3.5" />
          </Link>
        ) : (
          <HomeProductQuantityControl
            product_id={product.product_id}
            variant_id={product.variant_id}
            user_id={user_id}
            sub_sub_category_id={product.sub_sub_category_id}
            fullWidth
          />
        )}
      </div>
    </article>
  );
}

export default function GroceryPage() {
  const { data: categories = [] } = useCategories(false, "subsub");
  const { data: cart } = useCart();
  const { data: user_details } = useUserDetails();
  const { data: campaigns = [] } = useAllCamapigns({
    display_scope: "CATEGORY",
    category_slug: "grocery",
  });

  const grocery_category = categories.find(
    (category) =>
      category.slug.toLowerCase() === "grocery" ||
      category.name.toLowerCase() === "grocery",
  );
  const grocery_sub_categories = grocery_category?.sub_categories ?? [];
  const matched_category_groups = category_groups.map(({ matches }) =>
    grocery_sub_categories.find((category) =>
      matches.test(
        `${category.name} ${category.slug}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, " "),
      ),
    ),
  );
  const visible_category_groups = grocery_sub_categories
    .map((category) => ({
      category,
    }))
    .filter(({ category }) => category.sub_sub_categories.length >= 8)
    .slice(0, 4);
  const atta_products_query = useGetCategoryProducts({
    slug: matched_category_groups[0]?.slug ?? "grocery",
    category_type: matched_category_groups[0] ? "sub" : "main",
    limit: 100,
    sort: "latest",
    enabled: !!matched_category_groups[0],
  });
  const dairy_products_query = useGetCategoryProducts({
    slug: matched_category_groups[1]?.slug ?? "grocery",
    category_type: matched_category_groups[1] ? "sub" : "main",
    limit: 100,
    sort: "latest",
    enabled: !!matched_category_groups[1],
  });
  const bakery_products_query = useGetCategoryProducts({
    slug: matched_category_groups[2]?.slug ?? "grocery",
    category_type: matched_category_groups[2] ? "sub" : "main",
    limit: 100,
    sort: "latest",
    enabled: !!matched_category_groups[2],
  });
  const rice_products_query = useGetCategoryProducts({
    slug: matched_category_groups[3]?.slug ?? "grocery",
    category_type: matched_category_groups[3] ? "sub" : "main",
    limit: 100,
    sort: "latest",
    enabled: !!matched_category_groups[3],
  });
  const snacks_products_query = useGetCategoryProducts({
    slug: matched_category_groups[4]?.slug ?? "grocery",
    category_type: matched_category_groups[4] ? "sub" : "main",
    limit: 100,
    sort: "latest",
    enabled: !!matched_category_groups[4],
  });
  const drinks_products_query = useGetCategoryProducts({
    slug: matched_category_groups[5]?.slug ?? "grocery",
    category_type: matched_category_groups[5] ? "sub" : "main",
    limit: 100,
    sort: "latest",
    enabled: !!matched_category_groups[5],
  });
  const produce_products_query = useGetCategoryProducts({
    slug: matched_category_groups[6]?.slug ?? "grocery",
    category_type: matched_category_groups[6] ? "sub" : "main",
    limit: 100,
    sort: "latest",
    enabled: !!matched_category_groups[6],
  });
  const cooking_products_query = useGetCategoryProducts({
    slug: matched_category_groups[7]?.slug ?? "grocery",
    category_type: matched_category_groups[7] ? "sub" : "main",
    limit: 100,
    sort: "latest",
    enabled: !!matched_category_groups[7],
  });
  const household_products_query = useGetCategoryProducts({
    slug: matched_category_groups[8]?.slug ?? "grocery",
    category_type: matched_category_groups[8] ? "sub" : "main",
    limit: 100,
    sort: "latest",
    enabled: !!matched_category_groups[8],
  });
  const products_by_category = [
    atta_products_query,
    dairy_products_query,
    bakery_products_query,
    rice_products_query,
    snacks_products_query,
    drinks_products_query,
    produce_products_query,
    cooking_products_query,
    household_products_query,
  ].map(({ data }) =>
    format_grocery_products(
      data?.pages.flatMap((page) => page.products) ?? [],
    ),
  );
  const all_grocery_products = products_by_category.flat();
  const normalize_category_label = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const has_cart_items = (cart?.total_items ?? 0) > 0;

  return (
    <div className={`min-h-screen space-y-8 bg-white pb-8 ${has_cart_items ? "pb-24" : ""}`}>
      <div className="mx-auto w-full max-w-8xl space-y-7 px-4 pt-5 sm:pt-7">
        <header className="border-b border-gray-200 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Groceries
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Everyday essentials for your home.
          </p>
        </header>

        <div className="space-y-5">
          <div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-gray-950 sm:text-xl">
                Shop by category
              </h2>
            </div>
          </div>
          {visible_category_groups.map(({ category: group }) => {
              const sub_categories = group.sub_sub_categories.slice(
                0,
                Math.floor(group.sub_sub_categories.length / 4) * 4,
              );

              return (
                <section
                  key={group.id}
                  className="w-full min-w-0 border-t border-gray-200 pt-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                      {group.name}
                    </h3>
                  </div>
                  <div className="grid w-full min-w-0 grid-cols-4 gap-2 sm:gap-3">
                    {sub_categories.map((category) => {
                      const category_label = normalize_category_label(
                        `${category.name} ${category.slug}`,
                      );
                      const product_image = all_grocery_products.find(
                        (product) =>
                          product.media_url &&
                          (product.sub_sub_category_id === category.id ||
                            normalize_category_label(
                              product.category_label,
                            ).includes(category_label)),
                      )?.media_url;
                      const image_source =
                        category.media.photo ||
                        product_image ||
                        category.media.icon ||
                        "/icons/grocery.svg";

                      return (
                        <Link
                          key={category.id}
                          href={`/categories/grocery/${group.slug}/${category.slug}`}
                          className="group flex min-w-0 flex-col items-center gap-1.5 sm:gap-2"
                        >
                          <span className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-50">
                            <Image
                              src={image_source}
                              alt={category.name}
                              fill
                              sizes="(max-width: 640px) 25vw, 160px"
                              className={
                                image_source === "/icons/grocery.svg"
                                  ? "object-contain p-3 transition-transform group-hover:scale-105"
                                  : "object-cover transition-transform group-hover:scale-105"
                              }
                            />
                          </span>
                          <span className="line-clamp-2 min-h-8 px-0.5 text-center text-[10px] leading-4 font-medium text-gray-700 group-hover:text-emerald-800 sm:text-xs">
                            {category.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            },
          )}
        </div>
        {campaigns.length > 0 && (
          <div className="overflow-hidden">
            <Campaign campaigns={campaigns} />
          </div>
        )}
      </div>

      <div id="grocery-products" className="mx-auto w-full max-w-8xl space-y-8 px-4 scroll-mt-24">
        <div className="border-b border-gray-200 pb-3">
          <h2 className="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl">
            Everyday essentials
          </h2>
        </div>
        {product_groups.map(({ title, subtitle, category_indexes }) => {
          const products = Array.from(
            new Map<string, IGroceryProductCard>(
              category_indexes
                .flatMap((index) => products_by_category[index] ?? [])
                .map((product) => [
                  `${product.product_id}-${product.variant_id}`,
                  product,
                ]),
            ).values(),
          );
          if (products.length === 0) return null;

          return (
            <HomeProductRow
              key={title}
              title={title}
              subtitle={subtitle}
              products={products}
              view_all_href="/categories/grocery"
              background_style="bg-transparent"
              className="!rounded-none !border-0 !p-0 !shadow-none"
              item_class_name="!w-[42vw] !min-w-[42vw] !max-w-[180px] sm:!w-36 sm:!min-w-36 sm:!max-w-none md:!w-44 md:!min-w-44"
              renderCard={(product) => (
                <GroceryProductCard product={product} user_id={user_details?.id} />
              )}
            />
          );
        })}
      </div>

      {has_cart_items && (
        <Link
          href="/cart-checkout"
          aria-label={`View cart with ${cart?.total_items} items, total ₹${cart?.total_amount}`}
          className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-lg items-center justify-between rounded-xl bg-green-700 px-4 py-3 text-white shadow-lg transition-colors hover:bg-green-800"
        >
          <div className="flex items-center gap-3">
            <ShoppingCart aria-hidden="true" className="size-6 shrink-0" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">
                {cart?.total_items}{" "}
                {cart?.total_items === 1 ? "item" : "items"} in your cart
              </span>
              <span className="text-xs text-white/85">
                ₹{Number(cart?.total_amount ?? 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <span className="flex items-center gap-1 text-sm font-semibold">
            View cart
            <ArrowRight aria-hidden="true" className="size-4" />
          </span>
        </Link>
      )}
    </div>
  );
}
