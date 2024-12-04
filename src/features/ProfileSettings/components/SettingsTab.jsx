import * as React from "react";
import Box from "@mui/material/Box";
import { tabLabel, tabs } from "../constants";
import { Tab, Tabs } from "src/components/Tab/Tab";

export default function SettingsTab(props) {
  const { currentTab, setCurrentTab, isBillingEnabled } = props;

  const handleChangeTab = (view) => {
    setCurrentTab(view);
  };

  return (
    <Box
      display="flex"
      sx={{ width: "100%", borderBottom: "2px solid #EAECF0" }}
    >
      <Tabs value={currentTab} centered>
        <Tab
          label={tabLabel[tabs.profile]}
          value={tabs.profile}
          onClick={() => {
            handleChangeTab(tabs.profile);
          }}
          sx={{ padding: "4px !important", marginRight: "16px !important" }}
        />
        <Tab
          label={tabLabel[tabs.billingAddress]}
          value={tabs.billingAddress}
          onClick={() => {
            handleChangeTab(tabs.billingAddress);
          }}
          sx={{ padding: "4px !important", marginRight: "16px !important" }}
        />
        <Tab
          label={tabLabel[tabs.password]}
          value={tabs.password}
          onClick={() => {
            handleChangeTab(tabs.password);
          }}
          sx={{ padding: "4px !important", marginRight: "16px !important" }}
        />
        <Tab
          label={tabLabel[tabs.subscriptions]}
          value={tabs.subscriptions}
          onClick={() => {
            handleChangeTab(tabs.subscriptions);
          }}
          sx={{ padding: "4px !important", marginRight: "16px !important" }}
        />
        {isBillingEnabled && (
          <Tab
            label={tabLabel[tabs.billing]}
            value={tabs.billing}
            onClick={() => {
              handleChangeTab(tabs.billing);
            }}
            sx={{ padding: "4px !important", marginRight: "16px !important" }}
          />
        )}
      </Tabs>
    </Box>
  );
}
