// types
import type { FC } from "react";

type IProps = {
  size: number;
};

const ShopingerIcon: FC<IProps> = ({ size }) => (
  <svg
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1000 250"
  >
    <rect width="100%" height="100%" fill="none"></rect>
    <text
      x="40"
      y="180"
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize="170"
      fontWeight="700"
      letterSpacing="-8"
    >
      <tspan fill="#00A63C">Shop</tspan>
      <tspan fill="#FF6500">inger</tspan>
    </text>
  </svg>
);

export default ShopingerIcon;
