import { Box, styled } from "@mui/material";
import React from "react";

function HeaderTitle(props) {
  const { title, desc } = props;

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      margin="2px"
      marginLeft="10px"
    >
      <Box display="block" justifyContent="flex-start" alignItems="center">
        <Title>{title}</Title>
        <Description>{desc}</Description>
      </Box>
    </Box>
  );
}

export default HeaderTitle;

const Title = styled("h6")({
  fontWeight: 600,
  fontSize: "24px",
  lineHeight: "32px",
  marginTop: 5,
});

const Description = styled("p")(({ theme }) => ({
  color: theme.palette.neutral[500],
  fontSize: 16,
  lineHeight: "24px",
  marginTop: -1,
}));
