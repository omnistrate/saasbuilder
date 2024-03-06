import { Typography } from "@mui/material";

const PageHeading = ({ children, color, ...restProps }) => {
  return (
    <Typography
      variant="h4"
      fontWeight="700"
      fontSize="24px"
      lineHeight="32px"
      textAlign="center"
      color={color ? color : "#111827"}
      {...restProps}
    >
      {children}
    </Typography>
  );
};

export default PageHeading;
