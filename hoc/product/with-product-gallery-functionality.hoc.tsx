// types
import type { ComponentType } from "react";
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";
import type { IMediaGroup } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";
import type IMedia from "@/types/media";
import type ICategoryAttributeMapping from "@/types/category-attribute-mapping";

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
  category_mappings: ICategoryAttributeMapping[];
}
const withProductGalleryFunctionality = <P extends object>(
  BaseComponent: ComponentType<P & IInjectedProps>,
) => {
  type HocProps = P & IWithGalleryControlProps;

  const EnhancedComponent = ({
    product,
    variant,
    media_group,
    category_mappings,
    ...props
  }: HocProps) => {
    const { product_medias } = product;
    const { variant_attribute_values } = variant;

    let variant_medias = variant_attribute_values
      .filter(
        ({ attribute }) =>
          category_mappings.find(
            ({ attribute: mapping_attribute }) =>
              mapping_attribute.id == attribute.id,
          )?.is_visual,
      )
      .flatMap(
        ({ attribute, value }) =>
          media_group[attribute.id as number]?.[value.toLowerCase()] ?? [],
      );
    const visual_values = variant_attribute_values
      .filter(
        ({ attribute }) =>
          category_mappings.find(
            ({ attribute: mapping_attribute }) =>
              mapping_attribute.id == attribute.id,
          )?.is_visual,
      )
      .map(({ value }) => value);

    let variant_medias_with_title = (
      variant_medias.length
        ? variant_medias
        : product_medias.map(({ media }) => media)
    ).map((media, index) => {
      const image_title = visual_values.length
        ? `${visual_values.join(", ")} - Image ${index + 1}`
        : `Image ${index + 1}`;

      return {
        media,
        image_title,
      };
    });

    return (
      <BaseComponent
        {...(props as P)}
        variant_medias_with_title={variant_medias_with_title}
      />
    );
  };

  return EnhancedComponent;
};

export default withProductGalleryFunctionality;
