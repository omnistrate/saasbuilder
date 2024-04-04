import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../../src/components/DashboardLayout/DashboardLayout";
import {
  DisplayText,
  Text,
} from "../../../../src/components/Typography/Typography";
import EventsTable from "../../../../src/components/EventsTable/EventsTable";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import MarketplaceServiceSidebar, {
  sidebarActiveOptions,
} from "../../../../src/components/MarketplaceServiceSidebar/MarketplaceServiceSidebar";
import useServiceOfferingEvents from "../../../../src/hooks/useServiceOfferingEvents";
import { selectEvents } from "../../../../src/slices/eventsSlice";
import LoadingSpinner from "../../../../src/components/LoadingSpinner/LoadingSpinner";
import useServiceOffering from "../../../../src/hooks/useServiceOffering";

import Divider from "../../../../src/components/Divider/Divider";
import SideDrawerRight from "../../../../src/components/SideDrawerRight/SideDrawerRight";
import { AccessSupport } from "../../../../src/components/Access/AccessSupport";
import {
  getAPIDocsRoute,
  getMarketplaceRoute,
} from "../../../../src/utils/route/access/accessRoute";
import useSubscriptionForProductTierAccess from "src/hooks/query/useSubscriptionForProductTierAccess";
import SubscriptionNotFoundUI from "src/components/Access/SubscriptionNotFoundUI";
import ServiceOfferingUnavailableUI from "src/components/ServiceOfferingUnavailableUI/ServiceOfferingUnavailableUI";
import Head from "next/head";

const pageTitle = "Events";

function Events() {
  const router = useRouter();
  const { serviceId, environmentId, source, productTierId, subscriptionId } =
    router.query;

  const [supportDrawerOpen, setSupportDrawerOpen] = useState(false);
  const [currentTabValue, setCurrentTabValue] = useState(false);
  const { data: serviceOffering, isLoading: isServiceOfferingLoading } =
    useServiceOffering(serviceId, productTierId);
  const events = useSelector(selectEvents);
  const [currentSource, setCurrentSource] = React.useState("");

  const subscriptionQuery = useSubscriptionForProductTierAccess(
    serviceId,
    productTierId,
    subscriptionId
  );
  const { data: subscriptionData = {}, isLoading: isLoadingSubscription } =
    subscriptionQuery;

  //needs service id, serviceProviderId,service URL key, service API Version, service Environment URL Key, service Model URL key, product tier URL key, resourceParameters
  const eventsQuery = useServiceOfferingEvents(
    serviceId,
    serviceOffering?.serviceProviderId,
    serviceOffering?.serviceURLKey,
    serviceOffering?.serviceAPIVersion,
    serviceOffering?.serviceEnvironmentURLKey,
    serviceOffering?.serviceModelURLKey,
    serviceOffering?.productTierURLKey,
    serviceOffering?.resourceParameters,
    subscriptionData?.id
  );

  const closeSupportDrawer = () => {
    setSupportDrawerOpen(false);
  };

  useEffect(() => {
    if (source) {
      setCurrentSource(source);
    }
  }, [source]);

  const { isLoading: isEventsLoading, isRefetching: isEventsRefetching } =
    eventsQuery;

  const isLoading = isServiceOfferingLoading || isEventsLoading;

  if (isLoading || isLoadingSubscription) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        accessPage
        isNotShow
        marketplacePage={currentSource === "access" ? false : true}
        customLogo
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={serviceOffering?.resourceParameters}
            isLoading={isServiceOfferingLoading}
            productTierId={productTierId}
            serviceName={serviceOffering?.serviceName}
            active={sidebarActiveOptions.events}
            currentSource={currentSource}
            currentSubscription={subscriptionData}
          />
        }
        serviceName={serviceOffering?.serviceName}
        serviceLogoURL={serviceOffering?.serviceLogoURL}
      >
        <Head>
          <title>{pageTitle}</title>
        </Head>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (!isLoadingSubscription && !subscriptionData?.id) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        accessPage
        isNotShow
        marketplacePage={currentSource === "access" ? false : true}
        customLogo
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={serviceOffering?.resourceParameters}
            isLoading={isServiceOfferingLoading}
            productTierId={productTierId}
            serviceName={serviceOffering?.serviceName}
            active={sidebarActiveOptions.events}
            currentSource={currentSource}
            currentSubscription={subscriptionData}
          />
        }
        serviceName={serviceOffering?.serviceName}
        serviceLogoURL={serviceOffering?.serviceLogoURL}
      >
        <Head>
          <title>{pageTitle}</title>
        </Head>
        <SubscriptionNotFoundUI />
      </DashboardLayout>
    );
  }
  const servicePlanUrlLink = getMarketplaceRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSource
  );

  const serviceAPIDocsLink = getAPIDocsRoute(
    serviceId,
    environmentId,
    productTierId,
    subscriptionData?.id
  );

  //handle the case of when someone tries to access the service w/o releasing
  if (
    serviceOffering?.notAvailable ||
    serviceOffering?.serviceModelStatus === "DEPLOYING"
  ) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        isNotShow
        serviceId={serviceId}
        serviceApiId={serviceOffering?.serviceAPIID}
        marketplacePage
        customLogo
        servicePlanUrlLink={servicePlanUrlLink}
        accessPage
        currentSubscription={subscriptionData}
      >
        <Head>
          <title>{pageTitle}</title>
        </Head>
        <ServiceOfferingUnavailableUI />
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout
      setSupportDrawerOpen={setSupportDrawerOpen}
      setCurrentTabValue={setCurrentTabValue}
      marketplacePage={currentSource === "access" ? false : true}
      accessPage
      currentSubscription={subscriptionData}
      isNotShow
      enableConsumptionLinks
      apiDocsurl={serviceAPIDocsLink}
      servicePlanUrlLink={servicePlanUrlLink}
      serviceId={serviceId}
      serviceApiId={serviceOffering?.serviceAPIID}
      SidebarUI={
        <MarketplaceServiceSidebar
          serviceId={serviceId}
          environmentId={environmentId}
          resourceParameters={serviceOffering?.resourceParameters}
          isLoading={isServiceOfferingLoading}
          serviceName={serviceOffering?.serviceName}
          productTierId={productTierId}
          active={sidebarActiveOptions.events}
          currentSource={currentSource}
          currentSubscription={subscriptionData}
        />
      }
      serviceName={serviceOffering?.serviceName}
      customLogo
      serviceLogoURL={serviceOffering?.serviceLogoURL}
    >
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <DisplayText sx={{ marginTop: "20px" }}>Events</DisplayText>
      {/* <Text size="medium" weight="regular" color="#475467" mt="4px">
        Events
      </Text> */}
      <Divider sx={{ mt: 2.5, mb: 4 }} />

      <EventsTable
        title="List of Events"
        events={events}
        isRefetching={isEventsRefetching}
      />
      <SideDrawerRight
        size="xlarge"
        open={supportDrawerOpen}
        closeDrawer={closeSupportDrawer}
        RenderUI={
          <AccessSupport
            service={serviceOffering}
            currentTabValue={currentTabValue}
          />
        }
      />
    </DashboardLayout>
  );
}

export default Events;
