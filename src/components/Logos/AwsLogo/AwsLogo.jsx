import React from "react";
import NextImage from "next/image";
import awsIcon from "../../../../public/assets/images/logos/aws.svg";
import { styled } from "@mui/material";

function AwsLogo(props) {
  return <Image src={awsIcon} alt="aws-logo" {...props} />;
}

export default AwsLogo;

const Image = styled(NextImage)(() => ({}));
