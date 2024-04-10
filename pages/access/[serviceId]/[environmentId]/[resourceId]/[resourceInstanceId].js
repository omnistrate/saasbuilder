import { useRouter } from "next/router";
import DashboardLayout from "src/components/DashboardLayout/DashboardLayout";
import MarketplaceServiceSidebar from "src/components/MarketplaceServiceSidebar/MarketplaceServiceSidebar";
import useServiceOffering from "src/hooks/useServiceOffering";
import ResourceInstanceOverview from "src/components/ResourceInstance/ResourceInstanceOverview/ResourceInstanceOverview";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import { Tabs, Tab } from "src/components/Tab/Tab";
import { useEffect, useMemo, useState } from "react";
import NodesTable from "src/components/ResourceInstance/NodesTable/NodesTable";
import { Stack, Box } from "@mui/material";
import Button from "src/components/Button/Button";
import { RiArrowGoBackFill } from "react-icons/ri";
import Connectivity from "src/components/ResourceInstance/Connectivity/Connectivity";
import useResourceInstance from "src/hooks/useResourceInstance";
import Metrics from "src/components/ResourceInstance/Metrics/Metrics";
import Logs from "src/components/ResourceInstance/Logs/Logs";
import ResourceInstanceDetails from "src/components/ResourceInstance/ResourceInstanceDetails/ResourceInstanceDetails";
import useServiceOfferingResourceSchema from "src/hooks/useServiceOfferingResourceSchema";
import Head from "next/head";
import SideDrawerRight from "src/components/SideDrawerRight/SideDrawerRight";
import { AccessSupport } from "src/components/Access/AccessSupport";
import {
  getAPIDocsRoute,
  getMarketplaceRoute,
  getResourceInstancesDetailswithKeyRoute,
  getResourceInstancesRoute,
} from "src/utils/route/access/accessRoute";
import useSubscriptionForProductTierAccess from "src/hooks/query/useSubscriptionForProductTierAccess";
import SubscriptionNotFoundUI from "src/components/Access/SubscriptionNotFoundUI";
import { checkIfResouceIsBYOA } from "src/utils/access/byoaResource";
import OpenIcon from "src/components/Icons/Open/Open";
import {
  openResourceInstanceInBrowser,
} from "../../../../../src/api/resourceInstance";
import { useMutation } from "@tanstack/react-query";

function ResourceInstance() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("Resource Instance Details");
  const {
    serviceId,
    environmentId,
    view,
    source,
    resourceInstanceId,
    resourceId,
    productTierId,
    subscriptionId,
  } = router.query;
  const { data: serviceOffering, isLoading: isServiceOfferingLoading } =
    useServiceOffering(serviceId, productTierId);
  const [supportDrawerOpen, setSupportDrawerOpen] = useState(false);
  const [currentTabValue, setCurrentTabValue] = useState(false);
  const [currentSource, setCurrentSource] = useState("");

  let resourceName = "";
  let resourceKey = "";

  if (serviceOffering && resourceId) {
    const resource = serviceOffering.resourceParameters.find(
      (resource) => resource.resourceId === resourceId
    );
    if (resource) {
      resourceName = resource.name;
      resourceKey = resource.urlKey;
    }
  }

  const isResourceBYOA = useMemo(() => {
    return checkIfResouceIsBYOA(resourceId);
  }, [resourceId]);

  useEffect(() => {
    if (source) {
      setCurrentSource(source);
    }
  }, [source]);

  const subscriptionQuery = useSubscriptionForProductTierAccess(
    serviceId,
    productTierId,
    subscriptionId
  );
  const { data: subscriptionData = {}, isLoading: isLoadingSubscription } =
    subscriptionQuery;

  const resourceInstanceQuery = useResourceInstance(
    serviceOffering?.serviceProviderId,
    serviceOffering?.serviceURLKey,
    serviceOffering?.serviceAPIVersion,
    serviceOffering?.serviceEnvironmentURLKey,
    serviceOffering?.serviceModelURLKey,
    serviceOffering?.productTierURLKey,
    resourceKey,
    resourceInstanceId,
    resourceId,
    subscriptionData?.id
  );
  const { data: resourceInstanceData } = resourceInstanceQuery;

  const closeSupportDrawer = () => {
    setSupportDrawerOpen(false);
  };

  const isLoading =
    !router.isReady ||
    isServiceOfferingLoading ||
    resourceInstanceQuery.isLoading ||
    resourceInstanceQuery.isIdle;

  const resourceSchemaQuery = useServiceOfferingResourceSchema(
    serviceId,
    resourceId,
    resourceInstanceId
  );
  const resourceInstancesUrl = getResourceInstancesRoute(
    serviceId,
    environmentId,
    productTierId,
    resourceId,
    subscriptionData?.id
  );

  const tabs = getTabs(
    resourceInstanceData?.isMetricsEnabled,
    resourceInstanceData?.isLogsEnabled,
    resourceInstanceData?.active
  );

  let pageTitle = "Resource";

  if (tabs[view]) {
    pageTitle = tabs[view];
  }

  useEffect(() => {
    if (router.isReady) {
      if (view in tabs) {
        setCurrentTab(tabs[view]);
      }
    }
  }, [router.isReady, view, tabs]);

  let isOpenActionEnabled = false;

  if (resourceInstanceData?.active) {
    isOpenActionEnabled = true;
  }

  const openResourceInstanceMutation = useMutation(openResourceInstanceInBrowser, {
    onError: (error) => {
      snackbar.showError("Failed to open resource instance in browser");
    },
  });


  if (isLoading || isLoadingSubscription || !resourceInstanceData) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        isNotShow
        marketplacePage={currentSource === "access" ? false : true}
        accessPage
        currentSubscription={subscriptionData}
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={serviceOffering?.resourceParameters}
            isLoading={isServiceOfferingLoading}
            serviceName={serviceOffering?.serviceName}
            productTierId={productTierId}
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
        currentSubscription={subscriptionData}
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={serviceOffering?.resourceParameters}
            isLoading={isServiceOfferingLoading}
            serviceName={serviceOffering?.serviceName}
            productTierId={productTierId}
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
        <SubscriptionNotFoundUI />
      </DashboardLayout>
    );
  }

  let servicePlanUrlLink = getMarketplaceRoute(
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

  const handleOpenInBrowser = () => {
    if (!isOpenActionEnabled) return;
    const payload = {
      host: resourceInstanceData.connectivity.globalEndpoints.others[0].endpoint,
      port: resourceInstanceData.connectivity.ports.find(p => p.resourceName.startsWith('node'))?.ports?.split(',')[0] ?? '6379',
      region: resourceInstanceData.region,
      username: resourceInstanceData.resultParameters.falkordbUser,
    }
    openResourceInstanceMutation.mutate(payload);
  }

  return (
    <DashboardLayout
      setSupportDrawerOpen={setSupportDrawerOpen}
      setCurrentTabValue={setCurrentTabValue}
      marketplacePage={currentSource === "access" ? false : true}
      accessPage
      currentSubscription={subscriptionData}
      enableConsumptionLinks
      servicePlanUrlLink={servicePlanUrlLink}
      apiDocsurl={serviceAPIDocsLink}
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
          activeResourceId={resourceId}
          productTierId={productTierId}
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
      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <Button
          startIcon={<RiArrowGoBackFill />}
          sx={{ color: "#6941C6" }}
          onClick={() => {
            router.push(resourceInstancesUrl);
          }}
        >
          Back to list of Resource Instances
        </Button>
      </Stack>

      <ResourceInstanceOverview
        resourceInstanceId={resourceInstanceId}
        region={resourceInstanceData?.region}
        cloudProvider={resourceInstanceData?.cloudProvider}
        status={resourceInstanceData?.status}
        createdAt={resourceInstanceData?.createdAt}
        modifiedAt={resourceInstanceData?.modifiedAt}
        networkType={resourceInstanceData?.networkType}
        healthStatusPercent={resourceInstanceData?.healthStatusPercent}
        isResourceBYOA={isResourceBYOA}
      />
      <Box width="100%" display="flex">
        <Tabs value={currentTab} sx={{ marginTop: "28px", width: "100%" }}>
          {Object.entries(tabs).map(([key, value]) => {
            return (
              <Tab
                key={key}
                label={getTabLabel(value, isResourceBYOA)}
                value={value}
                onClick={() => {
                  router.push(
                    getResourceInstancesDetailswithKeyRoute(
                      serviceId,
                      environmentId,
                      productTierId,
                      resourceId,
                      resourceInstanceId,
                      key,
                      subscriptionData?.id
                    )
                  );
                }}
                sx={{ padding: "12px !important" }}
              />
            );
          })}
          <Box width="100%" display="flex" justifyContent="right">
            <Button
              variant="contained"
              size="medium"
              sx={{ ml: 1.5 }}
              startIcon={<OpenIcon color="#FFFFFF" />}
              onClick={handleOpenInBrowser}
              disabled={!isOpenActionEnabled}
            >
              Open in Browser
            </Button>
          </Box>
        </Tabs>
      </Box>
      {currentTab === tabs.resourceInstanceDetails && (
        <ResourceInstanceDetails
          resourceInstanceId={resourceInstanceId}
          createdAt={resourceInstanceData?.createdAt}
          modifiedAt={resourceInstanceData?.modifiedAt}
          resultParameters={resourceInstanceData.resultParameters}
          isLoading={
            resourceSchemaQuery.isLoading || resourceInstanceQuery.isLoading
          }
          resultParametersSchema={
            resourceSchemaQuery?.data?.DESCRIBE?.outputParameters
          }
        />
      )}
      {currentTab === tabs.connectivity && (
        <Connectivity
          networkType={resourceInstanceData.connectivity.networkType}
          clusterEndpoint={resourceInstanceData.connectivity.clusterEndpoint}
          nodeEndpoints={resourceInstanceData.connectivity.nodeEndpoints}
          ports={resourceInstanceData.connectivity.ports}
          availabilityZones={
            resourceInstanceData.connectivity.availabilityZones
          }
          publiclyAccessible={
            resourceInstanceData.connectivity.publiclyAccessible
          }
          privateNetworkCIDR={
            resourceInstanceData.connectivity.privateNetworkCIDR
          }
          privateNetworkId={resourceInstanceData.connectivity.privateNetworkId}
          globalEndpoints={resourceInstanceData.connectivity.globalEndpoints}
          nodes={resourceInstanceData.nodes}
        />
      )}
      {currentTab === tabs.nodes && (
        <NodesTable
          isAccessSide={true}
          resourceName={resourceName}
          nodes={resourceInstanceData.nodes}
          refetchData={resourceInstanceQuery.refetch}
          isRefetching={resourceInstanceQuery.isRefetching}
          serviceOffering={serviceOffering}
          resourceKey={resourceKey}
          resourceInstanceId={resourceInstanceId}
          subscriptionData={subscriptionData}
          subscriptionId={subscriptionData?.id}
        />
      )}
      {currentTab === tabs.metrics && (
        <Metrics
          resourceInstanceId={resourceInstanceId}
          nodes={resourceInstanceData.nodes}
          socketBaseURL={resourceInstanceData.metricsSocketURL}
          instanceStatus={resourceInstanceData?.status}
          resourceKey={resourceInstanceData?.resourceKey}
        />
      )}
      {currentTab === tabs.logs && (
        <Logs
          resourceInstanceId={resourceInstanceId}
          nodes={resourceInstanceData.nodes}
          socketBaseURL={resourceInstanceData.logsSocketURL}
          instanceStatus={resourceInstanceData?.status}
          resourceKey={resourceInstanceData?.resourceKey}
        />
      )}
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

export default ResourceInstance;

function getTabs(isMetricsEnabled, isLogsEnabled, isActive) {
  const tabs = {
    resourceInstanceDetails: "Resource Instance Details",
    connectivity: "Connectivity",
    nodes: "Nodes",
  };
  if (isMetricsEnabled) tabs["metrics"] = "Metrics";
  if (isLogsEnabled) tabs["logs"] = "Logs";

  if (!isActive) {
    delete tabs.connectivity;
    delete tabs.nodes;
  }

  return tabs;
}

const TAB_LABEL_MAP = {
  "Resource Instance Details": "Resource Instance Details",
  Connectivity: "Connectivity",
  Nodes: "Nodes",
  Metrics: "Metrics",
  Logs: "Logs",
};

function getTabLabel(value, isResourceBYOA) {
  if (value === "Resource Instance Details" && isResourceBYOA) {
    return "Account Instance Details";
  }
  return TAB_LABEL_MAP[value];
}
