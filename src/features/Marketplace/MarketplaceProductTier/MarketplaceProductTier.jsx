import { Box, Divider, Typography, styled } from "@mui/material";
import { useRouter } from "next/router";
import DashboardLayout from "src/components/DashboardLayout/DashboardLayout";
import useServiceOfferingById from "./hooks/useServiceOfferingById";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import ProductTiers from "src/features/ProductTiers/ProductTiers";
import useUserSubscriptions from "src/hooks/query/useUserSubscriptions";
import useProductTierRedirect from "./hooks/useProductTierRedirect";
import NoServiceFoundUI from "../components/NoServiceFoundUI";
import Head from "next/head";
// import NoLogoImage from "public/assets/images/logos/no-logo.png";
import placeholderService from "public/assets/images/dashboard/service/servicePlaceholder.png";

function MarketplaceProductTier({ orgLogoURL, orgName }) {
  const router = useRouter();
  const { serviceId, environmentId } = router.query;

  const serviceOfferingQuery = useServiceOfferingById(serviceId);
  const { data: serviceOfferingData, isFetching } = serviceOfferingQuery;
  const subscriptionsQuery = useUserSubscriptions();
  const { shouldDisplayNoServicesUI, shouldDisplayServiceNotFoundUI } =
    useProductTierRedirect();

  const {
    isLoading: isSubscriptionLoading,
    refetch: refetchSubscriptions,
    data: subscriptions = [],
  } = subscriptionsQuery;

  if (shouldDisplayServiceNotFoundUI || shouldDisplayNoServicesUI) {
    return (
      <>
        <Head>
          <title>Service Plans</title>
        </Head>
        <DashboardLayout
          noSidebar
          marketplacePage
          serviceName={orgName}
          serviceLogoURL={orgLogoURL || placeholderService}
        >
          <NoServiceFoundUI
            text={
              shouldDisplayNoServicesUI
                ? "No Service Found"
                : "Service Not Found"
            }
          />
        </DashboardLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Service Plans</title>
      </Head>
      <DashboardLayout
        noSidebar
        marketplacePage
        serviceName={serviceOfferingData?.serviceName}
        serviceLogoURL={
          serviceOfferingData?.offerings?.[0].serviceLogoURL ||
          orgLogoURL ||
          placeholderService
        }
      >
        {!serviceId || !environmentId || isFetching || isSubscriptionLoading ? (
          <Box display="flex" justifyContent="center" mt="200px">
            <LoadingSpinner />
          </Box>
        ) : (
          <>
            <Title>{serviceOfferingData?.serviceName}</Title>
            <Divider />
            <Box mt="40px">
              <ProductTiers
                source="marketplace"
                serviceId={serviceId}
                environmentId={environmentId}
                serviceOfferingData={serviceOfferingData}
                subscriptionsData={subscriptions}
                refetchSubscriptions={refetchSubscriptions}
              />
            </Box>
          </>
        )}
      </DashboardLayout>
    </>
  );
}

export default MarketplaceProductTier;

export const Title = styled(Typography)(() => ({
  color: "#101828",
  fontSize: "24px",
  fontWeight: "700",
  lineHeight: "32px",
  marginBottom: "10px",
}));
