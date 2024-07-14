import Box from "@mui/material/Box";
import DashboardHeader from "./DashboardHeader";

import SideDrawer from "./SideDrawer";
import DashboardFooter from "./DashboardFooter";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDrawerExpandedState,
  toggleDrawer,
} from "../../slices/dashboardSideDrawerSlice";
import NotificationBar from "./NotificationBar";
import useNotificationBar from "../../hooks/useNotificationBar";

export default function DashboardLayout(props) {
  const dispatch = useDispatch();
  const {
    noSidebar,
    serviceId,
    SidebarUI,
    serviceName,
    accessPage,
    customLogo,
    marketplacePage,
    enableConsumptionLinks,
    serviceApiId,
    serviceLogoURL,
    apiDocsurl,
    isActive,
    isNotShow,
    currentSubscription,
    isServiceLength,
    noServicesAvailable
  } = props;
  const open = useSelector(selectDrawerExpandedState);
  const notificationBar = useNotificationBar();
  const notificationBarHeight = notificationBar.height;

  const toggleDrawerOpen = () => {
    dispatch(toggleDrawer());
  };

  return (
    <Box>
      {notificationBar.isVisible && <NotificationBar />}
      <DashboardHeader
        isOpen={open}
        noSidebar={noSidebar}
        marketplacePage={marketplacePage}
        notificationBarHeight={notificationBarHeight}
        serviceId={serviceId}
        toggleDrawer={toggleDrawerOpen}
        serviceName={serviceName}
        customLogo={customLogo}
        serviceLogoURL={serviceLogoURL}
        open={open}
        SidebarUI={SidebarUI}
        enableConsumptionLinks={enableConsumptionLinks}
        serviceApiId={serviceApiId}
        accessPage={accessPage}
        currentSubscription={currentSubscription}
        isServiceLength={isServiceLength}
        noServicesAvailable={noServicesAvailable}
      />
      {!noSidebar && (
        <SideDrawer
          accessPage={accessPage}
          marketplacePage={marketplacePage}
          serviceId={serviceId}
          toggleDrawer={toggleDrawerOpen}
          open={open}
          SidebarUI={SidebarUI}
          enableConsumptionLinks={enableConsumptionLinks}
          serviceApiId={serviceApiId}
          notificationBarHeight={notificationBarHeight}
          serviceName={serviceName}
          customLogo={customLogo}
          serviceLogoURL={serviceLogoURL}
          apiDocsurl={apiDocsurl}
          isActive={isActive}
          subscriptionId={currentSubscription?.id}
        />
      )}
      <Box
        sx={{
          pt: "72px",
          margin: "auto",
          maxWidth: noSidebar ? "1280px" : "100%",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            paddingBottom: "45px",
            marginLeft: noSidebar ? "0px" : "280px",
          }}
        >
          <Box component="main" p={3} sx={{ background: "white" }}>
            {props.children}
          </Box>
          <DashboardFooter
            open={open}
            noSidebar={noSidebar}
            isNotShow={isNotShow}
          />
        </Box>
      </Box>
    </Box>
  );
}
