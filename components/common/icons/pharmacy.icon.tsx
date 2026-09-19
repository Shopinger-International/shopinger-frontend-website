// types
import type { FC } from "react";

type IProps = {
  size: number;
};

const PharmacyIcon: FC<IProps> = ({ size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 64 64"
  >
    <path fill="none" d="M0 0h64v64H0z"></path>
    <g
      fill="none"
      stroke="#182027"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.3"
    >
      <rect width="46" height="36" x="9" y="17" rx="5"></rect>
      <path d="M24 17v-7h16v7"></path>
    </g>
    <path
      fill="none"
      stroke="#FF6900"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.3"
      d="M28 27h8v6h6v8h-6v6h-8v-6h-6v-8h6Z"
    ></path>
  </svg>
);

export default PharmacyIcon;
