import { FC } from "react";

const ExitFullScreenIcon: FC<React.SVGAttributes<SVGElement>> = (props) => {
  return (
    <svg
      width="15"
      height="18"
      viewBox="0 0 15 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        cursor: "pointer",
      }}
      {...props}
    >
      <path
        d="M3 10.5H7.5M7.5 10.5V15M7.5 10.5L2.25 15.75M15 7.5H10.5M10.5 7.5V3M10.5 7.5L15.75 2.25"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ExitFullScreenIcon;
