import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import resourceIcon from "../../../public/assets/images/dashboard/sidebar/resource.svg";
import { selectDrawerExpandedState } from "../../slices/dashboardSideDrawerSlice";
import {
  // ListItem,
  ListItemIcon,
  ListItemText,
  MenuHoverTooltip,
  MenuHoverTooltipTitle,
  StyledLinkContainer,
} from "../DashboardLayout/NavItem";
import AccessControlNavIcon from "../Icons/SideNavbar/AccessControl/AccessControl";
import DashboardNavIcon from "../Icons/SideNavbar/Dashboard/Dashboard";
import EventsNavIcon from "../Icons/SideNavbar/Events/Events";
import Tooltip from "../Tooltip/Tooltip";
import {
  getEnumFromUserRoleString,
  isOperationAllowedByRBAC,
  operationEnum,
  viewEnum,
} from "../../utils/isAllowedByRBAC";
import { selectUserrootData } from "../../slices/userDataSlice";
import {
  getAccessContorlRoute,
  getDashboardRoute,
  getEventRoute,
  getResourceRoute,
} from "../../utils/route/access/accessRoute";
import { People } from "@mui/icons-material";
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
    isLoading,
    active,
    onResourceInstanceClick = () => {},
    selectedResource,
    serviceName,
    isResourceInstanceLoading = true,
    activeResourceId,
    currentSource,
    currentSubscription,
  } = props;
  const isDrawerExpanded = useSelector(selectDrawerExpandedState);

  const isAccessControlActive = active === sidebarActiveOptions.accessControl;
  const isEventsActive = active === sidebarActiveOptions.events;
  const isDashboardActive = active === sidebarActiveOptions.dashboard;

  const selectUser = useSelector(selectUserrootData);
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
    currentSource,
    currentSubscription?.id
  );
  const eventUrlLink = getEventRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSource,
    currentSubscription?.id
  );
  const dashboardUrlLink = getDashboardRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSource,
    currentSubscription?.id
  );
  const resourceUrlLink = getResourceRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSource,
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
      />
    </Box>
  );
}

export default MarketplaceServiceSidebar;
