import AddIcon from "@mui/icons-material/Add";
import { Box, CircularProgress, Divider, Stack, styled } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import resourceInstnaceIcon from "../../../public/assets/images/dashboard/logo.svg";
import marketplaceIcon from "../../../public/assets/images/dashboard/marketplace.svg";
import marketplaceReturnIcon from "../../../public/assets/images/dashboard/marketplaceIcon.svg";
import {
  deleteResourceInstance,
  getResourceInstanceDetails,
  getResourceInstanceIds,
  getTerraformKit,
} from "../../../src/api/resourceInstance";
import { describeServiceOfferingResource } from "../../../src/api/serviceOffering";
import {
  createResourceInstance,
  restartResourceInstance,
  startResourceInstance,
  stopResourceInstance,
  updateResourceInstance,
} from "../../../src/api/resourceInstance";
import Button from "../../../src/components/Button/Button";
import CalendarIcon from "../../../src/components/CalendarIcon/CalendarIcon";
import Card from "../../../src/components/Card/Card";
import LoadingSpinnerSmall from "../../../src/components/CircularProgress/CircularProgress";
import DashboardLayout from "../../../src/components/DashboardLayout/DashboardLayout";
import DataGrid, {
  selectSingleItem,
} from "../../../src/components/DataGrid/DataGrid";
import ConfirmationDialog from "../../../src/components/Dialog/ConfirmDialog";
import CreateResourceInstanceForm from "../../../src/components/Forms/CreateResourceInstanceForm";
import GridCellExpand from "../../../src/components/GridCellExpand/GridCellExpand";
import HeaderTitle from "../../../src/components/Headers/Header";
import LogoHeader from "../../../src/components/Headers/LogoHeader";
import DeleteIcon from "../../../src/components/Icons/Delete/Delete";
import DeprecateIcon from "../../../src/components/Icons/DeprecateIcon/DeprecateIcon";
import EditIcon from "../../../src/components/Icons/Edit/Edit";
import PlayIcon from "../../../src/components/Icons/Play/Play";
import RebootIcon from "../../../src/components/Icons/Reboot/Reboot";
import RefreshIcon from "../../../src/components/Icons/Refresh/Refresh";
import RefreshIconDisabled from "../../../src/components/Icons/Refresh/RefreshDisabled";
import StopIcon from "../../../src/components/Icons/Stop/Stop";
import AwsCloudIcon from "../../../public/assets/images/logos/awsCloud.svg";
import GcpCloudIcon from "../../../public/assets/images/logos/gcpCloud.svg";
import AwsLogo from "../../../src/components/Logos/AwsLogo/AwsLogo";
import AzureLogo from "../../../src/components/Logos/AzureLogo/AzureLogo";
import GcpLogo from "../../../src/components/Logos/GcpLogo/GcpLogo";
import ResourceInfoView from "../../../src/components/Marketplace/ResourceInfoView";
import ResourceUpdateView from "../../../src/components/Marketplace/ResourceUpdateView";
import RegionIcon from "../../../src/components/Region/RegionIcon";
import SideDrawerRight from "../../../src/components/SideDrawerRight/SideDrawerRight";
import StatusChip from "../../../src/components/StatusChip/StatusChip";
import { Text } from "../../../src/components/Typography/Typography";
import useCloudProviderRegions from "../../../src/hooks/useCloudProviderRegions";
import useCloudProviders from "../../../src/hooks/useCloudProviders";
import useServiceOffering from "../../../src/hooks/useServiceOffering";
import useSnackbar from "../../../src/hooks/useSnackbar";
import { selectAllRegions } from "../../../src/slices/regionSlice";
import {
  selectResourceInstanceList,
  selectResourceInstanceListLoadingStatus,
  setResourceInstanceList,
  setResourceInstanceListLoadingStatus,
  setResourceInstanceListToEmpty,
} from "../../../src/slices/resourceInstanceListSlice";
import { selectUserrootData } from "../../../src/slices/userDataSlice";
import loadingStatuses from "../../../src/utils/constants/loadingStatuses";
import formatDateUTC from "../../../src/utils/formatDateUTC";
import {
  getEnumFromUserRoleString,
  isOperationAllowedByRBAC,
  operationEnum,
  viewEnum,
} from "../../../src/utils/isAllowedByRBAC";
import MarketplaceServiceSidebar from "../../../src/components/MarketplaceServiceSidebar/MarketplaceServiceSidebar";
import AccessHeaderCard from "src/components/AccessHeader/AccessHeaderCard";
import { AccessSupport } from "src/components/Access/AccessSupport";
import {
  getAPIDocsRoute,
  getMarketplaceRoute,
  getResourceInstancesDetailsRoute,
} from "../../../src/utils/route/access/accessRoute";
import useSubscriptionForProductTierAccess from "src/hooks/query/useSubscriptionForProductTierAccess";
import SubscriptionNotFoundUI from "src/components/Access/SubscriptionNotFoundUI";
import CloudProviderAccountOrgIdModal from "src/components/CloudProviderAccountOrgIdModal/CloudProviderAccountOrgIdModal";
import { getAwsBootstrapArn } from "src/utils/accountConfig/accountConfig";
import GradientProgressBar from "src/components/GradientProgessBar/GradientProgressBar";
import ServiceOfferingUnavailableUI from "src/components/ServiceOfferingUnavailableUI/ServiceOfferingUnavailableUI";
import Head from "next/head";
import CopyButton from "src/components/Button/CopyButton";
import { ACCOUNT_CREATION_METHODS } from "src/utils/constants/accountConfig";
import Tooltip from "src/components/Tooltip/Tooltip";
import ViewInstructionsIcon from "src/components/Icons/AccountConfig/ViewInstrcutionsIcon";
import DeleteAccountConfigConfirmationDialog from "src/components/DeleteAccountConfigConfirmationDialog/DeleteAccountConfigConfirmationDialog";

const instanceStatuses = {
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  PENDING_DEPENDENCY: "PENDING_DEPENDENCY",
  PENDING: "PENDING",
  RUNNING: "RUNNING",
  DEPLOYING: "DEPLOYING",
  READY: "READY",
  SUCCESS: "SUCCESS",
  COMPLETE: "COMPLETE",
  STOPPED: "STOPPED",
  DELETING: "DELETING",
};

function MarketplaceService() {
  const [selectionModel, setSelectionModel] = useState([]);
  const [viewResourceInfo, setViewResourceInfo] = useState({});
  const resourceInstanceList = useSelector(selectResourceInstanceList);
  const [currentSource, setCurrentSource] = React.useState("");
  const [cloudProviderAccounts, setCloudProviderAccounts] = useState([]);
  const [cloudProviderResource, setCloudProviderResource] = useState(null);

  const [isOrgIdModalOpen, setIsOrgIdModalOpen] = useState(false);
  //this is required to show some extra text on CloudProviderAccountModal on creation
  const [isAccountCreation, setIsAccountCreation] = useState(false);

  const [isCloudFormation, setIsCloudFormation] = useState(false); //false implies cloud provider account created using terraform
  const [cloudProvider, setCloudProvider] = useState("");
  const [cloudFormationTemplateUrl, setCloudFormationTemplateUrl] =
    useState("");
  const [accountConfigStatus, setAccountConfigStatus] = useState("");
  const [accountConfigId, setAccountConfigId] = useState("");
  //this is required to show some extra text on CloudProviderAccountModal on creation

  const [isCreateInstanceSchemaFetching, setIsCreateInstanceSchemaFetching] =
    useState(false);

  function handleOrgIdModalOpen() {
    setIsOrgIdModalOpen(true);
  }

  function handleOrgIdModalClose() {
    setIsOrgIdModalOpen(false);
  }

  const selectUser = useSelector(selectUserrootData);

  const resourceInstancesHashmap = useMemo(() => {
    const hashmap = {};
    resourceInstanceList.forEach((instance) => {
      hashmap[instance.id] = instance;
    });
    return hashmap;
  }, [resourceInstanceList]);

  const [selectedResourceInstanceName, setSelectedResourceInstanceName] =
    useState("");
  const [selectedResourceInstances, setSelectedResourceInstances] = useState(
    []
  );

  let isCurrentResourceBYOA = false;
  if (
    selectedResource?.id &&
    selectedResource.id.includes("r-injectedaccountconfig")
  )
    isCurrentResourceBYOA = true;

  const [isConfirmationDialog, setIsConfirmationDialog] = useState(false);
  const [requestParams, setRequestParams] = useState({});
  const [selectedResource, setSelectedResource] = useState({
    key: "",
    id: "",
    name: "",
    isDeprecated: false,
  });
  const regionNames = useSelector(selectAllRegions);
  const isUnmounted = useRef(false);
  const router = useRouter();
  const {
    serviceId,
    source,
    productTierId,
    resourceId,
    support,
    subscriptionId,
  } = router.query;
  const {
    data: service,
    status: servicesLoadingStatus,
    isLoading: isServiceLoading,
  } = useServiceOffering(serviceId, productTierId);

  const environmentId = service?.serviceEnvironmentID;

  useCloudProviders(serviceId, service?.serviceModelID);
  const [creationDrawerOpen, setCreationDrawerOpen] = useState(false);
  const [supportDrawerOpen, setSupportDrawerOpen] = useState(false);
  const [currentTabValue, setCurrentTabValue] = useState(false);
  const [viewInfoDrawerOpen, setViewInfoDrawerOpen] = useState(false);
  const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false);
  useCloudProviderRegions(serviceId, service?.serviceModelID);
  const timeoutID = useRef(null);
  const currentResourceInfo = useRef({ resourceKey: null, resourceId: null });
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
  const {
    data: subscriptionData = {},
    isLoading: isLoadingSubscription,
    isFetched: isSubscriptionDataFetched,
  } = subscriptionQuery;

  const role = getEnumFromUserRoleString(subscriptionData?.roleType);
  const view = viewEnum.Access_Resources;

  const createAccessServiceAllowed = isOperationAllowedByRBAC(
    operationEnum.Create,
    role,
    view
  );
  const modifyAccessServiceAllowed = isOperationAllowedByRBAC(
    operationEnum.Update,
    role,
    view
  );
  const deleteAccessServiceAllowed = isOperationAllowedByRBAC(
    operationEnum.Delete,
    role,
    view
  );

  const columns = useMemo(() => {
    const columnDefinition = [
      {
        field: "id",
        headerName: "ID",
        flex: 0.9,
        minWidth: 200,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const instanceId = params.row.id;
          const isActive = params.row.active;

          const instanceIdDisplay = isCurrentResourceBYOA
            ? "account-" + instanceId
            : instanceId;
          const resourceInstanceUrlLink = getResourceInstancesDetailsRoute(
            serviceId,
            environmentId,
            productTierId,
            selectedResource?.id,
            instanceId,
            subscriptionData?.id
          );

          return (
            <Box display="flex" gap="8px" alignItems="center">
              <GridCellExpand
                href={resourceInstanceUrlLink}
                value={instanceIdDisplay ?? ""}
                width={params.colDef.computedWidth}
              />
              <CopyButton text={instanceIdDisplay} />
            </Box>
          );
        },
      },
      {
        field: "status",
        headerName: "Lifecycle Status",
        flex: 0.9,
        align: "center",
        headerAlign: "center",
        minWidth: 155,
        renderCell: (params) => {
          const status = params.row.status;
          return <StatusChip status={status} />;
        },
      },
      {
        field: "created_at",
        headerName: "Created On",
        flex: 1,
        minWidth: 235,
        align: "center",
        headerAlign: "center",
        valueGetter: (params) => {
          const value = formatDateUTC(params.row.created_at);
          return value;
        },
      },
      {
        field: "last_modified_at",
        headerName: "Last Modified",
        flex: 1,
        minWidth: 225,
        align: "center",
        headerAlign: "center",
        valueGetter: (params) => {
          const value = formatDateUTC(params.row.last_modified_at);
          return value;
        },
      },
      {
        field: "region",
        headerName: "Region",
        flex: 1,
        align: "center",
        headerAlign: "center",
        minWidth: 155,
        renderCell: (params) => {
          const region = params.row.region;
          return !isCurrentResourceBYOA && region ? (
            <GridCellExpand
              value={region}
              startIcon={<RegionIcon />}
              width={params.colDef.computedWidth}
            />
          ) : (
            <GridCellExpand
              value={"Global"}
              startIcon={<RegionIcon />}
              width={params.colDef.computedWidth}
            />
          );
        },
      },
      {
        field: "healthStatus",
        headerName: "Health Status",
        flex: 1,
        minWidth: 200,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const status = params?.row?.status;
          const detailedNetworkTopologyEntries = Object.entries(
            params.row.detailedNetworkTopology ?? {}
          );

          const mainResource = detailedNetworkTopologyEntries?.find(
            ([resourceId, details]) => {
              return details.main === true;
            }
          );

          const nodes = mainResource?.[1]?.nodes;
          let healthStatusPercent = 0;
          if (nodes?.length > 0) {
            const healthyNodes = nodes?.filter(
              (node) => node?.healthStatus === "HEALTHY"
            );
            healthStatusPercent = (healthyNodes?.length / nodes?.length) * 100;
          } else if (status === "RUNNING" || status === "READY") {
            healthStatusPercent = 100;
          }

          return (
            <GradientProgressBar
              percentage={healthStatusPercent}
              marginTop="10px"
            />
          );
        },
      },
    ];

    // If a resource is BYOA, one of the fields: awsAccountId, gcpProjectID are present for all the instances
    // If present, add a column at the 1st index. Otherwise add a column at the 4th index.
    if (
      resourceInstanceList[0]?.awsAccountId ||
      resourceInstanceList[0]?.gcpProjectID
    ) {
      columnDefinition.splice(1, 0, {
        field: "cloud_provider",
        headerName: "Account Config ID",
        flex: 0.8,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          let Logo;
          const provider = params.row.cloud_provider;
          const id = params.row.awsAccountId || params.row.gcpProjectID;
          if (provider === "aws") {
            Logo = AwsCloudIcon;
          } else {
            Logo = GcpCloudIcon;
          }

          return <AccountConfigCell logo={Logo} id={id} />;
        },
      });
    } else {
      columnDefinition.splice(4, 0, {
        field: "cloud_provider",
        headerName: "☁️ Provider(s)",
        flex: 0.8,
        align: "center",
        headerAlign: "center",
        minWidth: 130,
        renderCell: (params) => {
          return !isCurrentResourceBYOA ? (
            params.row.cloud_provider === "aws" ? (
              <AwsLogo />
            ) : params.row.cloud_provider === "azure" ? (
              <AzureLogo />
            ) : params.row.cloud_provider === "gcp" ? (
              <GcpLogo />
            ) : (
              <GridCellExpand
                value={"Everywhere"}
                width={params.colDef.computedWidth}
              />
            )
          ) : (
            <AwsLogo />
          );
        },
      });
    }

    return columnDefinition;
  }, [serviceId, selectedResource]);

  const snackbar = useSnackbar();
  const dispatch = useDispatch();

  const handleConfirmationClose = () => {
    setIsConfirmationDialog(false);
  };

  const loadingStatus = useSelector(selectResourceInstanceListLoadingStatus);
  const isLoading = loadingStatus === loadingStatuses.loading;
  const deleteformik = useFormik({
    initialValues: {
      deleteme: "",
    },
    onSubmit: (values) => {
      if (values.deleteme === "deleteme") {
        deleteResourceInstanceMutation.mutate();
      } else {
        snackbar.showError("Please enter deleteme");
      }
    },
    validateOnChange: false,
  });

  const deleteResourceInstanceMutation = useMutation(
    async () => {
      const instanceDeletePromises = selectedResourceInstances.map(
        (instance) => {
          const requestPayload = {
            serviceProviderId: service.serviceProviderId,
            serviceKey: service.serviceURLKey,
            serviceAPIVersion: service.serviceAPIVersion,
            serviceEnvironmentKey: service.serviceEnvironmentURLKey,
            serviceModelKey: service.serviceModelURLKey,
            productTierKey: service.productTierURLKey,
            resourceKey: selectedResource.key,
            id: instance.id,
            subscriptionId: subscriptionData?.id,
          };

          return deleteResourceInstance(requestPayload);
        }
      );

      return Promise.allSettled(instanceDeletePromises);
    },
    {
      onSuccess: async (response) => {
        setSelectionModel([]);
        fetchResourceInstances(selectedResource);
        //handleClose();
        deleteformik.resetForm();
        setCreationDrawerOpen(false);
        setViewInfoDrawerOpen(false);
        setIsConfirmationDialog(false);
      },
      onError: (error) => {
        deleteformik.resetForm();
      },
    }
  );

  const downloadTerraformKitMutation = useMutation(
    () => {
      if (service && subscriptionData) {
        return getTerraformKit(
          service.serviceProviderId,
          service.serviceURLKey,
          service.serviceAPIVersion,
          service.serviceEnvironmentURLKey,
          service.serviceModelURLKey,
          subscriptionData?.id
        );
      }
    },
    {
      onSuccess: (response) => {
        const href = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "terraformkit.tar");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      },
      onError: (error) => {},
    }
  );

  const openCreationDrawer = () => {
    if (cloudProviderResource) {
      fetchCloudProviderResourceInstances(cloudProviderResource);
    }
    setCreationDrawerOpen(true);
  };

  const openUpdateDrawer = () => {
    if (selectedResourceInstance.id == null) {
      setIsConfirmationDialog(false);
      snackbar.showError("Select a resource to modify");
    } else {
      //setIsConfirmationDialog(true);
      setUpdateDrawerOpen(true);
    }
  };

  const closeUpdateDrawer = () => {
    setUpdateDrawerOpen(false);
  };

  const closeCreationDrawer = () => {
    setCreationDrawerOpen(false);
  };

  const closeSupportDrawer = () => {
    setSupportDrawerOpen(false);
  };

  const openViewInfoDrawer = () => {
    setViewInfoDrawerOpen(true);
  };

  const closeViewInfoDrawer = () => {
    setViewInfoDrawerOpen(false);
  };

  //create resource instance
  const createformik = useFormik({
    initialValues: {
      serviceId: serviceId,
      cloud_provider: "",
      network_type: "",
      region: "",
      requestParams: { ...requestParams },
      serviceProviderId: service?.serviceProviderId,
      serviceKey: service?.serviceURLKey,
      serviceAPIVersion: service?.serviceAPIVersion,
      serviceEnvironmentKey: service?.serviceEnvironmentURLKey,
      serviceModelKey: service?.serviceModelURLKey,
      productTierKey: service?.productTierURLKey,
      resourceKey: selectedResource.key,
      subscriptionId: subscriptionData?.id,
      //createSchema: {}
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const data = {};
      for (let key in values) {
        if (values[key]) {
          if (values[key] === "requestParams") {
            data["requestParams"] = { ...values["requestParams"] };
          } else {
            data[key] = values[key];
          }
        }
      }
      async function getSchema() {
        try {
          let schemaArray = [];
          let schema = await describeServiceOfferingResource(
            serviceId,
            selectedResource.id,
            "none"
          );
          schema.data.apis.forEach((api) => {
            if (api.verb === "CREATE") {
              schemaArray = api.inputParameters;
            }
          });
          schemaArray
            .filter(
              (field) => field.type === "Boolean" && field.custom === true
            )
            .forEach((field) => {
              if (!data.requestParams[field.key]) {
                data.requestParams[field.key] = "false";
              }
            });

          Object.keys(data.requestParams).forEach((key) => {
            const result = schemaArray.find((schemaParam) => {
              return schemaParam.key === key;
            });

            switch (result.type) {
              case "Number":
                {
                  data.requestParams[key] = Number(data.requestParams[key]);
                }
                break;
              case "Float64":
                {
                  var output = Number(data.requestParams[key]);
                  {
                    if (!Number.isNaN(output)) {
                      data.requestParams[key] = Number(data.requestParams[key]);
                    } else {
                      snackbar.showError(`Invalid data in ${key}`);
                    }
                  }
                }
                break;
              case "Boolean":
                {
                  if (data.requestParams[key] === "true")
                    data.requestParams[key] = true;
                  else data.requestParams[key] = false;
                }
                break;
            }
          });

          //remove empty fields from data.requestParams
          //remove the field from payload if it has an empty value ("", )
          for (let key in data.requestParams) {
            let value = data.requestParams[key];
            // if (typeof value === "string" && !value.trim()) {
            //   delete data.requestParams[key];
            // }
            if (value === undefined) {
              delete data.requestParams[key];
            }
          }
          //Check if any of the required parameters is not present in payload
          //cloud_provider, network_type and region if required should be present as direct property of data object
          //other required parameters should be present in data.requestParameters
          let isError = false;
          let requiredFieldName = "";
          for (let param of schemaArray) {
            if (param.required) {
              if (
                ["cloud_provider", "network_type", "region"].includes(param.key)
              ) {
                if (data[param.key] === undefined) {
                  isError = true;
                  requiredFieldName = param.displayName;
                  break;
                }
              } else {
                if (param.custom) {
                  if (data.requestParams[param.key] === undefined) {
                    isError = true;
                    requiredFieldName = param.displayName;
                    break;
                  }
                }
              }
            }
          }
          if (isError) {
            snackbar.showError(`${requiredFieldName} is required`);
          } else {
            createResourceInstanceMutation.mutate(data);
          }
        } catch (err) {
          console.error("error", err);
        } finally {
          setIsCreateInstanceSchemaFetching(false);
        }
      }
      setIsCreateInstanceSchemaFetching(true);
      getSchema();
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  const createResourceInstanceMutation = useMutation(
    (payload) => {
      if (isCurrentResourceBYOA) {
        const aws_account_id = payload?.requestParams?.aws_account_id;
        if (aws_account_id) {
          payload.requestParams.aws_bootstrap_role_arn =
            getAwsBootstrapArn(aws_account_id);
        }
      }
      return createResourceInstance(payload);
    },
    {
      onSuccess: async (response) => {
        //resourceInstanceQuery.refetch();
        if (selectedResource?.id.includes("r-injectedaccountconfig")) {
          snackbar.showSuccess("Cloud Provider Account Created");
          handleOrgIdModalOpen();
          setIsAccountCreation(true);
        } else {
          snackbar.showSuccess("Created Instance");
        }

        fetchResourceInstances(selectedResource);
        createformik.resetForm();
        setCreationDrawerOpen(false);
      },
      onError: (error) => {},
    }
  );

  useEffect(() => {
    if (!isOrgIdModalOpen) {
      setIsAccountCreation(false);
    }
  }, [isOrgIdModalOpen]);

  const updateResourceInstanceMutation = useMutation(updateResourceInstance, {
    onSuccess: async (response) => {
      setSelectionModel([]);
      setUpdateDrawerOpen(false);
      fetchResourceInstances(selectedResource);
      updateformik.resetForm();
      snackbar.showSuccess("Updated Resource Instance");
    },
    onError: (error) => {},
  });

  //-----------------------modify ends-------------------------------------

  const startResourceInstanceMutation = useMutation(startResourceInstance, {
    onSuccess: async (response) => {
      setSelectionModel([]);

      fetchResourceInstances(selectedResource);
      snackbar.showSuccess("Starting Resource Instance");
    },
    onError: (error) => {},
  });

  const stopResourceInstanceMutation = useMutation(stopResourceInstance, {
    onSuccess: async (response) => {
      setSelectionModel([]);

      fetchResourceInstances(selectedResource);
      snackbar.showSuccess("Stopping Resource Instance");
    },
    onError: (error) => {},
  });

  const restartResourceInstanceMutation = useMutation(restartResourceInstance, {
    onSuccess: async (response) => {
      setSelectionModel([]);
      fetchResourceInstances(selectedResource);
      snackbar.showSuccess("Rebooting Resource Instance");
    },
    onError: (error) => {},
  });

  const handleRefresh = () => {
    fetchResourceInstances(selectedResource);
  };

  const handleStart = () => {
    if (isStartActionEnabled) {
      startResourceInstanceMutation.mutate(updateformik.values);
    }
  };

  const handleStop = () => {
    if (isStopActionEnabled) {
      stopResourceInstanceMutation.mutate(updateformik.values);
    }
  };

  const handleReboot = () => {
    if (isRebootActiondEnabled) {
      restartResourceInstanceMutation.mutate(updateformik.values);
    }
  };

  const AccountConfigCell = ({ id, logo: Logo }) => {
    return (
      <Box display="flex" alignItems="center" gap="12px">
        <Box
          sx={{
            borderRadius: "4px",
            boxShadow: "0px 1px 2px 0px #1018280D",
            width: "22px",
            height: "22px",
            border: "1px solid #EAECF0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image src={Logo} alt="cloud-icon" />
        </Box>
        {id}
      </Box>
    );
  };

  useEffect(() => {
    if (
      servicesLoadingStatus === loadingStatuses.success &&
      isSubscriptionDataFetched
    ) {
      if (service?.resourceParameters?.length > 0) {
        let cloudProviderRes = service.resourceParameters.filter(
          // this is a temporary fix to unblock production for customer
          // but backend should ensure that id should always be exactly r-injectedaccountconfig
          (param) => param.resourceId.startsWith("r-injectedaccountconfig")
        );

        if (cloudProviderRes?.length > 0) {
          let cloudProviderResourceInfo = {
            key: cloudProviderRes[0].urlKey,
            id: cloudProviderRes[0].resourceId,
            name: cloudProviderRes[0].name,
            isDeprecated: cloudProviderRes[0].isDeprecated,
          };
          setCloudProviderResource(cloudProviderResourceInfo);
        }

        let selectedResourceInfo = {};

        if (resourceId) {
          const selectedResource = service?.resourceParameters.find(
            function (resourceParameter) {
              return resourceParameter.resourceId === resourceId;
            }
          );
          selectedResourceInfo = {
            key: selectedResource.urlKey,
            id: selectedResource.resourceId,
            name: selectedResource.name,
            isDeprecated: selectedResource.isDeprecated,
          };
        } else {
          selectedResourceInfo = {
            key: service?.resourceParameters[0].urlKey,
            id: service?.resourceParameters[0].resourceId,
            name: service?.resourceParameters[0].name,
            isDeprecated: service?.resourceParameters[0].isDeprecated,
          };
        }

        setSelectedResource(selectedResourceInfo);
        //Select First resource key by default when page loads
        currentResourceInfo.current.resourceId = selectedResourceInfo.id;
        currentResourceInfo.current.resourceKey = selectedResourceInfo.key;
        fetchResourceInstances(selectedResourceInfo);
        setCreationDrawerOpen(false);
        setViewInfoDrawerOpen(false);
      }
    }
  }, [servicesLoadingStatus, resourceId, isSubscriptionDataFetched]);

  async function fetchCloudProviderResourceInstances(
    cloudProviderResourceInfo
  ) {
    const resourceInstanceIdsResponse = await getResourceInstanceIds(
      service.serviceProviderId,
      service.serviceURLKey,
      service.serviceAPIVersion,
      service.serviceEnvironmentURLKey,
      service.serviceModelURLKey,
      service.productTierURLKey,
      cloudProviderResourceInfo.key,
      subscriptionData?.id
    );

    const cloudProviderResourceInstanceIds =
      resourceInstanceIdsResponse.data.ids;
    let cloudProviderResInstances = [];

    await Promise.all(
      cloudProviderResourceInstanceIds.map(async (instanceId) => {
        const cloudProviderResourceInstanceResponse =
          await getResourceInstanceDetails(
            service.serviceProviderId,
            service.serviceURLKey,
            service.serviceAPIVersion,
            service.serviceEnvironmentURLKey,
            service.serviceModelURLKey,
            service.productTierURLKey,
            cloudProviderResourceInfo.key,
            instanceId,
            subscriptionData?.id
          );
        const cloudProviderResourceInstance =
          cloudProviderResourceInstanceResponse.data;

        //aws
        if (cloudProviderResourceInstance?.result_params?.aws_account_id) {
          const cloudProviderAccount = {
            id: instanceId,
            type: "aws",
          };
          cloudProviderResInstances.push(cloudProviderAccount);
        }
        //gcp
        if (cloudProviderResourceInstance?.result_params?.gcp_account_id) {
          const cloudProviderAccount = {
            id: instanceId,
            type: "gcp",
          };
          cloudProviderResInstances.push(cloudProviderAccount);
        }
        //later azure
      })
    );
    setCloudProviderAccounts(cloudProviderResInstances);
  }

  async function fetchResourceInstances(resourceInfo, isRefetching = false) {
    clearExistingTimeout();

    try {
      const status = isRefetching
        ? loadingStatuses.refetching
        : loadingStatuses.loading;

      dispatch(setResourceInstanceListLoadingStatus(status));

      const resourceInstanceList = [];
      const resourceInstances = {};
      const resourceInstanceIdsResponse = await getResourceInstanceIds(
        service.serviceProviderId,
        service.serviceURLKey,
        service.serviceAPIVersion,
        service.serviceEnvironmentURLKey,
        service.serviceModelURLKey,
        service.productTierURLKey,
        resourceInfo.key,
        subscriptionData?.id
      );
      const resourceInstanceIds = resourceInstanceIdsResponse.data.ids;
      await Promise.all(
        resourceInstanceIds.map(async (resourceInstanceId) => {
          const resourceInstanceResponse = await getResourceInstanceDetails(
            service.serviceProviderId,
            service.serviceURLKey,
            service.serviceAPIVersion,
            service.serviceEnvironmentURLKey,
            service.serviceModelURLKey,
            service.productTierURLKey,
            resourceInfo.key,
            resourceInstanceId,
            subscriptionData?.id
          );
          const resourceInstance = resourceInstanceResponse.data;

          const resourceInstanceSchema = await getResourceSchema(
            resourceInfo.id
          );

          resourceInstance["schema"] = resourceInstanceSchema.data;
          resourceInstanceList.push();
          resourceInstances[resourceInstance.id] = resourceInstance;
        })
      );

      resourceInstanceIds.forEach((id) => {
        resourceInstanceList.push(resourceInstances[id]);
      });

      //Check resource id and key before setting data to deal with race conditions
      if (
        resourceInfo.id === currentResourceInfo.current.resourceId &&
        resourceInfo.key === currentResourceInfo.current.resourceKey &&
        isUnmounted.current === false
      ) {
        dispatch(setResourceInstanceList(resourceInstanceList));
        dispatch(setResourceInstanceListLoadingStatus(loadingStatuses.success));
        const id = setTimeout(() => {
          fetchResourceInstances(resourceInfo, true);
        }, 60000);
        timeoutID.current = id;
      }
    } catch (err) {
      dispatch(setResourceInstanceListLoadingStatus(loadingStatuses.error));
      console.error("error", err);
      if (
        resourceInfo.id === currentResourceInfo.current.resourceId &&
        resourceInfo.key === currentResourceInfo.current.resourceKey &&
        isUnmounted.current === false
      ) {
        const id = setTimeout(() => {
          fetchResourceInstances(resourceInfo, true);
        }, 60000);
        timeoutID.current = id;
      }
    }
  }

  async function getResourceSchema(resourceId) {
    const resourceInstanceSchema = await describeServiceOfferingResource(
      serviceId,
      resourceId,
      "none"
    );
    return resourceInstanceSchema;
  }

  useEffect(() => {
    dispatch(setResourceInstanceListToEmpty());
  }, [dispatch]);

  function clearExistingTimeout() {
    if (timeoutID.current) {
      clearTimeout(timeoutID.current);
    }
  }

  useEffect(() => {
    return () => {
      isUnmounted.current = true;
      clearExistingTimeout();
    };
  }, []);

  useEffect(() => {
    const selectedInstances = [];
    selectionModel.forEach((instanceId) => {
      const instance = resourceInstancesHashmap[instanceId];
      selectedInstances.push(instance);
    });
    setSelectedResourceInstances(selectedInstances);
  }, [selectionModel]);

  const openClickDelete = () => {
    setIsConfirmationDialog(true);
  };

  const isSingleInstanceSelected = selectedResourceInstances.length === 1;

  let isStartActionEnabled = false;
  let isStopActionEnabled = false;
  let isRebootActiondEnabled = false;
  let isModifyActionEnabled = false;
  let isDeleteActionEnabled = false;

  let selectedResourceInstance = null;
  if (isSingleInstanceSelected) {
    selectedResourceInstance = selectedResourceInstances[0];
    if (selectedResourceInstance) {
      const instanceStatus = selectedResourceInstance.status;

      //enable start action depending on selected Service Component status
      if (instanceStatus === instanceStatuses.STOPPED) {
        isStartActionEnabled = true;
      }
      //enable stop action
      if (instanceStatus === instanceStatuses.RUNNING) {
        isStopActionEnabled = true;
      }

      //enable modify action
      if (
        [
          instanceStatuses.FAILED,
          instanceStatuses.RUNNING,
          instanceStatuses.READY,
          instanceStatuses.STOPPED,
        ].includes(instanceStatus)
      ) {
        isModifyActionEnabled = true;
      }

      //enable reboot action
      if (instanceStatus === instanceStatuses.RUNNING) {
        isRebootActiondEnabled = true;
      }

      if (instanceStatus !== instanceStatuses.DELETING) {
        isDeleteActionEnabled = true;
      }
    }
  }

  // if (selectedResourceInstances.length > 0) {
  //   const isNoInstanceWithStatusDeleting = selectedResourceInstances.every(
  //     (resourceInstance) =>
  //       resourceInstance.status !== instanceStatuses.DELETING
  //   );

  //   if (isNoInstanceWithStatusDeleting) {
  //     isDeleteActionEnabled = true;
  //   }
  // }

  //--------------------modify Service Component instance---------------------------
  const updateformik = useFormik({
    initialValues: {
      serviceId: serviceId,
      id: selectedResourceInstance?.id,
      cloud_provider: selectedResourceInstance?.cloud_provider,
      network_type: selectedResourceInstance?.network_type,
      region: selectedResourceInstance?.region,
      serviceProviderId: service?.serviceProviderId,
      serviceKey: service?.serviceURLKey,
      serviceAPIVersion: service?.serviceAPIVersion,
      serviceEnvironmentKey: service?.serviceEnvironmentURLKey,
      serviceModelKey: service?.serviceModelURLKey,
      productTierKey: service?.productTierURLKey,
      resourceKey: selectedResource.key,
      requestParams: selectedResourceInstance?.result_params,
      subscriptionId: subscriptionData?.id,
    },
    onSubmit: (values) => {
      const data = { ...values };
      async function getSchema() {
        try {
          let schemaArray = [];
          let schema = await describeServiceOfferingResource(
            serviceId,
            selectedResource.id,
            values.id
          );

          schema.data.apis.forEach((api) => {
            if (api.verb === "UPDATE") {
              schemaArray = api.inputParameters;
            }
          });

          schemaArray
            .filter(
              (field) => field.type === "Boolean" && field.custom === true
            )
            .forEach((field) => {
              if (!data.requestParams[field.key]) {
                data.requestParams[field.key] = "false";
              }
            });

          Object.keys(data.requestParams).forEach((key) => {
            const result = schemaArray.find((schemaParam) => {
              return schemaParam.key === key;
            });

            switch (result?.type) {
              case "Number":
                {
                  data.requestParams[key] = Number(data.requestParams[key]);
                }
                break;
              case "Float64":
                {
                  var output = Number(data.requestParams[key]);
                  {
                    if (!Number.isNaN(output)) {
                      data.requestParams[key] = Number(data.requestParams[key]);
                    } else {
                      snackbar.showError(`Invalid data in ${key}`);
                    }
                  }
                }
                break;
              case "Boolean":
                {
                  if (data.requestParams[key] === "true")
                    data.requestParams[key] = true;
                  else data.requestParams[key] = false;
                }
                break;
            }
          });

          updateResourceInstanceMutation.mutate(data);
        } catch (err) {
          //console.error("error", err);
        }
      }
      getSchema();
    },
    validateOnChange: false,
    enableReinitialize: true,
  });

  if (isServiceLoading || isLoadingSubscription) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        isNotShow
        accessPage
        marketplacePage={currentSource === "access" ? false : true}
        SidebarUI={<div></div>}
        customLogo
        currentSubscription={subscriptionData}
      >
        <Head>
          <title>Resources</title>
        </Head>
        <Box
          display="flex"
          justifyContent="center"
          mt="200px"
          marginBottom="100px"
        >
          <div style={{ marginTop: "50px" }}>
            <CircularProgress style={{ marginLeft: "50px" }} /> <br />
          </div>
        </Box>
      </DashboardLayout>
    );
  }

  const modelType = service?.serviceModelType;
  let deploymentHeader = "";
  if (modelType === "CUSTOMER_HOSTED") {
    deploymentHeader = "Provider Account";
  } else if (modelType === "OMNISTRATE_HOSTED") {
    deploymentHeader = "Omnistrate Account";
  } else if (modelType === "BYOA") {
    deploymentHeader = "Bring Your Own Account (BYOA)";
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
  if (service?.notAvailable || service?.serviceModelStatus === "DEPLOYING") {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        isNotShow
        serviceId={serviceId}
        serviceApiId={service?.serviceAPIID}
        marketplacePage
        customLogo
        servicePlanUrlLink={servicePlanUrlLink}
        accessPage
        currentSubscription={subscriptionData}
      >
        <Head>
          <title>Resources</title>
        </Head>
        <ServiceOfferingUnavailableUI />
      </DashboardLayout>
    );
  }

  if (
    service &&
    service.resourceParameters &&
    service.resourceParameters.length === 0
  ) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        currentSubscription={subscriptionData}
        isNotShow
        serviceId={serviceId}
        serviceApiId={service?.serviceAPIID}
        marketplacePage={currentSource === "access" ? false : true}
        accessPage
        enableConsumptionLinks
        serviceName={service?.serviceName}
        customLogo
        servicePlanUrlLink={servicePlanUrlLink}
        apiDocsurl={serviceAPIDocsLink}
        serviceLogoURL={service?.serviceLogoURL}
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={service?.resourceParameters}
            isLoading={isServiceLoading}
            serviceName={service?.serviceName}
            activeResourceId={resourceId}
            productTierId={productTierId}
            currentSource={currentSource}
            selectedResource={selectedResource.key}
            currentSubscription={subscriptionData}
          />
        }
      >
        <Head>
          <title>Resources</title>
        </Head>
        <Card mt={3} style={{ height: "700px", width: "100%" }}>
          <Box>
            <Image
              style={{ height: "500px", width: "100%", marginTop: "50px" }}
              src={marketplaceIcon}
              alt="image-icon"
            />
            <Box mt="-300px">
              <div
                justifyContent="center"
                align="center"
                style={{
                  marginTop: "50px",
                  fontWeight: "bold",
                  fontSize: "30px",
                }}
              >
                No Resources
              </div>
              <div
                justifyContent="center"
                align="center"
                style={{
                  marginTop: "5px",
                  fontWeight: "bold",
                  fontSize: "30px",
                }}
              >
                available for
              </div>
              <div
                justifyContent="center"
                align="center"
                style={{
                  marginTop: "5px",
                  fontWeight: "bold",
                  fontSize: "30px",
                }}
              >
                {service?.serviceName} Service
              </div>
              <div
                justifyContent="center"
                align="center"
                style={{
                  marginTop: "100px",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                <Link
                  href={servicePlanUrlLink}
                  style={{ color: "#1E22FB", marginRight: "5px" }}
                >
                  {" "}
                  <Image src={marketplaceReturnIcon} alt="image-icon" /> Click
                  Here
                </Link>
                to go back
              </div>
            </Box>
          </Box>
        </Card>
        <SideDrawerRight
          size="xlarge"
          open={supportDrawerOpen}
          closeDrawer={closeSupportDrawer}
          RenderUI={
            <AccessSupport
              service={service}
              currentTabValue={currentTabValue}
            />
          }
        />
      </DashboardLayout>
    );
  }

  function getTheHostingModel(hostingModel) {
    switch (hostingModel) {
      case "OMNISTRATE_HOSTED":
      case "Omnistrate hosted model":
        return "Omnistrate Hosted";

      case "CUSTOMER_HOSTED":
      case "MyAccount hosted model":
        return "Provider Hosted";

      case "BYOA":
      case "BYOA hosted model":
        return "Customer Hosted (BYOA)";
    }
  }

  if (!isLoadingSubscription && !subscriptionData?.id) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        isNotShow
        serviceId={serviceId}
        serviceApiId={service?.serviceAPIID}
        marketplacePage
        customLogo
        accessPage
        currentSubscription={subscriptionData}
      >
        <>
          <Head>
            <title>Resources</title>
          </Head>
          <SubscriptionNotFoundUI />
        </>
      </DashboardLayout>
    );
  }

  if (service) {
    const modelType = service?.serviceModelType;
    let deploymentHeader = getTheHostingModel(modelType);

    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        currentSubscription={subscriptionData}
        isNotShow
        serviceId={serviceId}
        serviceApiId={service?.serviceAPIID}
        marketplacePage={currentSource === "access" ? false : true}
        accessPage
        enableConsumptionLinks
        serviceName={service?.serviceName}
        customLogo
        servicePlanUrlLink={servicePlanUrlLink}
        apiDocsurl={serviceAPIDocsLink}
        serviceLogoURL={service?.serviceLogoURL}
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={service?.resourceParameters}
            isLoading={isServiceLoading}
            serviceName={service?.serviceName}
            activeResourceId={resourceId}
            productTierId={productTierId}
            currentSource={currentSource}
            selectedResource={selectedResource.key}
            currentSubscription={subscriptionData}
          />
        }
      >
        <Head>
          <title>Resources</title>
        </Head>
        <LogoHeader
          title={`${selectedResource?.name} Instances`}
          desc="Some Description"
          newicon={resourceInstnaceIcon}
        />

        <AccessHeaderCard
          serviceName={service?.serviceName}
          deploymentHeader={deploymentHeader}
          productTierType={service?.productTierType}
          environmentName={service?.serviceEnvironmentName}
          productTierName={service?.productTierName}
          currentSubscription={subscriptionData}
          cloudProviders={service?.cloudProviders}
        />

        <Card mt={3}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Stack direction="row" alignItems="center" gap="20px">
              <HeaderTitle
                title={`List of ${selectedResource?.name} Resources`}
                desc={`Details of selected ${selectedResource?.name} resource instances`}
              />

              {loadingStatus === loadingStatuses.refetching && (
                <LoadingSpinnerSmall size={20} sx={{ color: "#7F56D9" }} />
              )}
            </Stack>
            <Box>
              <Box>
                <Box display="flex" justifyContent="right">
                  <Button
                    variant="contained"
                    sx={{ ml: 1.5 }}
                    disabled={
                      !service.resourceParameters ||
                      selectedResource.isDeprecated ||
                      !createAccessServiceAllowed
                    }
                    onClick={openCreationDrawer}
                    startIcon={<AddIcon />}
                  >
                    Create {selectedResource.name} Instance
                  </Button>
                </Box>
                <Box>
                  {selectedResource.isDeprecated && (
                    <Box display="flex" sx={{ marginTop: "15px" }}>
                      <Box>
                        <DeprecateIcon />
                      </Box>
                      <Text
                        size="small"
                        weight="semibold"
                        sx={{
                          marginLeft: "10px",
                          marginTop: "3px",
                          color: "#B42318",
                        }}
                      >
                        {"Resource deprecated, instance creation not allowed"}{" "}
                      </Text>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ marginBottom: 1.5 }} />

          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            marginBottom={1.5}
          >
            {isCurrentResourceBYOA && (
              <Button
                variant="outlined"
                onClick={handleOrgIdModalOpen}
                sx={{ marginRight: 2 }}
                // disabled={resourceInstanceList.length == 0}
              >
                Account Configuration Instructions
              </Button>
            )}

            <Button
              variant="outlined"
              disabled={resourceInstanceList.length == 0}
              startIcon={
                resourceInstanceList.length == 0 ? (
                  <RefreshIconDisabled />
                ) : (
                  <RefreshIcon />
                )
              }
              sx={{ marginRight: 2 }}
              onClick={handleRefresh}
            >
              Refresh
            </Button>

            {!isCurrentResourceBYOA && (
              <Button
                variant="outlined"
                startIcon={
                  <RebootIcon
                    color={
                      (!isRebootActiondEnabled ||
                        !modifyAccessServiceAllowed) &&
                      "#EAECF0"
                    }
                  />
                }
                sx={{ marginRight: 2 }}
                disabled={
                  !isRebootActiondEnabled || !modifyAccessServiceAllowed
                }
                onClick={handleReboot}
              >
                Reboot
              </Button>
            )}
            {!isCurrentResourceBYOA && (
              <Button
                variant="outlined"
                startIcon={
                  <PlayIcon
                    color={
                      (!isStartActionEnabled || !modifyAccessServiceAllowed) &&
                      "#EAECF0"
                    }
                  />
                }
                sx={{ marginRight: 2 }}
                disabled={!isStartActionEnabled || !modifyAccessServiceAllowed}
                onClick={handleStart}
              >
                Start
              </Button>
            )}
            {!isCurrentResourceBYOA && (
              <Button
                variant="outlined"
                startIcon={
                  <StopIcon
                    color={
                      (!isStopActionEnabled || !modifyAccessServiceAllowed) &&
                      "#EAECF0"
                    }
                  />
                }
                sx={{ marginRight: 2 }}
                disabled={!isStopActionEnabled || !modifyAccessServiceAllowed}
                onClick={handleStop}
              >
                Stop
              </Button>
            )}

            <Button
              variant="outlined"
              startIcon={
                <EditIcon
                  color={
                    (!isModifyActionEnabled || !modifyAccessServiceAllowed) &&
                    "#EAECF0"
                  }
                />
              }
              sx={{ marginRight: 2 }}
              disabled={!isModifyActionEnabled || !modifyAccessServiceAllowed}
              onClick={openUpdateDrawer}
            >
              Modify
            </Button>

            <Button
              variant="outlined"
              startIcon={
                <DeleteIcon
                  color={
                    (!isDeleteActionEnabled || !deleteAccessServiceAllowed) &&
                    "#EAECF0"
                  }
                />
              }
              disabled={!isDeleteActionEnabled || !deleteAccessServiceAllowed}
              onClick={() => {
                openClickDelete();
              }}
            >
              Delete
            </Button>
          </Box>

          <Divider sx={{ mb: 5 }} />

          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              mt="200px"
              marginBottom="300px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ height: 640 }}>
                <DataGrid
                  hideFooterSelectedRowCount
                  disableColumnMenu
                  rowHeight={76}
                  columns={columns}
                  rows={resourceInstanceList}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  checkboxSelection
                  selectionModel={selectionModel}
                  disableSelectionOnClick
                  sx={{
                    "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
                      {
                        display: "none",
                      },
                  }}
                  onCellClick={(props) => {
                    const { field } = props;
                    if (field === "view") {
                      setViewResourceInfo(props.row);
                      openViewInfoDrawer();
                    }
                  }}
                  components={{
                    NoRowsOverlay: () => (
                      <Stack
                        height="100%"
                        alignItems="center"
                        justifyContent="center"
                      >
                        No Instance of {selectedResource.name} found for{" "}
                        {service?.serviceName}
                      </Stack>
                    ),
                  }}
                  onSelectionModelChange={(newSelection) => {
                    selectSingleItem(
                      newSelection,
                      selectionModel,
                      setSelectionModel
                    );
                  }}
                />
              </Box>
              <SideDrawerRight
                open={viewInfoDrawerOpen}
                closeDrawer={closeViewInfoDrawer}
                RenderUI={
                  <ResourceInfoView
                    isBYOA={isCurrentResourceBYOA}
                    data={viewResourceInfo}
                    serviceName={service?.serviceName}
                  />
                }
              />
              <SideDrawerRight
                open={updateDrawerOpen}
                closeDrawer={closeUpdateDrawer}
                RenderUI={
                  <ResourceUpdateView
                    isCurrentResourceBYOA={isCurrentResourceBYOA}
                    formData={updateformik}
                    regions={regionNames}
                    formCancelClick={closeUpdateDrawer}
                    isLoading={updateResourceInstanceMutation.isLoading}
                    serviceName={service?.serviceName}
                    serviceId={serviceId}
                    selectedResourceKey={selectedResource}
                  />
                }
              />
              {isCurrentResourceBYOA ? (
                <DeleteAccountConfigConfirmationDialog
                  open={isConfirmationDialog}
                  handleClose={handleConfirmationClose}
                  formData={deleteformik}
                  title="Delete Confirmation"
                  isLoading={deleteResourceInstanceMutation.isLoading}
                />
              ) : (
                <ConfirmationDialog
                  open={isConfirmationDialog}
                  handleClose={handleConfirmationClose}
                  formData={deleteformik}
                  title={`Do you want to delete this ${selectedResource.name} instance?`}
                  subtitle={`Are you sure you want to delete - ${selectedResourceInstances[0]?.id}?`}
                  message={`To confirm deletion, please enter <b>deleteme</b>, in the field below:`}
                  buttonLabel="Confirm"
                  isLoading={deleteResourceInstanceMutation.isLoading}
                  isDeleteEnable={true}
                />
              )}
            </>
          )}
        </Card>
        <SideDrawerRight
          open={creationDrawerOpen}
          closeDrawer={closeCreationDrawer}
          RenderUI={
            <CreateResourceInstanceForm
              downloadTerraformKitMutation={downloadTerraformKitMutation}
              isBYOA={isCurrentResourceBYOA}
              requestParams={requestParams}
              formCancelClick={closeCreationDrawer}
              formData={createformik}
              serviceName={service?.serviceName}
              serviceId={serviceId}
              selectedResourceKey={selectedResource}
              regions={regionNames}
              isLoading={
                createResourceInstanceMutation.isLoading ||
                isCreateInstanceSchemaFetching
              }
              setRequestParams={setRequestParams}
              cloudProviderAccounts={cloudProviderAccounts}
              service={service}
              subscriptionId={subscriptionData?.id}
              handleOrgIdModalOpen={handleOrgIdModalOpen}
            />
          }
        />
        <SideDrawerRight
          size="xlarge"
          open={supportDrawerOpen}
          closeDrawer={closeSupportDrawer}
          RenderUI={
            <AccessSupport
              service={service}
              currentTabValue={currentTabValue}
            />
          }
        />
        <CloudProviderAccountOrgIdModal
          orgId={subscriptionData?.accountConfigIdentityId}
          handleClose={handleOrgIdModalClose}
          open={isOrgIdModalOpen}
          isAccountCreation={isAccountCreation}
          isAccessPage={true}
          downloadTerraformKitMutation={downloadTerraformKitMutation}
        />
      </DashboardLayout>
    );
  }
}

export default MarketplaceService;
