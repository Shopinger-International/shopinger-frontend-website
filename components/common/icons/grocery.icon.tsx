import type { FC } from "react";

type IProps = {
  size: number;
};

const GroceryIcon: FC<IProps> = ({ size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 64 64"
  >
    <path fill="none" d="M0 0h64v64H0z"></path>
    <path
      fill="none"
      stroke="#182027"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.3"
      d="M10 28h44l-6 26H16Zm-2 0h48m-37 0 7-16m19 16-7-16"
    ></path>
    <path
      fill="none"
      stroke="#FF6900"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.3"
      d="M23 35v12m9-12v12m9-12v12"
    ></path>
  </svg>
);

export default GroceryIcon;
