import MuiTabs, { tabsClasses } from "@mui/material/Tabs";
import MuiTab, { tabClasses } from "@mui/material/Tab";
import styled from "@emotion/styled";
import { styleConfig } from "src/providerConfig";

export const Tabs = styled(MuiTabs)({
  borderBottom: "1px solid #E1E3EA",

  [`& .${tabsClasses.indicator}`]: {
    backgroundColor: "transparent",
  },
  [`& .${tabsClasses.scrollButtons}`]: {
    paddingBottom: 14,
  },
});

export const Tab = styled(MuiTab)({
  padding: 0,
  paddingBottom: 14,
  textTransform: "none",
  borderBottom: "0px solid #EAECF0",
  fontSize: 14,
  padding: "12px 0px",
  fontWeight: 600,
  color: "#667085",
  lineHeight: "20px",
  // marginRight: "16px",
  minWidth: "auto",
  [`&.${tabClasses.selected}`]: {
    borderBottom: `2px solid ${styleConfig.secondaryColor}`,
    color: styleConfig.secondaryColor,
  },
  "&:hover": {
    borderBottom: `2px solid ${styleConfig.secondaryColor}`,
    color: styleConfig.secondaryColor,
  },
});
