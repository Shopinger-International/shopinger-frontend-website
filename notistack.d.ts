// notistack.d.ts
import "notistack";

declare module "notistack" {
  interface OptionsObject<V extends VariantType = VariantType> {
    action_label?: string;
    onActionClick?: () => void;
  }
}
