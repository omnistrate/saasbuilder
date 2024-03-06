import { styleConfig } from "src/providerConfig";

const ResourcesIcon = ({
  active,
  disabled,
  color: inputColor,
  ...restProps
}) => {
  let color = inputColor || styleConfig.sidebarIconColor;

  if (active) {
    color = styleConfig.sidebarIconActiveColor;
  }
  if (disabled) {
    color = styleConfig.sidebarIconDisabledColor;
  }

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.99998 4.79167C4.42468 4.79167 3.95831 5.25804 3.95831 5.83333V15.8333C3.95831 16.4086 4.42468 16.875 4.99998 16.875H15C15.5753 16.875 16.0416 16.4086 16.0416 15.8333V5.83333C16.0416 5.25804 15.5753 4.79167 15 4.79167H4.99998ZM2.70831 5.83333C2.70831 4.56768 3.73433 3.54167 4.99998 3.54167H15C16.2656 3.54167 17.2916 4.56768 17.2916 5.83333V15.8333C17.2916 17.099 16.2656 18.125 15 18.125H4.99998C3.73433 18.125 2.70831 17.099 2.70831 15.8333V5.83333Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.3333 1.875C13.6785 1.875 13.9583 2.15482 13.9583 2.5V5.83333C13.9583 6.17851 13.6785 6.45833 13.3333 6.45833C12.9881 6.45833 12.7083 6.17851 12.7083 5.83333V2.5C12.7083 2.15482 12.9881 1.875 13.3333 1.875Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.66665 1.875C7.01182 1.875 7.29165 2.15482 7.29165 2.5V5.83333C7.29165 6.17851 7.01182 6.45833 6.66665 6.45833C6.32147 6.45833 6.04165 6.17851 6.04165 5.83333V2.5C6.04165 2.15482 6.32147 1.875 6.66665 1.875Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.70831 9.16667C2.70831 8.82149 2.98814 8.54167 3.33331 8.54167H16.6666C17.0118 8.54167 17.2916 8.82149 17.2916 9.16667C17.2916 9.51184 17.0118 9.79167 16.6666 9.79167H3.33331C2.98814 9.79167 2.70831 9.51184 2.70831 9.16667Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.33331 12.5C8.33331 12.0398 8.70641 11.6667 9.16665 11.6667H9.99998C10.4602 11.6667 10.8333 12.0398 10.8333 12.5C10.8333 12.9602 10.4602 13.3333 9.99998 13.3333H9.16665C8.70641 13.3333 8.33331 12.9602 8.33331 12.5Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.99998 11.875C10.3452 11.875 10.625 12.1548 10.625 12.5V15C10.625 15.3452 10.3452 15.625 9.99998 15.625C9.6548 15.625 9.37498 15.3452 9.37498 15V12.5C9.37498 12.1548 9.6548 11.875 9.99998 11.875Z"
        fill={color}
      />
    </svg>
  );
};

export default ResourcesIcon;
