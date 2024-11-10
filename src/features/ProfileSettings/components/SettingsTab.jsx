import * as React from "react";
import Box from "@mui/material/Box";

import { tabLabel, tabs } from "../constants";
import { useRouter } from "next/router";
import { getSettingsRoute } from "src/utils/route/settings";
import { Tab, Tabs } from "src/components/Tab/Tab";

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
      </Tabs>
    </Box>
  );
}
