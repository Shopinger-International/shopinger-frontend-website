// types
import { IAttributeType } from "../types/attribute";

type ICategoryType = "main" | "sub" | "subsub";
type IDisplayAreaType = "specifications" | "additional info" | "top highlights";
type IStatus = "added" | "inherited" | "overridden";

type ICategoryAttributeMapping = {
  id: number;
  attribute_id: number;
  category_id: number;
  category_type: ICategoryType;

  attribute: IAttributeType;

  display_area: Array<IDisplayAreaType>;
  display_group: string;
  display_order: number;
  unit_code: string | null;

  is_filterable: boolean;
  is_required: boolean;
  is_visual:boolean;
  is_variant: boolean;
  is_hidden: boolean;
  show_on_pdp: boolean;

  status: IStatus;
  is_hidden: boolean;
  visual_priority: number | null;
};
export default ICategoryAttributeMapping;
