import { Box, Stack } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiIconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import doubleArrowImg from "../../../public/assets/images/dashboard/double-arrow.svg";
import placeholderService from "../../../public/assets/images/dashboard/service/servicePlaceholder.png";
import Logo from "../Logo/Logo";
import MarketplaceStaticNavList from "./MarketplaceStaticNavList";
import { WhiteTooltip } from "../Tooltip/Tooltip";
import useIsEllipsisActive from "src/hooks/useIsEllipsisActive";
import providerConfig, { styleConfig } from "src/providerConfig";

export const drawerWidth = 265;
export const closedWidth = 70;

export default function SideDrawer(props) {
  const {
    toggleDrawer,
    open,
    SidebarUI,
    marketplacePage,
    accessPage,
    serviceId,
    enableConsumptionLinks,
    servicePlanUrlLink,
    serviceApiId,
    notificationBarHeight,
    customLogo,
    serviceName,
    serviceLogoURL,
    apiDocsurl,
    isActive,
    setSupportDrawerOpen,
    setCurrentTabValue,
    subscriptionId,
  } = props;

  const { hasEllipsis, textElementRef } = useIsEllipsisActive();

  return (
    <Stack
      position="fixed"
      left="0"
      top="72px"
      bottom="0"
      justifyContent="space-between"
      borderRight={`1px solid ${styleConfig.sidebarBorderColor}`}
      width="280px"
      p="24px 32px"
      zIndex="100"
      sx={{
        backgroundColor: styleConfig.sidebarBg,
        scrollbarGutter: "stable",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          display: "none" /* Hide scrollbar for Chrome, Safari and Opera */,
        },
        "msOverflowStyle": "none" /* IE and Edge */,
        "scrollbarWidth": "none" /* Firefox */,
      }}
    >
      <Box>{SidebarUI ? SidebarUI : ""}</Box>
      {(marketplacePage || accessPage) && enableConsumptionLinks && (
        <MarketplaceStaticNavList
          servicePlanUrlLink={servicePlanUrlLink}
          serviceId={serviceId}
          serviceApiId={serviceApiId}
          apiDocs={apiDocsurl}
          isActive={isActive}
          setSupportDrawerOpen={setSupportDrawerOpen}
          setCurrentTabValue={setCurrentTabValue}
          subscriptionId={subscriptionId}
        />
      )}
    </Stack>
  );
}

const LogoWithoutText = styled(Image)({
  height: 34.3,
  width: 34.4,
  marginLeft: 2,
});

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  background: "#040E25",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflow: "visible",
  background: "#040E25",
  width: closedWidth,
});

const IconButton = styled(MuiIconButton)(({ theme, open }) => ({
  position: open ? "static" : "absolute",
  right: 0,
  transform: open ? "none" : "translateX(calc(100%))",
  borderRadius: 6,
  border: open ? "none" : "1px solid rgba(0,0,0,0.1)",
  borderLeft: "none",
  backgroundColor: open ? "#040E25" : "white",
  "&:hover": {
    backgroundColor: open ? "#040E25" : "white",
  },
}));

const ToggleIcon = styled(Image, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transform: open ? "none" : "rotate(180deg)",
}));

export const DrawerHeader = styled("div", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  display: "flex",
  alignItems: "center",
  gap: 18,
  padding: open ? "12px 22px" : "12px 8px",
  backgroundColor: "#040E25",
  position: "relative",
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  minHeight: "74px !important",
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) =>
    prop !== "open" && prop !== "notificationBarHeight",
})(({ theme, open, notificationBarHeight }) => ({
  width: drawerWidth,
  backgroundColor: "#040E25",
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": { ...openedMixin(theme) },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": { ...closedMixin(theme) },
  }),
}));

const CustomLogoText = styled("div", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: "100%",
  height: "30px",
  color: "white",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "22px",
  lineHeight: "30px",
  weight: 600,
}));

const ServiceLogoURL = styled(Image)(({ theme }) => ({
  height: 40,
  width: 40,
  flexBasis: 48,
  objectFit: "cover",
  borderRadius: "50%",
  boxShadow:
    " 0px 10px 15px -3px rgba(16, 24, 40, 0.1), 0px 4px 6px -4px rgba(16, 24, 40, 0.1)",
}));
