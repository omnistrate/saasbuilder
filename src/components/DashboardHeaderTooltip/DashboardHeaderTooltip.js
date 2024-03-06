import { styled } from "@mui/material";
import MuiTooltip, { tooltipClasses } from "@mui/material/Tooltip";

const DashboardHeaderTooltip = styled(
  ({ className, ...props }) => (
    <MuiTooltip {...props} arrow classes={{ popper: className }} />
  ),
  {
    shouldForwardProp: (prop) => prop !== "isVisible",
  }
)(({ theme, isVisible = true }) => ({
  display: isVisible ? "block" : "none",
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: "12px",
    lineHeight: "18px",
    fontWeight: 600,
    marginTop: "0px !important",
    borderRadius: "8px !important",
    padding: "12px !important",
    background: "#101828",
    boxShadow: "-6px 9px 15px 0px rgba(0, 0, 0, 0.36)",
  },
}));

export default DashboardHeaderTooltip;
