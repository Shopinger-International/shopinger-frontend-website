// types
import type { ComponentType } from "react";
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";
import type { IMediaGroup } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";
import type IMedia from "@/types/media";

// helpers

export type IVariantMediaWithTitle = {
  media: IMedia;
  image_title: string;
};

interface IInjectedProps {
  variant_medias_with_title: IVariantMediaWithTitle[];
}

interface IWithGalleryControlProps {
  product: IProduct;
  variant: IVariant;
  media_group: IMediaGroup;
}

const withProductGalleryFunctionality = <
  ExtraProps extends IWithGalleryControlProps,
>(
  BaseComponent: ComponentType<
    Omit<ExtraProps, keyof IWithGalleryControlProps> & IInjectedProps
  >,
) => {
  const EnhancedComponent = ({
    product,
    variant,
    media_group,
    ...props
  }: ExtraProps) => {
    const { brand, title, product_medias } = product;
    const { variant_attribute_values } = variant;

    const updated_title =
      !brand || brand.toLocaleLowerCase() == "generic" || title.includes(brand)
        ? title
        : `${brand} ${title}`;
    let variant_medias = variant_attribute_values
      .filter(({ attribute }) => attribute.is_visual)
      .flatMap(
        ({ attribute, value }) =>
          media_group[attribute.id as number]?.[value.toLowerCase()] ?? [],
      );
    const visual_values = variant_attribute_values
      .filter(({ attribute }) => attribute.is_visual)
      .map(({ value }) => value);

    let variant_medias_with_title = (
      variant_medias.length
        ? variant_medias
        : product_medias.map(({ media }) => media)
    ).map((media, index) => {
      const image_title = visual_values.length
        ? `${updated_title} in ${visual_values.join(", ")} - Image ${index + 1}`
        : `${updated_title} - Image ${index + 1}`;

      return {
        media,
        image_title,
      };
    });

    return (
      <BaseComponent
        {...(props as Omit<ExtraProps, keyof IWithGalleryControlProps>)}
        variant_medias_with_title={variant_medias_with_title}
      />
    );
  };

  return EnhancedComponent;
};

export default withProductGalleryFunctionality;
