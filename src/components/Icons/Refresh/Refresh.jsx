import * as React from "react";
const RefreshIcon = (props) => {
  const { disabled } = props;

  let color = props.color || "#FDB022";
  if (disabled) {
    color = "#D0D5DD";
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.667}
        d="M1.667 11.667s.1.707 3.03 3.636a7.5 7.5 0 0 0 12.617-3.636m-15.647 0v5m0-5h5m11.666-3.334s-.1-.707-3.03-3.636A7.5 7.5 0 0 0 2.687 8.333m15.646 0v-5m0 5h-5"
      />
    </svg>
  );
};

export default RefreshIcon;
