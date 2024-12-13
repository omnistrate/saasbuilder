import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { createSubscriptionRequest } from "src/api/subscriptionRequests";
import { createSubscriptions } from "src/api/subscriptions";
import DashboardLayout from "src/components/DashboardLayout/DashboardLayout";
import {
  getMarketplaceProductTierRoute,
  getResourceRoute,
} from "src/utils/route/access/accessRoute";
import useOrgServiceOfferings from "../Marketplace/PublicServices/hooks/useOrgServiceOfferings";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import useSubscriptionRequests from "../Marketplace/MarketplaceProductTier/hooks/useSubscriptionRequests";
import useUserSubscriptions from "src/hooks/query/useUserSubscriptions";

const createSubscription = async (payload) => {
  if (payload.AutoApproveSubscription) {
    return createSubscriptions(payload, true);
  }
  return createSubscriptionRequest(payload, true);
};

const getServicePlansRoute = (offerings) => {
  if (!offerings?.length) return getMarketplaceProductTierRoute();
  const offering = offerings[0];
  return getMarketplaceProductTierRoute(
    offering.serviceId,
    offering.serviceEnvironmentID
  );
};

const RedirectPage = () => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data: subscriptions = [], isFetching: isFetchingSubscriptions } =
    useUserSubscriptions();

  // Group Subscriptions by Service ID and Product Tier ID
  const subscriptionsObj = useMemo(() => {
    return subscriptions.reduce((acc, subscription) => {
      if (acc[subscription.serviceId]) {
        acc[subscription.serviceId][subscription.productTierId] = subscription;
      } else {
        acc[subscription.serviceId] = {
          [subscription.productTierId]: subscription,
        };
      }
      return acc;
    }, {});
  }, [subscriptions]);

  const {
    data: subscriptionRequestsData,
    isFetching: isFetchingSubscriptionRequests,
  } = useSubscriptionRequests();

  const subscriptionRequestsObj = useMemo(() => {
    if (!subscriptionRequestsData?.subscriptionRequests) return {};

    return subscriptionRequestsData?.subscriptionRequests.reduce(
      (acc, subscriptionRequest) => {
        if (acc[subscriptionRequest.serviceId]) {
          acc[subscriptionRequest.serviceId][
            subscriptionRequest.productTierId
          ] = subscriptionRequest;
        } else {
          acc[subscriptionRequest.serviceId] = {
            [subscriptionRequest.productTierId]: subscriptionRequest,
          };
        }
        return acc;
      },
      {}
    );
  }, [subscriptionRequestsData]);

  const { data: serviceOfferingsData, isFetching: isFetchingServiceOfferings } =
    useOrgServiceOfferings({ refetchOnMount: false });

  useEffect(() => {
    if (
      isFetchingServiceOfferings ||
      isFetchingSubscriptionRequests ||
      isFetchingSubscriptions ||
      isRedirecting
    )
      return;

    const serviceOfferingsToSubscribe = serviceOfferingsData?.filter(
      (offering) => offering.AutoApproveSubscription
    );

    if (!serviceOfferingsToSubscribe?.length) {
      setIsRedirecting(true);
      router.push(getServicePlansRoute(serviceOfferingsData));
      return;
    }

    const subscribeAndRedirect = async () => {
      const promises = [];
      let firstOffering;

      serviceOfferingsToSubscribe.forEach((offering) => {
        const {
          serviceId,
          productTierID,
          AutoApproveSubscription,
          serviceEnvironmentVisibility,
        } = offering;

        if (
          !subscriptionsObj[serviceId]?.[productTierID] &&
          !subscriptionRequestsObj[serviceId]?.[productTierID]
        ) {
          if (!firstOffering) {
            firstOffering = offering;
          }
          promises.push(
            createSubscription({
              serviceId,
              productTierId: productTierID,
              AutoApproveSubscription,
              serviceEnvironmentVisibility,
            })
          );
        }
      });

      if (promises.length) {
        setIsRedirecting(true);
        await Promise.all(promises)
          .then((res) => {
            router.push(
              getResourceRoute(
                firstOffering.serviceId,
                firstOffering.serviceEnvironmentID,
                firstOffering.productTierID,
                Object.values(res[0].data).join("") // The Subscription ID
              )
            );
          })
          .catch((err) => {
            router.push(getServicePlansRoute(serviceOfferingsData));
            console.error(err);
          });
      } else {
        // Find Service Offering with a Subscription and Redirect them To the Corresponding Instances List Page
        const serviceOfferingsObj = serviceOfferingsData?.reduce(
          (acc, curr) => {
            acc[curr.productTierID] = curr;
            return acc;
          },
          {}
        );

        const directSubscription = subscriptions?.find(
          (sub) =>
            serviceOfferingsObj[sub.productTierId] && sub.defaultSubscription
        );

        const invitedSubscription = subscriptions?.find(
          (sub) => serviceOfferingsObj[sub.productTierId]
        );

        if (directSubscription || invitedSubscription) {
          const subscription = directSubscription || invitedSubscription;
          const offering = serviceOfferingsObj[subscription.productTierId];
          const route = getResourceRoute(
            subscription.serviceId,
            offering.serviceEnvironmentID,
            subscription.productTierId,
            subscription.id
          );
          setIsRedirecting(true);
          router.push(route);
        } else {
          setIsRedirecting(true);
          router.push(getServicePlansRoute(serviceOfferingsData));
        }
      }
    };

    subscribeAndRedirect();
  }, [
    isFetchingSubscriptions,
    isFetchingServiceOfferings,
    isFetchingSubscriptionRequests,
    serviceOfferingsData,
    subscriptionRequestsData,
    subscriptions,
    isRedirecting,
  ]);

  return (
    <DashboardLayout accessPage customLogo SidebarUI={""}>
      <Box display="flex" justifyContent="center" mt="50px">
        <LoadingSpinner />
      </Box>
    </DashboardLayout>
  );
};

export default RedirectPage;
