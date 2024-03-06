import { styleConfig } from "src/providerConfig";

const EventsNavIcon = (props) => {
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
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      {...restProps}
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 10H3m13-8v4M8 2v4m1 10 2 2 4.5-4.5M7.8 22h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 19.72 21 18.88 21 17.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 4 17.88 4 16.2 4H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 6.28 3 7.12 3 8.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 22 6.12 22 7.8 22Z"
      />
    </svg>
  );
};
export default EventsNavIcon;
