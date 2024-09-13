import { Box } from "@mui/material";
import AccessControlNavIcon from "../Icons/SideNavbar/AccessControl/AccessControl";
import DashboardNavIcon from "../Icons/SideNavbar/Dashboard/Dashboard";
import EventsNavIcon from "../Icons/SideNavbar/Events/Events";
import {
  getEnumFromUserRoleString,
  isOperationAllowedByRBAC,
  operationEnum,
  viewEnum,
} from "../../utils/isAllowedByRBAC";
import {
  getAccessContorlRoute,
  getDashboardRoute,
  getEventRoute,
  getResourceRoute,
} from "../../utils/route/access/accessRoute";
import { styleConfig } from "src/providerConfig";
import SidebarListItem from "../DashboardLayout/SidebarListItem";
import ResourcesDropdown from "./ResourcesDropdown";

export const sidebarActiveOptions = {
  accessControl: "accessControl",
  events: "events",
  dashboard: "dashboard",
  metrics: "metrics",
};

function MarketplaceServiceSidebar(props) {
  const {
    serviceId,
    productTierId,
    environmentId,
    resourceParameters = [],
    active,
    selectedResource,
    activeResourceId,
    currentSubscription,
    isCustomNetworkEnabled,
    isCustomNetworkActive,
  } = props;

  const isAccessControlActive = active === sidebarActiveOptions.accessControl;
  const isEventsActive = active === sidebarActiveOptions.events;
  const isDashboardActive = active === sidebarActiveOptions.dashboard;

  const role = getEnumFromUserRoleString(currentSubscription?.roleType);

  const listingAllowedForAccessService = isOperationAllowedByRBAC(
    operationEnum.List,
    role,
    viewEnum.Access_AccessControl
  );

  const accessUrlLink = getAccessContorlRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSubscription?.id
  );
  const eventUrlLink = getEventRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSubscription?.id
  );
  const dashboardUrlLink = getDashboardRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSubscription?.id
  );
  const resourceUrlLink = getResourceRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSubscription?.id
  );

  const NavLinks = [
    {
      text: "Dashboard",
      isDisabled: false,
      isActive: isDashboardActive,
      href: dashboardUrlLink,
      icon: DashboardNavIcon,
    },

    {
      text: "Events",
      isDisabled: false,
      isActive: isEventsActive,
      href: eventUrlLink,
      icon: EventsNavIcon,
    },
    {
      text: "Access Control",
      isDisabled: !listingAllowedForAccessService,
      isActive: isAccessControlActive,
      href: accessUrlLink,
      icon: AccessControlNavIcon,
    },
  ];

  return (
    <Box>
      {NavLinks.map((navItem) => (
        <SidebarListItem
          key={navItem.text}
          textColor={styleConfig.sidebarTextColor}
          disabledColor={styleConfig.sidebarIconDisabledColor}
          {...navItem}
        />
      ))}
      <ResourcesDropdown
        activeResourceId={activeResourceId}
        selectedResource={selectedResource}
        resourceUrlLink={resourceUrlLink}
        resourceParameters={resourceParameters}
        isCustomNetworkEnabled={isCustomNetworkEnabled}
        isCustomNetworkActive={isCustomNetworkActive}
      />
    </Box>
  );
}

export default MarketplaceServiceSidebar;
