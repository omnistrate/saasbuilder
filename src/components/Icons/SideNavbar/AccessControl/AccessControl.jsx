import { styleConfig } from "src/providerConfig";

const AccessControlNavIcon = (props) => {
  const { active, disabled, ...restProps } = props;
  let color = props.color || styleConfig.sidebarIconColor;

  if (active) {
    color = styleConfig.sidebarIconActiveColor;
  }
  if (disabled) {
    color = styleConfig.sidebarIconDisabledColor;
  }

  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path
        d="M22 21.8767V19.8767C22 18.0129 20.7252 16.4468 19 16.0027M15.5 4.16747C16.9659 4.76085 18 6.19802 18 7.87671C18 9.5554 16.9659 10.9926 15.5 11.586M17 21.8767C17 20.0129 17 19.0811 16.6955 18.346C16.2895 17.3659 15.5108 16.5872 14.5307 16.1812C13.7956 15.8767 12.8638 15.8767 11 15.8767H8C6.13623 15.8767 5.20435 15.8767 4.46927 16.1812C3.48915 16.5872 2.71046 17.3659 2.30448 18.346C2 19.0811 2 20.0129 2 21.8767M13.5 7.87671C13.5 10.0858 11.7091 11.8767 9.5 11.8767C7.29086 11.8767 5.5 10.0858 5.5 7.87671C5.5 5.66757 7.29086 3.87671 9.5 3.87671C11.7091 3.87671 13.5 5.66757 13.5 7.87671Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default AccessControlNavIcon;
