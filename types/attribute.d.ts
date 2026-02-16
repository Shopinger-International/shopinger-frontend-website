export type IAttributeOption = {
  id?: number;
  label: string;
  value: string;
  status: "active" | "inactive";
};

export type IDataType = "string" | "number" | "boolean" | "enum" | "date";

export type IInputType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "multi_select"
  | "radio"
  | "boolean"
  | "date"
  | "datetime";

export type IAttributeValidationRules = {
  // string rules
  minLength?: number;
  maxLength?: number;
  regex?: string;

  // number rules
  min?: number;
  max?: number;

  // enum rules && multi_select
  minOptions?: number;
  maxOptions?: number;
};

type IAttributeType = {
  id?: number;

  name: string;
  code: string;
  description?: string;
  placeholder?: string;

  data_type: IDataType;

  input_type: IInputType;

  is_required: boolean;
  variant_capable: boolean;
  is_visual: boolean;
  is_unit: boolean;

  status: "active" | "inactive" | "deprecated";

  options?: IAttributeOption[];
  usage: {
    main: number;
    sub: number;
    subsub: number;
    total: number;
  };

  validation_rules?: IAttributeValidationRules;
};

export default IAttributeType;