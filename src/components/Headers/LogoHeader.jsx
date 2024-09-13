import { Box, Divider, styled } from "@mui/material";
import Image from "next/image";
import React from "react";

function LogoHeader(props) {
  const { newicon, title } = props;

  return (
    <>
      <Box
        display="flex"
        flexDirection="colunm"
        alignItems="center"
        margin="22px"
        marginLeft="10px"
        justifyContent="flex-start"
      >
        <Icon src={newicon} alt="image-icon" />
        <Title>{title}</Title>
      </Box>

      <Divider />
    </>
  );
}

export default LogoHeader;

const Title = styled("h6")({
  fontWeight: 600,
  fontSize: "30px",
  lineHeight: "38px",
  margin: 5,
  marginLeft: 10,
});

const Icon = styled(Image)(({}) => ({
  height: 48,
  width: 48,
}));
