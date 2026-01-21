// types
import type { FC, SVGProps } from "react";

interface IProps {
  size: number;
}

const SearchIcon: FC<IProps & SVGProps<SVGSVGElement>> = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="mask0_108_533"
      style={{
        maskType: "luminance",
      }}
      maskUnits="userSpaceOnUse"
      x={1}
      y={1}
      width={18}
      height={18}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.75 1.75H18.7922V18.7924H1.75V1.75Z"
        fill="white"
      />
    </mask>
    <g mask="url(#mask0_108_533)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.2716 3.0625C6.2965 3.0625 3.0625 6.29562 3.0625 10.2708C3.0625 14.2459 6.2965 17.4799 10.2716 17.4799C14.2459 17.4799 17.4799 14.2459 17.4799 10.2708C17.4799 6.29562 14.2459 3.0625 10.2716 3.0625ZM10.2716 18.7924C5.57288 18.7924 1.75 14.9695 1.75 10.2708C1.75 5.572 5.57288 1.75 10.2716 1.75C14.9704 1.75 18.7924 5.572 18.7924 10.2708C18.7924 14.9695 14.9704 18.7924 10.2716 18.7924Z"
        fill="black"
      />
    </g>
    <mask
      id="mask1_108_533"
      style={{
        maskType: "luminance",
      }}
      maskUnits="userSpaceOnUse"
      x={15}
      y={15}
      width={5}
      height={5}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.085 15.4936H19.481V19.8815H15.085V15.4936Z"
        fill="white"
      />
    </mask>
    <g mask="url(#mask1_108_533)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.8249 19.8815C18.6578 19.8815 18.4898 19.8176 18.3612 19.6899L15.2777 16.6151C15.0213 16.3587 15.0204 15.9431 15.2768 15.6867C15.5323 15.4286 15.9479 15.4304 16.2052 15.685L19.2887 18.7606C19.5451 19.017 19.5459 19.4317 19.2896 19.6881C19.1618 19.8176 18.9929 19.8815 18.8249 19.8815Z"
        fill="black"
      />
    </g>
  </svg>
);
export default SearchIcon;
