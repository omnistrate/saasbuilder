import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { Box, CircularProgress, IconButton, Stack } from "@mui/material";
import DashboardLayout from "components/DashboardLayout/DashboardLayout";
import DataGrid from "components/DataGrid/DataGrid";
import { Text } from "components/Typography/Typography";
import Menu from "components/Menu/Menu";
import MenuItem from "components/MenuItem/MenuItem";
import TextConfirmationDialog from "components/TextConfirmationDialog/TextConfirmationDialog";
import MarketplaceHeader from "components/Headers/MarketplaceHeader";
import formatDateUTC from "src/utils/formatDateUTC";
import DataGridHeader from "./components/DataGridHeader";
import BellRingingIcon from "src/components/Icons/BellRinging/BellRingingIcon";
import SpeedometerIcon from "src/components/Icons/Speedometer/SpeedometerIcon";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deleteSubscription } from "src/api/subscriptions";
import useSnackbar from "src/hooks/useSnackbar";
// import CloudProviderCell from "./components/CloudProviderCell"; - Removed for Now
import useUserSubscriptions from "src/hooks/query/useUserSubscriptions";
import {
  getResourceRouteWithoutEnv,
  getAPIDocsRoute,
  getMarketplaceRoute,
} from "src/utils/route/access/accessRoute";
import GridCellExpand from "src/components/GridCellExpand/GridCellExpand";
import SubscriptionTypeDirectIcon from "src/components/Icons/SubscriptionType/SubscriptionTypeDirectIcon";
import SubscriptionTypeInvitedIcon from "src/components/Icons/SubscriptionType/SubscriptionTypeInvitedIcon";
import MarketplaceServiceSidebar, {
  sidebarActiveOptions,
} from "src/components/MarketplaceServiceSidebar/MarketplaceServiceSidebar";
import useServiceOffering from "src/hooks/useServiceOffering";
import useSubscriptionForProductTierAccess from "src/hooks/query/useSubscriptionForProductTierAccess";

const ITEM_HEIGHT = 45;

const MySubscriptions = () => {
  const {
    data: subscriptions = [],
    isFetching,
    refetch: refetchSubscriptions,
  } = useUserSubscriptions();

  const router = useRouter();

  const { serviceId, environmentId, productTierId, subscriptionId } =
    router.query;

  const [anchorEl, setAnchorEl] = useState(null);
  const [showUnsubscribeDialog, setShowUnsubscribeDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState({});
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: serviceOffering, isLoading: isServiceOfferingLoading } =
    useServiceOffering(serviceId, productTierId);

  const subscriptionQuery = useSubscriptionForProductTierAccess(
    serviceId,
    productTierId,
    subscriptionId
  );

  const { data: subscriptionData = {} } = subscriptionQuery;

  const filteredSubscriptions = useMemo(() => {
    let list = subscriptions;
    list = subscriptions?.filter((item) =>
      item?.serviceName?.toLowerCase()?.includes(searchText?.toLowerCase())
    );
    if (typeFilter === "direct") {
      list = list?.filter((item) => item?.roleType === "root");
    } else if (typeFilter === "invited") {
      list = list?.filter((item) => item?.roleType !== "root");
    }
    return list;
  }, [searchText, typeFilter, subscriptions]);

  const snackbar = useSnackbar();

  const onActionMenuClick = (event, subscription) => {
    setSelectedSubscription(subscription);
    setAnchorEl(event.currentTarget);
  };

  const viewResourceInstance = () => {
    if (selectedSubscription) {
      router.push(
        getResourceRouteWithoutEnv(
          selectedSubscription.serviceId,
          selectedSubscription.productTierId,
          selectedSubscription.id
        )
      );
    }
  };

  const columns = [
    {
      field: "serviceName",
      headerName: "Name",
      flex: 1,
      headerAlign: "center",
      minWidth: 230,
      renderCell: (params) => {
        const { serviceLogoURL, serviceName, serviceId, productTierId, id } =
          params.row;
        return (
          <GridCellExpand
            value={serviceName || ""}
            justifyContent="flex-start"
            textStyles={{
              color: "#6941C6",
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 700,
              cursor: "pointer",
            }}
            onClick={() => {
              router.push(
                getResourceRouteWithoutEnv(serviceId, productTierId, id)
              );
            }}
            startIcon={
              <Box
                boxShadow="0px 1px 2px 0px #1018280D"
                borderRadius="6px"
                border="1px solid #EAECF0"
                overflow="hidden"
                width="52px"
                height="52px"
                flexShrink={0}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  width="50"
                  height="50"
                  style={{ objectFit: "cover" }}
                  src={
                    serviceLogoURL ||
                    "/assets/images/dashboard/service/servicePlaceholder.png"
                  }
                  alt={serviceName}
                />
              </Box>
            }
          />
        );
      },
    },
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "productTierName",
      headerName: "Service Plan",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "roleType",
      headerName: "Role",
      flex: 1,
      minWidth: 70,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => {
        const role = params.row.roleType;
        if (!role?.length) {
          return "";
        }
        return role.charAt(0).toUpperCase() + role.slice(1);
      },
    },
    {
      field: "createdAt",
      headerName: "Subscription Date",
      flex: 1,
      align: "center",
      minWidth: 200,
      headerAlign: "center",
      valueGetter: (params) => formatDateUTC(params.row.createdAt),
    },
    {
      fieldName: "defaultSubscription",
      headerName: "Subscription Type",
      flex: 1,
      align: "center",
      minWidth: 150,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <GridCellExpand
            value={params.row.roleType === "root" ? "Direct" : "Invited"}
            startIcon={
              params.row.roleType === "root" ? (
                <SubscriptionTypeDirectIcon />
              ) : (
                <SubscriptionTypeInvitedIcon />
              )
            }
          />
        );
      },
    },
    {
      field: "subscriptionOwnerName",
      headerName: "Subscription Owner",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "defaultSubscription",
      headerName: "Action",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={(event) => onActionMenuClick(event, params.row)}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              anchorEl={anchorEl}
              open={
                Boolean(anchorEl) && params.row.id === selectedSubscription.id
              }
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: "22ch",
                },
              }}
            >
              <MenuItem
                sx={{ gap: "8px" }}
                onClick={() => {
                  setAnchorEl(null);
                  viewResourceInstance();
                }}
              >
                <SpeedometerIcon />
                <Text size="small" weight="medium">
                  Go To Dashboard
                </Text>
              </MenuItem>

              {/* Show Unsubscribe Only When It's Not a Default Subscription */}
              <MenuItem
                sx={{
                  gap: "8px",
                  display: params.row.defaultSubscription ? "none" : "flex",
                }}
                onClick={() => {
                  setAnchorEl(null);
                  setShowUnsubscribeDialog(true);
                }}
              >
                <BellRingingIcon />
                <Text size="small" weight="medium">
                  Unsubscribe
                </Text>
              </MenuItem>
            </Menu>
          </>
        );
      },
    },
  ];

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
        active={sidebarActiveOptions.subscriptions}
        currentSubscription={subscriptionData}
        isCustomNetworkEnabled={isCustomNetworkEnabled}
      />
    ),

    serviceName: serviceOffering?.serviceName,
    customLogo: true,
    serviceLogoURL: serviceOffering?.serviceLogoURL,
  };

  const unsubsscribeFormik = useFormik({
    initialValues: {
      confirmationText: "",
    },
    onSubmit: (values) => {
      if (values.confirmationText !== "unsubscribe") {
        return snackbar.showError("Please enter unsubscribe");
      }
      /*eslint-disable-next-line no-use-before-define*/
      unsubscribeMutation.mutate(selectedSubscription.id);
    },
  });

  const unsubscribeMutation = useMutation(deleteSubscription, {
    onSuccess: () => {
      refetchSubscriptions();
      setShowUnsubscribeDialog(false);
      unsubsscribeFormik.resetForm();
      snackbar.showSuccess("Unsubscribed Successfully");
    },
  });

  return (
    <>
      <DashboardLayout {...dashboardLayoutProps}>
        <Stack sx={{ minHeight: "calc(100vh - 180px)" }}>
          <MarketplaceHeader
            title="My Subscriptions"
            desc="Explore your current service subscriptions here"
          />

          {isFetching ? (
            <Box display="flex" justifyContent="center" mt="200px">
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              components={{
                Header: DataGridHeader,
              }}
              componentsProps={{
                header: {
                  numSubscriptions: subscriptions?.length,
                  searchText,
                  setSearchText,
                  typeFilter,
                  setTypeFilter,
                },
              }}
              disableColumnMenu
              disableSelectionOnClick
              columns={columns}
              rows={filteredSubscriptions}
              rowHeight={70}
              rowsPerPageOptions={[10]}
              pageSize={10}
              getRowId={(row) => row.id}
              sx={{ maxHeight: "925px", flex: 1 }} // Fill The Rest of the Screen Height
              hideFooterSelectedRowCount
            />
          )}
        </Stack>

        <TextConfirmationDialog
          open={showUnsubscribeDialog}
          handleClose={() => {
            setShowUnsubscribeDialog(false);
            unsubsscribeFormik.resetForm();
          }}
          formData={unsubsscribeFormik}
          title={`Unsubscribe Service`}
          buttonLabel={"Unsubscribe"}
          buttonColour={"red"}
          isLoading={unsubscribeMutation.isLoading}
          subtitle={`Are you sure you want to unsubscribe from ${selectedSubscription.serviceName}?`}
          message={
            "To confirm, please enter <b>unsubscribe</b>, in the field below:"
          }
        />
      </DashboardLayout>
    </>
  );
};

export default MySubscriptions;
