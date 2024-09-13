import { Box, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import MarketplaceStaticNavList from "./MarketplaceStaticNavList";
import { styleConfig } from "src/providerConfig";

export const drawerWidth = 265;
export const closedWidth = 70;

export default function SideDrawer(props) {
  const {
    SidebarUI,
    marketplacePage,
    accessPage,
    serviceId,
    enableConsumptionLinks,
    servicePlanUrlLink,
    serviceApiId,
    apiDocsurl,
    isActive,
    setSupportDrawerOpen,
    setCurrentTabValue,
    subscriptionId,
  } = props;

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
        msOverflowStyle: "none" /* IE and Edge */,
        scrollbarWidth: "none" /* Firefox */,
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
