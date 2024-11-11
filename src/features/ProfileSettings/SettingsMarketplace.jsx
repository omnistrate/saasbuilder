import React, { useEffect, useMemo } from "react";
import DashboardLayout from "src/components/DashboardLayout/DashboardLayout";
import { selectUserrootData } from "src/slices/userDataSlice";
import useUserData from "src/hooks/usersData";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import PasswordForm from "./components/PasswordForm";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import UserInfoBanner from "./components/UserInfoBanner";
import ProfileForm from "./components/ProfileForm";
import { tabs } from "./constants";
import BillingAddress from "./components/BillingAddress";
import MarketplaceServiceSidebar, {
  sidebarActiveOptions,
} from "src/components/MarketplaceServiceSidebar/MarketplaceServiceSidebar";
import useServiceOffering from "src/hooks/useServiceOffering";
import {
  getAPIDocsRoute,
  getMarketplaceRoute,
} from "src/utils/route/access/accessRoute";
import useSubscriptionForProductTierAccess from "src/hooks/query/useSubscriptionForProductTierAccess";
import { Box } from "@mui/material";

function SettingsMarketplace() {
  const router = useRouter();
  const { view, serviceId, environmentId, productTierId, subscriptionId } =
    router.query;
  const selectUser = useSelector(selectUserrootData);
  const { query, refetch } = useUserData();
  const [currentTab, setCurrentTab] = React.useState("Profile");

  const { data: serviceOffering, isLoading: isServiceOfferingLoading } =
    useServiceOffering(serviceId, productTierId);

  const subscriptionQuery = useSubscriptionForProductTierAccess(
    serviceId,
    productTierId,
    subscriptionId
  );

  const { data: subscriptionData = {} } = subscriptionQuery;

  const isCustomNetworkEnabled = useMemo(() => {
    let enabled = false;

    if (
      serviceOffering?.serviceModelFeatures?.find((featureObj) => {
        return featureObj.feature === "CUSTOM_NETWORKS";
      })
    )
      enabled = true;

    return enabled;
  }, [serviceOffering]);

  const isLoading =
    isServiceOfferingLoading ||
    query.isRefetching === true ||
    query.isLoading === true;

  useEffect(() => {
    if (router.isReady) {
      if (view) {
        setCurrentTab(view);
      }
    }
  }, [router.isReady, view]);

  const servicePlanUrlLink = getMarketplaceRoute(
    serviceId,
    environmentId,
    productTierId
  );

  const serviceAPIDocsLink = getAPIDocsRoute(
    serviceId,
    environmentId,
    productTierId,
    subscriptionData?.id
  );

  const dashboardLayoutProps = {
    accessPage: true,
    currentSubscription: subscriptionData,
    isNotShow: true,
    enableConsumptionLinks: true,
    apiDocsurl: serviceAPIDocsLink,
    servicePlanUrlLink: servicePlanUrlLink,
    serviceId: serviceId,
    environmentId: environmentId,
    serviceApiId: serviceOffering?.serviceAPIID,
    SidebarUI: (
      <MarketplaceServiceSidebar
        serviceId={serviceId}
        environmentId={environmentId}
        resourceParameters={serviceOffering?.resourceParameters}
        isLoading={isServiceOfferingLoading}
        serviceName={serviceOffering?.serviceName}
        productTierId={productTierId}
        active={sidebarActiveOptions.settings}
        currentSubscription={subscriptionData}
        isCustomNetworkEnabled={isCustomNetworkEnabled}
      />
    ),

    serviceName: serviceOffering?.serviceName,
    customLogo: true,
    serviceLogoURL: serviceOffering?.serviceLogoURL,
  };

  return (
    <DashboardLayout {...dashboardLayoutProps} p="0px">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <UserInfoBanner
            selectUser={selectUser}
            currentTab={currentTab}
            router={router}
          />
          <Box p="0px 32px">
            {currentTab === tabs.profile && (
              <ProfileForm refetch={refetch} selectUser={selectUser} />
            )}
            {currentTab === tabs.password && <PasswordForm />}
            {currentTab === tabs.billingAddress && (
              <BillingAddress refetch={refetch} selectUser={selectUser} />
            )}
          </Box>
        </>
      )}
    </DashboardLayout>
  );
}

export default SettingsMarketplace;
