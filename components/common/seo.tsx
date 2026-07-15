import Head from "next/head";
// types
import type { FC } from "react";

type IProps = {
  title: string;
  description: string;
  is_prod: boolean;
  url: string;
  image: string;
  og_type?: string;
  json_ld?: string;
};
const Seo: FC<IProps> = ({
  title,
  description,
  is_prod,
  url,
  image,
  og_type = "website",
  json_ld,
}) => {
  return (
    <Head>
      <title key="title">{title}</title>

      <meta key="description" name="description" content={description} />
      <meta
        key="robots"
        name="robots"
        content={
          is_prod
            ? "index,follow,max-image-preview:large"
            : "noindex,nofollow,noarchive"
        }
      />
      <meta key="og:site_name" property="og:site_name" content="Shopinger" />
      <meta key="og:locale" property="og:locale" content="en_IN" />
      <meta key="og:image:width" property="og:image:width" content="1200" />
      <meta key="og:image:height" property="og:image:height" content="630" />
      <meta key="og:image:alt" property="og:image:alt" content={title} />
      {is_prod && <link key="canonical" rel="canonical" href={url} />}

      {/* Open Graph */}
      <meta key="og:title" property="og:title" content={title} />

      <meta
        key="og:description"
        property="og:description"
        content={description}
      />

      <meta key="og:type" property="og:type" content={og_type} />

      <meta key="og:url" property="og:url" content={url} />

      <meta key="og:image" property="og:image" content={image} />

      {/* Twitter */}
      <meta
        key="twitter:card"
        name="twitter:card"
        content="summary_large_image"
      />

      <meta key="twitter:title" name="twitter:title" content={title} />

      <meta
        key="twitter:description"
        name="twitter:description"
        content={description}
      />

      <meta key="twitter:image" name="twitter:image" content={image} />
      <meta key="twitter:image:alt" name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@shopinger" />
      {json_ld && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: json_ld }}
          key="product-jsonld"
        />
      )}
    </Head>
  );
};

export default Seo;
