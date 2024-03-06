import { styleConfig } from "src/providerConfig";

const ResourceDropdownLine = ({ isActive, ...restProps }) => {
  return (
    <svg
      width="2"
      height="58"
      viewBox="0 0 2 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path
        d="M1 1V57"
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

export default ResourceDropdownLine;
