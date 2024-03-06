import MuiTabs, { tabsClasses } from "@mui/material/Tabs";
import MuiTab, { tabClasses } from "@mui/material/Tab";
import styled from "@emotion/styled";

export const Tabs = styled(MuiTabs)({
  borderBottom: "1px solid #E1E3EA",
  [`& .${tabsClasses.indicator}`]: {
    backgroundColor: "transparent",
  },
});

export const Tab = styled(MuiTab)({
  padding: 0,
  paddingBottom: 14,
  textTransform: "none",
  borderBottom: "1px solid #EAECF0",
  fontSize: 16,
  fontWeight: 600,
  color: "#A1A5B7",
  lineHeight: "24px",
  marginRight: "30px",
  minWidth: "auto",
  [`&.${tabClasses.selected}`]: {
    borderBottom: "2px solid #6941C6",
    color: "#3F4254",
  },
});
