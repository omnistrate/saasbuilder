import { getProviderOrgDetails } from "src/server/api/customer-user";
import BillingPage from "src/features/Billing/BillingPage";
import DashboardLayout from "src/components/DashboardLayout/DashboardLayout";
import MarketplaceServiceSidebar, {
  sidebarActiveOptions,
} from "src/components/MarketplaceServiceSidebar/MarketplaceServiceSidebar";
import useServiceOffering from "src/hooks/useServiceOffering";
import {
  getAPIDocsRoute,
  getMarketplaceRoute,
} from "src/utils/route/access/accessRoute";
import useSubscriptionForProductTierAccess from "src/hooks/query/useSubscriptionForProductTierAccess";
import { useRouter } from "next/router";
import { useMemo } from "react";

export const getServerSideProps = async () => {
  let orgName = "";
  let orgLogoURL = "";
  try {
    const response = await getProviderOrgDetails();
    orgName = response.data.orgName;
    orgLogoURL = response.data.orgLogoURL;
  } catch (err) {}

  return {
    props: {
      orgName: orgName,
      orgLogoURL: orgLogoURL,
    },
  };
};

export default function Billing({ orgLogoURL, orgName }) {
  const router = useRouter();
  const { serviceId, environmentId, productTierId, subscriptionId } =
    router.query;

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
    environmentId : environmentId,
    serviceApiId: serviceOffering?.serviceAPIID,
    SidebarUI: (
      <MarketplaceServiceSidebar
        serviceId={serviceId}
        environmentId={environmentId}
        resourceParameters={serviceOffering?.resourceParameters}
        isLoading={isServiceOfferingLoading}
        serviceName={serviceOffering?.serviceName}
        productTierId={productTierId}
        active={sidebarActiveOptions.billing}
        currentSubscription={subscriptionData}
        isCustomNetworkEnabled={isCustomNetworkEnabled}
      />
    ),

    serviceName: serviceOffering?.serviceName,
    customLogo: true,
    serviceLogoURL: serviceOffering?.serviceLogoURL,
  };

  return (
    <DashboardLayout
      {...dashboardLayoutProps}
    >
      <BillingPage orgLogoURL={orgLogoURL} orgName={orgName} />
    </DashboardLayout>
  );
}
