import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { Box, CircularProgress, IconButton, Stack } from "@mui/material";

import DashboardLayout from "components/DashboardLayout/DashboardLayout";
import DataGrid from "components/DataGrid/DataGrid";
import MarketplaceServiceSidebar from "components/MarketplaceSidebar/MarketplaceSidebar";
import { Text } from "components/Typography/Typography";
import Menu from "components/Menu/Menu";
import MenuItem from "components/MenuItem/MenuItem";
import TextConfirmationDialog from "components/TextConfirmationDialog/TextConfirmationDialog";
import MarketplaceHeader from "components/Headers/MarketplaceHeader";

import formatDateLocal from "src/utils/formatDateLocal";
import DataGridHeader from "./components/DataGridHeader";

import placeholderService from "public/assets/images/dashboard/service/servicePlaceholder.png";
import BellRingingIcon from "src/components/Icons/BellRinging/BellRingingIcon";
import SpeedometerIcon from "src/components/Icons/Speedometer/SpeedometerIcon";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import { deleteSubscription } from "src/api/subscriptions";
import useSnackbar from "src/hooks/useSnackbar";
import SubscriptionTypeCell from "./components/SubscriptionTypeCell";
// import CloudProviderCell from "./components/CloudProviderCell"; - Removed for Now
import useUserSubscriptions from "src/hooks/query/useUserSubscriptions";
import { getResourceRouteWithoutEnv } from "src/utils/route/access/accessRoute";
import GridCellExpand from "src/components/GridCellExpand/GridCellExpand";
import Head from "next/head";
import NoLogoImage from "public/assets/images/logos/no-logo.png";

const ITEM_HEIGHT = 45;

const MySubscriptions = ({ orgName, orgLogoURL }) => {
  const {
    data: subscriptions = [],
    isFetching,
    refetch: refetchSubscriptions,
  } = useUserSubscriptions();

  const [anchorEl, setAnchorEl] = useState(null);
  const [showUnsubscribeDialog, setShowUnsubscribeDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState({});

  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

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
  const router = useRouter();

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
            width={params.colDef.computedWidth}
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
                <Image
                  width="50"
                  height="50"
                  style={{ objectFit: "cover" }}
                  src={serviceLogoURL || placeholderService}
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
      valueGetter: (params) => formatDateLocal(params.row.createdAt),
    },
    {
      fieldName: "defaultSubscription",
      headerName: "Subscription Type",
      flex: 1,
      align: "center",
      minWidth: 150,
      headerAlign: "center",
      renderCell: (params) => {
        if (params.row.roleType === "root") {
          return <SubscriptionTypeCell subscriptionType="Direct" />;
        }
        return <SubscriptionTypeCell subscriptionType="Invited" />;
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
    // {
    //   field: "cloudProviderNames",
    //   headerName: "Availability",
    //   flex: 1,
    //   minWidth: 200,
    //   align: "center",
    //   headerAlign: "center",
    //   renderCell: (params) => {
    //     return (
    //       <CloudProviderCell
    //         cloudProviders={params.row.cloudProviderNames || []}
    //       />
    //     );
    //   },
    // },
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

  const unsubsscribeFormik = useFormik({
    initialValues: {
      confirmationText: "",
    },
    onSubmit: (values) => {
      if (values.confirmationText !== "unsubscribe") {
        return snackbar.showError("Please enter unsubscribe");
      }
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
      <Head>
        <title>Subscriptions</title>
      </Head>
      <DashboardLayout
        noSidebar
        // SidebarUI={<MarketplaceServiceSidebar active={"subscription"} />}
        marketplacePage
        serviceLogoURL={orgLogoURL || NoLogoImage}
        serviceName={orgName}
      >
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
