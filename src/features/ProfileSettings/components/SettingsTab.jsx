import * as React from "react";
import Box from "@mui/material/Box";
import MuiTabs, { tabsClasses } from "@mui/material/Tabs";
import MuiTab, { tabClasses } from "@mui/material/Tab";
import styled from "@emotion/styled";

export const tabs = {
  profile: "Profile",
  password: "Password",
};

export default function SettingsTab(props) {
  const { currentTab, router } = props;

  const handleChangeTab = (view) => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          view: view,
        },
      },
      undefined,
      {
        shallow: true,
      }
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
          label={tabs.profile}
          value={tabs.profile}
          onClick={() => {
            handleChangeTab(tabs.profile);
          }}
        />
        <Tab
          label={tabs.password}
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
