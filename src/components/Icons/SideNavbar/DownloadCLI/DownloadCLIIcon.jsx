const DownloadCLIIcon = (props) => {
  const { active, ...restProps } = props;
  let color = props.color || "#7F8194";

  if (active) {
    color = "#FFF";
  }
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path
        d="M8 11.9999L12 15.9999M12 15.9999L16 11.9999M12 15.9999V6.79994C12 5.40923 12 4.71388 11.4495 3.93534C11.0837 3.41806 10.0306 2.77962 9.40278 2.69456C8.45789 2.56654 8.09907 2.75372 7.38143 3.12808C4.18333 4.79637 2 8.14318 2 11.9999C2 17.5228 6.47715 21.9999 12 21.9999C17.5228 21.9999 22 17.5228 22 11.9999C22 8.29853 19.989 5.06681 17 3.33776"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default DownloadCLIIcon;
