import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { apiDocsUrl } from "../../utils/constants";
import useDownloadCLI from "../../hooks/useDownloadCLI";
import { tabs } from "../Tab/MarketplaceServiceDefinitionsTab";
import { selectUserrootData } from "../../slices/userDataSlice";
import {
  getEnumFromUserRoleString,
  isOperationAllowedByRBAC,
  operationEnum,
  viewEnum,
} from "../../utils/isAllowedByRBAC";
import SupportIcon from "../Icons/SideNavbar/Support/SupportIcon.jsx";
import APIDocsIcon from "../Icons/SideNavbar/APIDocs/APIDocsIcon.jsx";
import PricingIcon from "../Icons/SideNavbar/Pricing/PricingIcon.jsx";
import DownloadCLIIcon from "../Icons/SideNavbar/DownloadCLI/DownloadCLIIcon.jsx";
import DeveloperDocsIcon from "../Icons/SideNavbar/DeveloperDocs/DeveloperDocsIcon.jsx";
import SidebarListItem from "./SidebarListItem";
import { styleConfig } from "src/providerConfig";
import { useState } from "react";
import SideDrawerRight from "../SideDrawerRight/SideDrawerRight";
import { AccessSupport } from "../Access/AccessSupport";
import useServiceOffering from "src/hooks/useServiceOffering";
import { useRouter } from "next/router";
import useEnvironmentType from "src/hooks/useEnvironmentType";

const MarketplaceStaticNavList = (props) => {
  const [supportDrawerOpen, setSupportDrawerOpen] = useState(false);
  const [currentTabValue, setCurrentTabValue] = useState(false);
  const environmentType = useEnvironmentType();
  const router = useRouter();

  const {
    // serviceId,
    serviceApiId,
    apiDocs,
    isActive,
    // setSupportDrawerOpen,
    // setCurrentTabValue,
    // subscriptionId
  } = props;

  const { serviceId, productTierId, subscriptionId } = router.query;

  const { data: service, isFetching: isFetchingData } = useServiceOffering(
    serviceId,
    productTierId
  );
  const { downloadCLI, isDownloading } = useDownloadCLI();

  const selectUser = useSelector(selectUserrootData);
  const role = getEnumFromUserRoleString(selectUser.roleType);
  const view = viewEnum.AccessService;
  const readAccessServiceAllowed = isOperationAllowedByRBAC(
    operationEnum.Read,
    role,
    view
  );

  const closeSupportDrawer = () => {
    setSupportDrawerOpen(false);
    setCurrentTabValue(null);
  };

  const openDrawer = (tab) => {
    setSupportDrawerOpen(true);
    setCurrentTabValue(tab);
  };

  const NavLinks = [
    {
      text: "Download CLI",
      isDisabled: isDownloading,
      isLoading: isDownloading,
      icon: DownloadCLIIcon,
      onClick: () => {
        if (!isDownloading) {
          downloadCLI(serviceId, serviceApiId, subscriptionId);
        }
      },
    },
    {
      text: "Support",
      isActive: currentTabValue === tabs.support,
      isDisabled: isFetchingData || !readAccessServiceAllowed,
      icon: SupportIcon,
      onClick: () => openDrawer(tabs.support),
    },
    {
      text: "Pricing",
      isActive: currentTabValue === tabs.pricing,
      isDisabled: isFetchingData || !readAccessServiceAllowed,
      icon: PricingIcon,
      onClick: () => openDrawer(tabs.pricing),
    },
    {
      text: "Documentation",
      isActive: currentTabValue === tabs.documentation,
      isDisabled: isFetchingData || !readAccessServiceAllowed,
      icon: DeveloperDocsIcon,
      onClick: () => openDrawer(tabs.documentation),
    },
  ];

  if (environmentType !== "PROD") {
    NavLinks.unshift({
      text: "API Documentation",
      isDisabled: false,
      isActive: isActive,
      href: apiDocs ?? apiDocsUrl,
      icon: APIDocsIcon,
      newTab: apiDocs ? false : true,
    });
  }

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

      <SideDrawerRight
        size="xlarge"
        open={supportDrawerOpen}
        closeDrawer={closeSupportDrawer}
        RenderUI={
          <AccessSupport service={service} currentTabValue={currentTabValue} />
        }
      />
    </Box>
  );
};

export default MarketplaceStaticNavList;
