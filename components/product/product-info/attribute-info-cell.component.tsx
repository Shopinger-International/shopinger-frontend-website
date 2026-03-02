// types
import type { FC } from "react";

// helpers
import clsx from "clsx";

const AttributeInfoCell: FC<{
  name: string;
  value: string;
  show_border: boolean;
}> = ({ name, value, show_border = true }) => (
  <div
    className={clsx(
      "flex flex-col justify-between pb-2",
      show_border && "border-b border-gray-200",
    )}
  >
    <span className="text-gray-600">{name}</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

export default AttributeInfoCell;
