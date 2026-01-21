// types
import type { FC, SVGProps } from "react";

interface IProps {
  width: number;
  height: number;
  fill?: string;
}

const DownTriangleIcon: FC<IProps & SVGProps<SVGSVGElement>> = ({
  width,
  height,
  fill,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 11 9"
    fill={"none"}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M6.52145 7.65237L10.7044 1.5423C10.8977 1.26012 11 0.975813 11 0.739495C11 0.28262 10.6333 0 10.0196 0L0.979018 0C0.365963 0 0 0.282264 0 0.73807C0 0.974744 0.102399 1.25451 0.296244 1.53731L4.47909 7.65023C4.74853 8.04335 5.11111 8.26106 5.50049 8.26106C5.8896 8.26115 6.25209 8.04594 6.52145 7.65237Z"
      fill={fill ?? "#313131"}
    />
  </svg>
);
export default DownTriangleIcon;
