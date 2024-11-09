import * as React from "react";
import Box from "@mui/material/Box";
import MuiTabs, { tabsClasses } from "@mui/material/Tabs";
import MuiTab, { tabClasses } from "@mui/material/Tab";
import styled from "@emotion/styled";
import { tabLabel, tabs } from "../constants";
import { useRouter } from "next/router";
import { getSettingsRoute } from "src/utils/route/settings";

export default function SettingsTab(props) {
  const { currentTab } = props;
  const router = useRouter();
  const { serviceId, environmentId, productTierId, subscriptionId } =
    router.query;

  const handleChangeTab = (view) => {
    router.push(
      getSettingsRoute(
        serviceId,
        environmentId,
        productTierId,
        subscriptionId,
        view
      )
    );
  };

  return (
    <Box
      display="flex"
      sx={{ width: "100%", borderBottom: "2px solid #EAECF0" }}
    >
      <Tabs
        value={currentTab}
        centered
        sx={{
          [`& .${tabsClasses.indicator}`]: {
            backgroundColor: "transparent",
          },
        }}
      >
        <Tab
          label={tabLabel[tabs.profile]}
          value={tabs.profile}
          onClick={() => {
            handleChangeTab(tabs.profile);
          }}
        />
        <Tab
          label={tabLabel[tabs.billingAddress]}
          value={tabs.billingAddress}
          onClick={() => {
            handleChangeTab(tabs.billingAddress);
          }}
        />
        <Tab
          label={tabLabel[tabs.password]}
          value={tabs.password}
          onClick={() => {
            handleChangeTab(tabs.password);
          }}
        />
      </Tabs>
    </Box>
  );
}

const Tabs = styled(MuiTabs)({
  [`& .${tabsClasses.indicator}`]: {
    backgroundColor: "transparent",
  },
});

const Tab = styled(MuiTab)({
  paddingTop: 20,
  paddingBottom: 20,
  fontSize: 16,
  fontWeight: 500,
  textTransform: "none",
  [`&.${tabClasses.selected}`]: {
    backgroundColor: "#F4EBFF",
    fontSize: 16,
    fontWeight: 600,
    lineHeight: "20px",
    borderBottom: "2px solid #6941C6",
    color: "#6941C6",
  },
});
