import { Box, IconButton, MenuItem, styled } from "@mui/material";
import Image from "next/image";
import React from "react";
import Card from "../Card/Card";
import ImagesIcon from "../../../public/assets/images/dashboard/service/image.png";
import newImagesIcon from "../../../public/assets/images/dashboard/service/latest_icons/choose_image_icon.svg";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  DisplayText,
  H5,
  P,
  textStyles,
  weights,
} from "../Typography/Typography";
import MuiChip, { chipClasses } from "@mui/material/Chip";
import Menu from "../Menu/Menu";

function HeaderTitle(props) {
  const { newicon, title, desc } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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

const Icon = styled(Image)(({}) => ({
  height: 48,
  width: 48,
}));

const Description = styled("p")(({ theme }) => ({
  color: theme.palette.neutral[500],
  fontSize: 16,
  lineHeight: "24px",
  marginTop: -1,
}));
