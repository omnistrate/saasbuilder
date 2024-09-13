import { useState } from "react";
import clipboard from "clipboardy";
import Tooltip from "../Tooltip/Tooltip";
import { IconButton, styled } from "@mui/material";
import copyIcon from "../../../public/assets/images/dashboard/copy.svg";
import Image from "next/image";

const CopyToClipbpoardButton = (props) => {
  const { text = "", size = "medium", buttonStyles = {} } = props;
  const [tooltipText, setTooltipText] = useState("Click to copy");

  function handleClick() {
    if (text) {
      clipboard
        .write(text)
        .then(() => {
          setTooltipText("Copied");
        })
        .catch(() => {
          setTooltipText("Unable to copy to clipboard");
        });
    } else {
      setTooltipText("Nothing to be copied!");
    }
  }

  return (
    <Tooltip
      title={tooltipText}
      onOpen={() => {
        setTooltipText("Click to copy");
      }}
      placement="top"
    >
      <IconButton onClick={handleClick} sx={buttonStyles}>
        <CopyIcon src={copyIcon} size={size} alt="copy" />
      </IconButton>
    </Tooltip>
  );
};

export default CopyToClipbpoardButton;

const CopyIcon = styled(Image, {
  shouldForwardProp: (prop) => prop !== "size",
})(({ size }) => ({
  height: size === "small" ? "18px" : "24px",
  width: size === "small" ? "18px" : "24px",
}));
