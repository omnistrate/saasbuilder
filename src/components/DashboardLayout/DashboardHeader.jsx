import { Box, Stack, styled } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MuiToolbar from "@mui/material/Toolbar";
import { useSelector } from "react-redux";
import useLogout from "../../hooks/useLogout";
import useUserData from "../../hooks/usersData";
import { closedWidth, drawerWidth } from "./SideDrawer";
import ProfileDropdown from "./ProfileDropdown";
import { selectUserData } from "src/slices/userDataSlice";
import { Text } from "../Typography/Typography";
import { styleConfig } from "src/providerConfig";
import ServicesDropdown from "./ServicesDropdown";
import useBillingDetails from "src/hooks/query/useBillingDetails";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) =>
    prop !== "open" && prop !== "noSidebar" && prop !== "notificationBarHeight",
})(({ theme, open, noSidebar }) => ({
  background: "#FFFFFF",
  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  boxShadow: "none",
  color: theme.palette.text.primary,
  zIndex: theme.zIndex.drawer - 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: noSidebar ? "100%" : `calc(100% - ${closedWidth}px)`,
  ...(open && {
    marginLeft: noSidebar === true ? 0 : drawerWidth,
    width: noSidebar === true ? "100%" : `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const NavItem = styled("span", { shouldForwardProp: false })(
  ({ theme, active }) => ({
    display: "inline-block",
    padding: active ? "12px 14px" : "8px 0px",
    backgroundColor: active ? "#F9F5FF" : "transparent",
    // borderBottom: active ? "1px solid #0288D1" : "none",
    fontSize: 15,
    lineHeight: "20px",
    borderRadius: "8px",
    fontWeight: 600,
    color: active ? "#6941C6" : "#101828",
    marginLeft: 24,
    "&:nth-of-type(1)": {
      marginLeft: 0,
    },
    "&:hover": {
      cursor: "pointer",
    },
  })
);

function DashboardHeader(props) {
  const {
    isOpen,
    noSidebar,
    marketplacePage,
    notificationBarHeight,
    accessPage,
    currentSubscription,
    serviceName,
    serviceLogoURL,
  } = props;

  useUserData();
  //prefetch billing data
  useBillingDetails();
  const userAllData = useSelector(selectUserData);
  const { logout } = useLogout();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      height="72px"
      pl="25px"
      pr="30px"
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      zIndex="100"
      sx={{
        backgroundColor: styleConfig.navbarBg,
        borderBottom: `1px solid ${styleConfig.navbarBorderColor}`,
      }}
    >
      <Stack direction="row" alignItems="center">
        <Box
          pr="20px"
          sx={{ display: "flex", direction: "row", alignItems: "center" }}
        >
          <ServicesDropdown />
        </Box>

        <Stack direction="row" alignItems="center" gap="10px" pr="16px">
          <img
            src={
              serviceLogoURL ||
              "/assets/images/dashboard/service/servicePlaceholder.png"
            }
            height={28}
            width={40}
            style={{ maxHeight: "28px", width: "auto", maxWidth: "180px" }}
          />
          <Text
            color={styleConfig.navbarTextColor}
            sx={{
              minWidth: "200px",
              maxWidth: "260px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {serviceName}
          </Text>
        </Stack>
      </Stack>

      <ProfileDropdown
        userAllData={userAllData}
        logout={logout}
        accessPage={accessPage}
        marketplacePage={marketplacePage}
        currentSubscription={currentSubscription}
      />
    </Box>
  );
}

export default DashboardHeader;

const Toolbar = styled(MuiToolbar, {
  shouldForwardProp: (prop) => !["noSidebar", "isOpen"].includes(prop),
})(({ isOpen, noSidebar, theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginLeft: noSidebar ? 0 : isOpen ? "0px" : "40px",
  minHeight: "74px !important",
}));
