import Link from "next/link";
import { Box, Typography } from "@mui/material";
import LoadingSpinnerSmall from "../CircularProgress/CircularProgress";

const SidebarListItem = ({
  isActive,
  isDisabled,
  isLoading,
  icon: Icon,
  text,
  href,
  textColor,
  disabledColor,
  onClick,
  newTab,
}) => {
  const InnerContent = () => (
    <Box
      display="flex"
      alignItems="center"
      gap="10px"
      p="16px"
      borderRadius="8px"
      width="100%"
      border={isActive ? "1px solid #12B76A" : "none"}
      borderLeft={isActive ? "3px solid #12B76A" : "none"}
      margin={isActive ? "-1px -1px -1px -3px" : "0px"} // To Avoid Layout Shift when Borders Change
      onClick={() => {
        if (!isDisabled) {
          onClick?.();
        }
      }}
      sx={{
        cursor: isDisabled ? "not-allowed" : "pointer",
      }}
    >
      <Icon disabled={isDisabled} active={isActive} />
      <Typography
        fontWeight="700"
        fontSize="14px"
        lineHeight="22px"
        letterSpacing="0.2px"
        color={isDisabled ? disabledColor : textColor}
      >
        {text}
      </Typography>
      {isLoading && <LoadingSpinnerSmall sx={{ marginLeft: "20px" }} />}
    </Box>
  );

  return href && !isDisabled ? (
    <Link target={newTab ? "_blank" : "_self"} href={href}>
      <InnerContent />
    </Link>
  ) : (
    <InnerContent />
  );
};

export default SidebarListItem;
