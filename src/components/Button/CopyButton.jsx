import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import clipboard from "clipboardy";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const CopyButton = (props) => {
  const {
    text = "",
    tooltipProps = {},
    iconProps = {},
    iconStyle = {},
  } = props;
  const [tooltipText, setTooltipText] = useState("Click to copy");

  function handleClick() {
    clipboard
      .write(text)
      .then(() => setTooltipText("Copied"))
      .catch(() => setTooltipText("Unable to copy to clipboard"))
      .finally(() => setTimeout(() => setTooltipText("Click to copy"), 1500)); // Reset the tooltip text after copying
  }

  return (
    <Tooltip title={tooltipText} placement="top" {...tooltipProps}>
      <IconButton>
        <ContentCopyIcon
          htmlColor="#7F56D9"
          onClick={handleClick}
          sx={{ width: "16px", height: "18px", ...iconStyle }}
          {...iconProps}
        />
      </IconButton>
    </Tooltip>
  );
};

export default CopyButton;
