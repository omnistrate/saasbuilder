import React from "react";
import NextImage from "next/image";
import gcpIcon from "../../../../public/assets/images/logos/gcp.svg";
import { styled } from "@mui/material";

function GcpLogo(props) {
  return <Image src={gcpIcon} alt="gcp-logo" {...props} />;
}

export default GcpLogo;

const Image = styled(NextImage)(() => ({}));
