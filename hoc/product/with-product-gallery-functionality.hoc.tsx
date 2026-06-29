// types
import type { ComponentType } from "react";
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";
import type IMedia from "@/types/media";
import type { IFormattedCategoryMapping } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";

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
  category_mappings: Array<IFormattedCategoryMapping>;
}
const withProductGalleryFunctionality = <P extends object>(
  BaseComponent: ComponentType<P & IInjectedProps>,
) => {
  type HocProps = P & IWithGalleryControlProps;

  const EnhancedComponent = ({
    product,
    variant,
    category_mappings,
    ...props
  }: HocProps) => {
    const { product_medias } = product;
    const { variant_attribute_values, variant_medias } = variant;

    const visual_values = variant_attribute_values
      .filter(
        ({ attribute }) =>
          category_mappings.find(
            (mapping) => mapping.attribute_id == attribute.id,
          )?.is_visual,
      )
      .map(({ value }) => value);

    let variant_medias_with_title = (
      variant_medias.length
        ? variant_medias.map(({ media }) => media)
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
