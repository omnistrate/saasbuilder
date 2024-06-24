import { FC, useCallback, useState } from "react";
import Link from "next/link";
import clipboard from "clipboardy";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import DataGridCopyIcon from "../Icons/CopyIcon/DataGridCopyIcon";

const colorMap = {
  default: "#475467",
  primary: "#7F56D9",
};

const DataGridText = ({
  children,
  showCopyButton,
  linkProps,
  onClick,
  color = "default",
  style = {},
}) => {
  const [tooltipText, setTooltipText] = useState("Click to copy");
  const { href, target = "_self", isUnderlined = false } = linkProps || {};

  const onCopyIconClick = useCallback(() => {
    clipboard
      .write(children)
      .then(() => setTooltipText("Copied"))
      .catch(() => setTooltipText("Unable to copy to clipboard"))
      .finally(() => setTimeout(() => setTooltipText("Click to copy"), 1500)); // Reset the tooltip text after copying
  }, []);

  const textStyles = {
    fontSize: "12px",
    lineHeight: "18px",
    fontWeight: 500,
    color: colorMap[color],
    textDecoration: isUnderlined
      ? `underline solid ${colorMap[color]} 1px`
      : "none",
  };

  const Content = () =>
    href ? (
      <Typography title={children} noWrap style={{ ...textStyles }}>
        <Link
          href={
            href.startsWith("/") ||
            href.startsWith("https://") ||
            href.startsWith("http://")
              ? href
              : `https://${href}`
          }
          target={target}
          rel="noopener noreferrer"
          style={style}
        >
          {children}
        </Link>
      </Typography>
    ) : (
      <Typography
        title={children}
        noWrap // To add ellipses
        style={{
          cursor: linkProps || onClick ? "pointer" : "auto",
          ...textStyles,
          ...style,
        }}
        onClick={onClick}
      >
        {children}
      </Typography>
    );

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      gap="4px"
      width="100%"
    >
      <Content />
      {children && showCopyButton && (
        <Tooltip title={tooltipText} placement="top">
          <IconButton onClick={onCopyIconClick}>
            <DataGridCopyIcon />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};

export default DataGridText;
