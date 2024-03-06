import { styleConfig } from "src/providerConfig";

const ResourceDropdownCurvedLine = ({ isActive, ...restProps }) => {
  return (
    <svg
      width="14"
      height="30"
      viewBox="0 0 14 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path
        d="M1 1V23C1 26.3137 3.68629 29 7 29H13"
        stroke={
          isActive
            ? styleConfig.sidebarIconActiveColor
            : styleConfig.sidebarTextColor
        }
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default ResourceDropdownCurvedLine;
