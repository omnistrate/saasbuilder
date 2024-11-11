import * as React from "react";
const GcpIcon = (props) => {
  const { width = 33, height = 27 } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 33 27`}
      fill="none"
      {...props}
    >
      <path
        fill="#EA4335"
        d="M20.85 7.41h1l2.85-2.85.14-1.21A12.81 12.81 0 0 0 4 9.6a1.55 1.55 0 0 1 1-.06l5.7-.94s.29-.48.44-.45a7.11 7.11 0 0 1 9.73-.74h-.02Z"
      />
      <path
        fill="#4285F4"
        d="M28.76 9.6a12.84 12.84 0 0 0-3.87-6.24l-4 4A7.11 7.11 0 0 1 23.5 13v.71a3.56 3.56 0 0 1 0 7.12h-7.12l-.71.72v4.27l.71.71h7.12A9.26 9.26 0 0 0 28.76 9.6Z"
      />
      <path
        fill="#34A853"
        d="M9.25 26.49h7.12v-5.7H9.25a3.54 3.54 0 0 1-1.47-.32l-1 .31-2.87 2.85-.25 1a9.21 9.21 0 0 0 5.59 1.86Z"
      />
      <path
        fill="#FBBC05"
        d="M9.25 8a9.26 9.26 0 0 0-5.59 16.6l4.13-4.13a3.56 3.56 0 1 1 4.71-4.71l4.13-4.13A9.25 9.25 0 0 0 9.25 8Z"
      />
    </svg>
  );
};
export default GcpIcon;
