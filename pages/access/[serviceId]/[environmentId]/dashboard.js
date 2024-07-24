import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../../src/components/DashboardLayout/DashboardLayout";
import { useRouter } from "next/router";
import useServiceOffering from "../../../../src/hooks/useServiceOffering";
import LoadingSpinner from "../../../../src/components/LoadingSpinner/LoadingSpinner";
import Statistics from "../../../../src/components/MarketplaceDashboard/Statistics";
import EventsTable from "../../../../src/components/EventsTable/EventsTable";
import MarketplaceServiceSidebar, {
  sidebarActiveOptions,
} from "../../../../src/components/MarketplaceServiceSidebar/MarketplaceServiceSidebar";
import useServiceOfferingEvents from "../../../../src/hooks/useServiceOfferingEvents";
import { selectEvents } from "../../../../src/slices/eventsSlice";
import { useSelector } from "react-redux";
import useServiceOfferingResourceInstances from "../../../../src/hooks/useServiceOfferingResourceInstances";

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
import useServiceHealth from "src/hooks/query/useServiceHealth";

const pageTitle = "Dashboard";

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

function Dashboard(props) {
  const router = useRouter();
  const { serviceId, environmentId, source, productTierId, subscriptionId } =
    router.query;

  const { data: serviceOffering, isLoading: isServiceOfferingLoading } =
    useServiceOffering(serviceId, productTierId);
  const [supportDrawerOpen, setSupportDrawerOpen] = useState(false);
  const [currentTabValue, setCurrentTabValue] = useState(false);
  const [currentSource, setCurrentSource] = React.useState("");

  const subscriptionQuery = useSubscriptionForProductTierAccess(
    serviceId,
    productTierId,
    subscriptionId
  );
  const { data: subscriptionData = {}, isLoading: isLoadingSubscription } =
    subscriptionQuery;

  const serviceHealthQuery = useServiceHealth();

  const { isLoading: isEventsLoading, isRefetching: isEventsRefetching } =
    useServiceOfferingEvents(
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
  const {
    isLoading: isResourceInstancesLoading,
    resourceInstances,
    numResourceInstances,
    isRefetching: isResourceInstancesRefetching,
    isIdle: isResourceInstancesIdle,
  } = useServiceOfferingResourceInstances(
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

  useEffect(() => {
    if (source) {
      setCurrentSource(source);
    }
  }, [source]);

  const events = useSelector(selectEvents);

  const isLoading =
    isServiceOfferingLoading ||
    isEventsLoading ||
    isResourceInstancesLoading ||
    isResourceInstancesIdle;

  if (isLoading || isLoadingSubscription) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        isNotShow
        marketplacePage={currentSource === "access" ? false : true}
        accessPage
        customLogo
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={serviceOffering?.resourceParameters}
            isLoading={isServiceOfferingLoading}
            serviceName={serviceOffering?.serviceName}
            productTierId={productTierId}
            active={sidebarActiveOptions.dashboard}
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
        isNotShow
        marketplacePage={currentSource === "access" ? false : true}
        accessPage
        customLogo
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={serviceOffering?.resourceParameters}
            isLoading={isServiceOfferingLoading}
            serviceName={serviceOffering?.serviceName}
            productTierId={productTierId}
            active={sidebarActiveOptions.dashboard}
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
      apiDocsurl={serviceAPIDocsLink}
      enableConsumptionLinks
      servicePlanUrlLink={servicePlanUrlLink}
      serviceId={serviceId}
      serviceApiId={serviceOffering?.serviceAPIID}
      isNotShow
      SidebarUI={
        <MarketplaceServiceSidebar
          serviceId={serviceId}
          environmentId={environmentId}
          resourceParameters={serviceOffering?.resourceParameters}
          isLoading={isServiceOfferingLoading}
          serviceName={serviceOffering?.serviceName}
          productTierId={productTierId}
          active={sidebarActiveOptions.dashboard}
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
      <Statistics
        serviceHealthQuery={serviceHealthQuery}
        numResourceInstances={numResourceInstances}
        numResources={serviceOffering?.resourceParameters.length}
      />
      <EventsTable
        title="Top 10 Recent Events"
        events={events.filter((e, i) => i < 10)}
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

export default Dashboard;
