import { Box, Divider, IconButton, MenuItem, styled } from "@mui/material";
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

function LogoHeader(props) {
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

const Description = styled("p")(({ theme }) => ({
  color: theme.palette.neutral[500],
  fontSize: 16,
  lineHeight: "24px",
  marginTop: -1,
}));
