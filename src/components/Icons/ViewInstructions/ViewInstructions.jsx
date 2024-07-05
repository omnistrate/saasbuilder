import * as React from "react";
const ViewInstructionsIcon = (props) => {
  const { height = 20, width = 17, color = "#475467" } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6666 7.9165V5.6665C14.6666 4.26637 14.6666 3.56631 14.3941 3.03153C14.1544 2.56112 13.772 2.17867 13.3016 1.93899C12.7668 1.6665 12.0667 1.6665 10.6666 1.6665H5.33325C3.93312 1.6665 3.23306 1.6665 2.69828 1.93899C2.22787 2.17867 1.84542 2.56112 1.60574 3.03153C1.33325 3.56631 1.33325 4.26637 1.33325 5.6665V14.3332C1.33325 15.7333 1.33325 16.4334 1.60574 16.9681C1.84542 17.4386 2.22787 17.821 2.69828 18.0607C3.23306 18.3332 3.93312 18.3332 5.33325 18.3332H9.66659M9.66659 9.1665H4.66659M6.33325 12.4998H4.66659M11.3333 5.83317H4.66659M11.7499 12.5017C11.8967 12.0843 12.1866 11.7323 12.568 11.5082C12.9495 11.284 13.398 11.202 13.8341 11.2768C14.2702 11.3516 14.6658 11.5783 14.9507 11.9168C15.2357 12.2553 15.3916 12.6838 15.391 13.1262C15.391 14.3753 13.5174 14.9998 13.5174 14.9998M13.5415 17.4998H13.5498"
        stroke={color}
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default ViewInstructionsIcon;
