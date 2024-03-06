import { Box, Typography } from "@mui/material";
import Link from "next/link";

const Footer = (props) => {
  const { orgName } = props;
  return (
    <Box
      position="absolute"
      bottom="14px"
      left="0"
      right="0"
      display="flex"
      justifyContent="center"
      gap="10px"
    >
      <Typography
        fontWeight="500"
        fontSize="14px"
        lineHeight="22px"
        color="#A0AEC0"
      >
        © {new Date().getFullYear()} {orgName}{" "}
        <Box component="span" sx={{ marginLeft: "12px" }}>
          All rights reserved.
        </Box>
      </Typography>

      <Link
        href="/terms-of-use"
        style={{
          fontWeight: "500",
          fontSize: "14px",
          lineHeight: "22px",
          color: "#111827",
        }}
      >
        Terms & Conditions
      </Link>
      <Link
        href="/privacy-policy"
        style={{
          fontWeight: "500",
          fontSize: "14px",
          lineHeight: "22px",
          color: "#111827",
        }}
      >
        Privacy Policy
      </Link>
    </Box>
  );
};
export default Footer;
