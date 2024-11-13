import DashboardNavIcon from "../Icons/SideNavbar/Dashboard/Dashboard";
import {
  getEnumFromUserRoleString,
  isOperationAllowedByRBAC,
  operationEnum,
  viewEnum,
} from "../../utils/isAllowedByRBAC";
import {
  getAccessControlRoute,
  getAuditLogsRoute,
  getDashboardRoute,
  getNotificationsRoute,
  getResourceRoute,
} from "../../utils/route/access/accessRoute";
import SidebarDotIcon from "../Icons/SideNavbar/Dot/Dot";
import ResourcesIcon from "../Icons/SideNavbar/Resources/Resources";
import ShieldIcon from "../Icons/SideNavbar/Shield/Shield";
import { List } from "../DashboardLayout/NavList";
import NavItem from "../DashboardLayout/NavItem";
import { getSettingsRoute } from "src/utils/route/settings";
import { getSubscriptionsRoute } from "src/utils/route/subscriptions";
import { getBillingRoute } from "src/utils/route/billing";
import AccountManagementIcon from "../Icons/SideNavbar/AccountManagement/AccountManagement";

export const sidebarActiveOptions = {
  accessControl: "accessControl",
  auditLogs: "auditLogs",
  notifications: "notifications",
  dashboard: "dashboard",
  servicePlans: "servicePlans",
  settings: "settings",
  billing: "billing",
  subscriptions: "subscriptions",
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
  const isAuditLogsActive = active === sidebarActiveOptions.auditLogs;
  const isNotificationsActive = active === sidebarActiveOptions.notifications;
  const isDashboardActive = active === sidebarActiveOptions.dashboard;
  const isBillingActive = active === sidebarActiveOptions.billing;
  const isSubscriptionsActive = active === sidebarActiveOptions.subscriptions;
  const isSettingsActive = active === sidebarActiveOptions.settings;

  const role = getEnumFromUserRoleString(currentSubscription?.roleType);

  const listingAllowedForAccessService = isOperationAllowedByRBAC(
    operationEnum.List,
    role,
    viewEnum.Access_AccessControl
  );

  const accessControlUrlLink = getAccessControlRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSubscription?.id
  );

  const auditLogsUrlLink = getAuditLogsRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSubscription?.id
  );

  const notificationsUrlLink = getNotificationsRoute(
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

  const settingsLink = getSettingsRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSubscription?.id,
    "profile"
  );

  const subscriptionsRoute = getSubscriptionsRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSubscription?.id
  );

  const billingRoute = getBillingRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSubscription?.id
  );

  const resourceParametersList =
    resourceParameters
      ?.map((resourceParameter) => ({
        name: resourceParameter.name,
        IconComponent: SidebarDotIcon,
        href: `${resourceUrlLink}&resourceId=${resourceParameter.resourceId}`,
        isActive:
          (!isCustomNetworkActive &&
            resourceParameter.urlKey === selectedResource) ||
          resourceParameter.resourceId === activeResourceId,
        type: resourceParameter.resourceId?.includes("r-injectedaccountconfig")
          ? "cloudProviderAccount"
          : "generic",
      }))
      .filter((resource) => resource.type !== "cloudProviderAccount")
      .sort((a, b) => (a.name < b.name ? -1 : 1)) || [];

  const cloudProviderAccountResource = resourceParameters.find((resource) =>
    resource.resourceId.includes("r-injectedaccountconfig")
  );

  //Add 'Custom Networks' as a resource if custom networks feature is enabled
  if (isCustomNetworkEnabled) {
    resourceParametersList.push({
      name: "Custom Networks",
      IconComponent: SidebarDotIcon,
      href: `${resourceUrlLink}&viewType=custom-networks`,
      isActive: isCustomNetworkActive,
      type: "customNetwork",
    });
  }

  if (cloudProviderAccountResource) {
    resourceParametersList.push({
      name: cloudProviderAccountResource.name,
      IconComponent: SidebarDotIcon,
      href: `${resourceUrlLink}&resourceId=${cloudProviderAccountResource.resourceId}`,
      isActive:
        (!isCustomNetworkActive &&
          cloudProviderAccountResource.urlKey === selectedResource) ||
        cloudProviderAccountResource.resourceId === activeResourceId,
    });
  }

  const isResourcesPageActive = resourceParameters.some((resourceParameter) => {
    return (
      (!isCustomNetworkActive &&
        resourceParameter.urlKey === selectedResource) ||
      resourceParameter.resourceId === activeResourceId
    );
  });

  const items = [
    {
      name: "Dashboard",
      IconComponent: DashboardNavIcon,
      href: dashboardUrlLink,
      isActive: isDashboardActive,
    },
    {
      name: "Resources",
      iActive: false,
      IconComponent: ResourcesIcon,

      isExpandible: true,
      subItems: resourceParametersList,
      disableHoverEffect: true,
      defaultExpanded: isResourcesPageActive,
    },
    {
      name: "Security Controls",
      IconComponent: ShieldIcon,
      isActive: false,
      isExpandible: true,
      defaultExpanded:
        isAccessControlActive || isAuditLogsActive || isNotificationsActive,
      subItems: [
        {
          name: "Access Control",
          IconComponent: SidebarDotIcon,
          href: accessControlUrlLink,
          isActive: isAccessControlActive,
        },
        {
          name: "Audit Logs",
          IconComponent: SidebarDotIcon,
          href: auditLogsUrlLink,
          isActive: isAuditLogsActive,
          disabled: !listingAllowedForAccessService,
        },
        {
          name: "Notifications",
          IconComponent: SidebarDotIcon,
          href: notificationsUrlLink,
          isActive: isNotificationsActive,
        },
      ],
    },
    {
      name: "Account Management",
      IconComponent: AccountManagementIcon,
      isActive: false,
      isExpandible: true,
      defaultExpanded:
        isSettingsActive || isBillingActive || isSubscriptionsActive,
      subItems: [
        {
          name: "Settings",
          IconComponent: SidebarDotIcon,
          href: settingsLink,
          isActive: isSettingsActive,
        },
        {
          name: "Billing",
          IconComponent: SidebarDotIcon,
          href: billingRoute,
          isActive: isBillingActive,
          disabled: !listingAllowedForAccessService,
        },
        {
          name: "Subscriptions",
          IconComponent: SidebarDotIcon,
          href: subscriptionsRoute,
          isActive: isSubscriptionsActive,
        },
      ],
    },
  ];

  return (
    <List open={true}>
      {items.map((item) => (
        <NavItem
          key={item.name}
          name={item.name}
          IconComponent={item.IconComponent}
          href={item.href}
          isActive={item.isActive}
          iconSrc={item.iconSrc}
          subItems={item.subItems}
          isExpandible={item.isExpandible}
          defaultExpanded={item.defaultExpanded}
          disableHoverEffect={Boolean(item.disableHoverEffect)}
          disabled={item.disabled}
        />
      ))}
    </List>
  );
}

export default MarketplaceServiceSidebar;
