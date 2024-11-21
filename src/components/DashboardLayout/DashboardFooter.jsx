import { styled } from "@mui/material";
import { closedWidth, drawerWidth } from "./SideDrawer";

const Footer = styled("footer", {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "noSidebar",
})(({ theme, open, noSidebar }) => ({
  background: "white",
  borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  padding: "12px 32px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: 14,
  lineHeight: "20px",
  color: "#6B7280",
  fontWeight: 500,
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  marginLeft: noSidebar ? 0 : open ? drawerWidth : closedWidth,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: `calc(100% - ${closedWidth}px)`,
  ...(open && {
    marginLeft: noSidebar === true ? 0 : drawerWidth,
    width: noSidebar === true ? "100%" : `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// const Copyright = styled("span")(({ theme }) => ({
//   fontWeight: 400,
//   color: "#9CA3AF",
// }));

function DashboardFooter(props) {
  const { noSidebar, isNotShow } = props;
  return isNotShow ? (
    ""
  ) : (
    <Footer open={props.open} noSidebar={noSidebar}>
      {/* <Copyright>
        © {new Date().getFullYear()} {providerConfig.providerOrgName} All rights
        reserved.
      </Copyright> */}
    </Footer>
  );
}

export default DashboardFooter;
