import AddIcon from "@mui/icons-material/Add";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  chipClasses,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation } from "@tanstack/react-query";
import { FieldArray, FormikProvider, useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import Button from "../../../../src/components/Button/Button";
import DashboardLayout from "../../../../src/components/DashboardLayout/DashboardLayout";
import Form from "../../../../src/components/FormElements/Form/Form";
import TextField from "../../../../src/components/FormElements/TextField/TextField";
import { P } from "../../../../src/components/Typography/Typography";
import useSnackbar from "../../../../src/hooks/useSnackbar";
import LoadingSpinnerSmall from "../../../../src/components/CircularProgress/CircularProgress";
import { useRouter } from "next/router";
import { RiDeleteBinLine } from "react-icons/ri";
import { AccessSupport } from "../../../../src/components/Access/AccessSupport";
import Chip from "../../../../src/components/Chip/Chip";
import MarketplaceServiceSidebar, {
  sidebarActiveOptions,
} from "../../../../src/components/MarketplaceServiceSidebar/MarketplaceServiceSidebar";
import useServiceOffering from "../../../../src/hooks/useServiceOffering";
import SideDrawerRight from "../../../../src/components/SideDrawerRight/SideDrawerRight";
import {
  getEnumFromUserRoleString,
  isOperationAllowedByRBAC,
  operationEnum,
  viewEnum,
} from "../../../../src/utils/isAllowedByRBAC";
import ConfirmationDialog from "../../../../src/components/Dialog/ConfirmDialog";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import {
  getAPIDocsRoute,
  getMarketplaceRoute,
} from "../../../../src/utils/route/access/accessRoute";
import { inviteSubscriptionUser, revokeSubscriptionUser } from "src/api/users";
import useSubscriptionUsers from "src/hooks/query/useSubscriptionUsers";
import useSubscriptionForProductTierAccess from "src/hooks/query/useSubscriptionForProductTierAccess";
import SubscriptionNotFoundUI from "src/components/Access/SubscriptionNotFoundUI";
import HeaderTitle from "src/components/Headers/Header";
import ServiceOfferingUnavailableUI from "src/components/ServiceOfferingUnavailableUI/ServiceOfferingUnavailableUI";

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

function AccessControl() {
  const router = useRouter();
  const { serviceId, environmentId, source, productTierId, subscriptionId } =
    router.query;

  const snackbar = useSnackbar();

  const { data: service, isLoading: isServiceOfferingLoading } =
    useServiceOffering(serviceId, productTierId);

  const subscriptionQuery = useSubscriptionForProductTierAccess(
    serviceId,
    productTierId,
    subscriptionId
  );
  const { data: subscriptionData = {}, isLoading: isLoadingSubscription } =
    subscriptionQuery;

  const {
    data,
    isFetching: isFetchingUsers,
    refetch,
  } = useSubscriptionUsers({
    subscriptionId: subscriptionData?.id,
  });
  const { subscriptionUsers: users = [] } = data || {};

  const [supportDrawerOpen, setSupportDrawerOpen] = useState(false);
  const [currentTabValue, setCurrentTabValue] = useState(false);
  const [modifyFormikValue, setModifyFormikValue] = useState({});
  const [selectionModel, setSelectionModel] = useState([]);
  const [isDialog, setDialog] = React.useState(false);

  // const selectUser = useSelector(selectUserrootData);
  const role = getEnumFromUserRoleString(subscriptionData?.roleType);
  const view = viewEnum.Access_AccessControl;
  const unviteAllowed = isOperationAllowedByRBAC(
    operationEnum.UnInvite,
    role,
    view
  );
  const inviteAllowed = isOperationAllowedByRBAC(
    operationEnum.Invite,
    role,
    view
  );
  const [currentSource, setCurrentSource] = React.useState("");
  const handleClose = () => {
    setDialog(false);
  };
  const closeSupportDrawer = () => {
    setSupportDrawerOpen(false);
  };

  useEffect(() => {
    if (source) {
      setCurrentSource(source);
    }
  }, [source]);

  const createUserInvitesMutation = useMutation(async (data) => {
    try {
      await Promise.all(
        data.userInvite.map((d) => {
          const payload = {
            email: d.email,
            roleType: d.roleType,
          };

          return inviteSubscriptionUser(subscriptionData?.id, payload);
        })
      );
      snackbar.showSuccess("Invites Sent");
      /*eslint-disable-next-line no-use-before-define*/
      formik.resetForm();
      refetch();
    } catch (error) {
      snackbar.showError("Failed to send invites");
    }
  });

  const deleteUserMutation = useMutation(
    (payload) => revokeSubscriptionUser(subscriptionData?.id, payload),
    {
      onSuccess: async () => {
        //eslint-disable-next-line no-use-before-define
        deleteformik.resetForm();
        setDialog(false);
        snackbar.showSuccess("User Deleted");
        refetch();
      },
      onError: () => {
        snackbar.showError("Failed to delete user");
      },
    }
  );

  const deleteformik = useFormik({
    initialValues: {
      deleteme: "",
    },
    onSubmit: (values) => {
      if (values.deleteme === "deleteme") {
        const payload = {
          email: modifyFormikValue.emailAddress,
          roleType: modifyFormikValue.role,
        };
        deleteUserMutation.mutate(payload);
      } else {
        snackbar.showError("Please enter deleteme");
      }
    },
    validateOnChange: false,
  });

  const formik = useFormik({
    initialValues: {
      userInvite: [
        {
          email: "",
          roleType: "",
          serviceId: "All",
          serviceEnvironmentId: "All",
        },
      ],
    },
    onSubmit: (values) => {
      const valuesToBeSubmitted = structuredClone(values);

      for (let i = 0; i < valuesToBeSubmitted?.userInvite?.length; i++) {
        if (valuesToBeSubmitted.userInvite[i]["roleType"] === "Editor") {
          valuesToBeSubmitted.userInvite[i]["roleType"] = "editor";
        }
        if (valuesToBeSubmitted.userInvite[i]["roleType"] === "Reader") {
          valuesToBeSubmitted.userInvite[i]["roleType"] = "reader";
        }
      }
      createUserInvitesMutation.mutate(valuesToBeSubmitted);
    },
    validateOnChange: false,
  });

  const inputColumns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "pl-4",
      cellClassName: "pl-4",
    },
    { field: "emailAddress", headerName: "Email Address", flex: 1 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      valueGetter: (params) => {
        const role = params.row.role;
        if (role === "editor") {
          return "Editor";
        }
        if (role === "reader") {
          return "Reader";
        }
        if (role === "root") {
          return "Root";
        }
      },
    },
    { field: "resource", headerName: "Resource", flex: 1 },
    {
      field: "resourceInstance",
      headerName: "Resource Instance",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => {
        const role = params.row.role;
        if (role !== "root") {
          return (
            <IconButton
              size="small"
              disabled={!unviteAllowed}
              onClick={() => {
                setDialog(true);
              }}
            >
              <RiDeleteBinLine />
            </IconButton>
          );
        } else return "";
      },
    },
  ];

  const inputRows = users.map((data, i) => {
    return {
      id: i,
      name: data.name ? data.name : "Unregistered User",
      role: data.roleType,
      emailAddress: data.email,
      resource: "All",
      resourceInstance: "All",
    };
  });

  const getNewEnvVariable = () => {
    return {
      email: "",
      roleType: "",
      serviceId: "All",
      serviceEnvironmentId: "All",
    };
  };

  const isCustomNetworkEnabled = useMemo(() => {
    let enabled = false;

    if (
      service?.serviceModelFeatures?.find((featureObj) => {
        return featureObj.feature === "CUSTOM_NETWORKS";
      })
    )
      enabled = true;

    return enabled;
  }, [service]);

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
  if (isServiceOfferingLoading || isLoadingSubscription || !service) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        isNotShow
        marketplacePage={currentSource === "access" ? false : true}
        apiDocsurl={serviceAPIDocsLink}
        serviceId={serviceId}
        accessPage
        customLogo
        serviceApiId={service?.serviceAPIID}
        enableConsumptionLinks
        servicePlanUrlLink={servicePlanUrlLink}
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={service?.resourceParameters}
            isLoading={isServiceOfferingLoading}
            serviceName={service?.serviceName}
            active={sidebarActiveOptions.accessControl}
            productTierId={productTierId}
            currentSource={currentSource}
            subscriptionId={subscriptionData?.id}
            currentSubscription={subscriptionData}
            isCustomNetworkEnabled={isCustomNetworkEnabled}
          />
        }
        serviceName={service?.serviceName}
        serviceLogoURL={service?.serviceLogoURL}
      >
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
        apiDocsurl={serviceAPIDocsLink}
        serviceId={serviceId}
        accessPage
        customLogo
        serviceApiId={service?.serviceAPIID}
        enableConsumptionLinks
        servicePlanUrlLink={servicePlanUrlLink}
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={service?.resourceParameters}
            isLoading={isServiceOfferingLoading}
            serviceName={service?.serviceName}
            active={sidebarActiveOptions.accessControl}
            productTierId={productTierId}
            currentSource={currentSource}
            subscriptionId={subscriptionData?.id}
            currentSubscription={subscriptionData}
            isCustomNetworkEnabled={isCustomNetworkEnabled}
          />
        }
        serviceName={service?.serviceName}
        serviceLogoURL={service?.serviceLogoURL}
      >
        <SubscriptionNotFoundUI />
      </DashboardLayout>
    );
  }

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
      serviceId={serviceId}
      serviceApiId={service?.serviceAPIID}
      enableConsumptionLinks
      servicePlanUrlLink={servicePlanUrlLink}
      isNotShow
      SidebarUI={
        <MarketplaceServiceSidebar
          serviceId={serviceId}
          environmentId={environmentId}
          resourceParameters={service?.resourceParameters}
          isLoading={isServiceOfferingLoading}
          serviceName={service?.serviceName}
          active={sidebarActiveOptions.accessControl}
          productTierId={productTierId}
          currentSource={currentSource}
          currentSubscription={subscriptionData}
          isCustomNetworkEnabled={isCustomNetworkEnabled}
        />
      }
      serviceName={service?.serviceName}
      customLogo
      serviceLogoURL={service?.serviceLogoURL}
    >
      {isFetchingUsers || isLoadingSubscription ? (
        <Box display="flex" justifyContent="center" mt="200px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <HeaderTitle
            title="Access Control"
            desc="Manage your Users and their account permissions here."
          />

          <Box
            mt="20px"
            mb="32px"
            boxShadow="0 1px 2px 0 #1018280F"
            borderRadius="12px 12px 12px 12px"
            border="1px solid #EAECF0"
          >
            <Form
              onSubmit={formik.handleSubmit}
              sx={{
                padding: "20px 24px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <P
                    size="large"
                    sx={{
                      color: "#101828",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    Invite Users
                  </P>
                  <P size="small" weight="regular" sx={{ color: "#475467" }}>
                    Get your projects up and running faster by inviting your
                    users to collaborate
                  </P>
                </Box>

                <Button
                  variant="contained"
                  sx={{
                    marginLeft: "30px",
                    marginRight: "30px",
                  }}
                  startIcon={<EmailOutlinedIcon />}
                  type="submit"
                  disabled={
                    createUserInvitesMutation.isLoading ? true : !inviteAllowed
                  }
                >
                  Send Invites{" "}
                  {createUserInvitesMutation.isLoading && (
                    <LoadingSpinnerSmall />
                  )}
                </Button>
              </Box>

              <Box
                sx={{
                  width: "100%",
                  maxWidth: "900px",
                  margin: "auto",
                  marginTop: "40px",
                }}
              >
                <Box>
                  <FormikProvider value={formik}>
                    <FieldArray
                      name="userInvite"
                      render={({ remove, push }) => {
                        return (
                          <>
                            {formik.values.userInvite.map((invite, index) => {
                              return (
                                <Box
                                  display={"flex"}
                                  flex={1}
                                  key={index}
                                  sx={{ marginTop: "8px" }}
                                  columnGap={"15px"}
                                  rowGap={"15px"}
                                  justifyContent={"flex-start"}
                                  alignItems={"center"}
                                  pb={2}
                                >
                                  <Box
                                    display={"flex"}
                                    columnGap={"15px"}
                                    rowGap={"15px"}
                                    flexWrap={"wrap"}
                                    justifyContent={"flex-start"}
                                    alignItems={"center"}
                                  >
                                    <TextField
                                      required
                                      placeholder="you@example.com"
                                      value={invite.email}
                                      onChange={formik.handleChange}
                                      name={`userInvite[${index}].email`}
                                      sx={{ width: "400px", flex: 1 }}
                                      InputProps={{
                                        startAdornment: (
                                          <InputAdornment
                                            position="start"
                                            sx={{
                                              marginRight: "0px",
                                              "& .MuiIconButton-root": {
                                                padding: 0,
                                              },
                                            }}
                                          >
                                            <IconButton>
                                              <EmailOutlinedIcon />
                                            </IconButton>
                                          </InputAdornment>
                                        ),
                                      }}
                                    />
                                    <TextField
                                      required
                                      select
                                      name={`userInvite[${index}].roleType`}
                                      value={invite.roleType}
                                      onChange={formik.handleChange}
                                      sx={{ width: "400px", flex: 1 }}
                                      SelectProps={{
                                        displayEmpty: true,
                                        renderValue: function (value) {
                                          if (value) return value;
                                          return "Role";
                                        },
                                      }}
                                    >
                                      {["Editor", "Reader"].map((option) => (
                                        <MenuItem key={option} value={option}>
                                          {option}
                                        </MenuItem>
                                      ))}
                                    </TextField>

                                    {/* <Select
                                      // isLoading
                                      required
                                      name={`userInvite[${index}].serviceId`}
                                      value={invite.serviceId}
                                      onChange={formik.handleChange}
                                      sx={{
                                        flex: 1,
                                        minWidth: "200px",
                                        maxWidth: "200px",
                                      }}
                                      displayEmpty
                                      renderValue={(value) => {
                                        if (value) return value;
                                        return "Resource";
                                      }}
                                    >
                                      <MenuItem key="all" value="All">
                                        All
                                      </MenuItem>
                                    </Select>
                                    <Select
                                      required
                                      select
                                      name={`userInvite[${index}].serviceEnvironmentId`}
                                      value={invite.serviceEnvironmentId}
                                      onChange={formik.handleChange}
                                      displayEmpty
                                      renderValue={function (value) {
                                        if (value) return value;
                                        return "Resource Instance";
                                      }}
                                      sx={{
                                        flex: 1,
                                        minWidth: "200px",
                                        maxWidth: "200px",
                                      }}
                                    >
                                      <MenuItem key="all" value="All">
                                        All
                                      </MenuItem>
                                    </Select> */}
                                  </Box>
                                  {index !== 0 && (
                                    <Box>
                                      <IconButton
                                        size="small"
                                        onClick={() => {
                                          remove(index);
                                        }}
                                      >
                                        <RiDeleteBinLine />
                                      </IconButton>
                                    </Box>
                                  )}
                                </Box>
                              );
                            })}
                            <Stack
                              direction="row"
                              justifyContent={
                                formik.values.userInvite.length > 0
                                  ? "space-between"
                                  : "flex-end"
                              }
                              marginBottom={"20px"}
                            >
                              {formik.values.userInvite.length === 0 ? (
                                <Button
                                  startIcon={<AddIcon />}
                                  // variant="contained"
                                  id="add-user"
                                  sx={{
                                    marginTop: "16px",
                                    paddingLeft: "10px",
                                    paddingRight: "10px",
                                    background: "white",
                                    color: "black",
                                    opacity: 0.8,
                                  }}
                                  onClick={() => {
                                    push(getNewEnvVariable());
                                  }}
                                >
                                  Add User
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    startIcon={<AddIcon />}
                                    id="add-another-user"
                                    sx={{
                                      marginTop: "16px",
                                      paddingLeft: "10px",
                                      paddingRight: "10px",
                                      background: "white",
                                      color: "black",
                                      opacity: 0.8,
                                    }}
                                    onClick={() => {
                                      push(getNewEnvVariable());
                                    }}
                                  >
                                    Add Another
                                  </Button>
                                  {/* <Button
                                    variant="contained"
                                    sx={{
                                      marginLeft: "30px",
                                      marginTop: "16px",
                                    }}
                                    startIcon={<EmailOutlinedIcon />}
                                    type="submit"
                                    disabled={
                                      createUserInvitesMutation.isLoading
                                        ? true
                                        : !inviteAllowed
                                    }
                                  >
                                    Send Invites{" "}
                                    {createUserInvitesMutation.isLoading && (
                                      <LoadingSpinnerSmall />
                                    )}
                                  </Button> */}
                                </>
                              )}
                            </Stack>
                          </>
                        );
                      }}
                    />
                  </FormikProvider>
                </Box>
              </Box>
            </Form>
          </Box>

          <Box>
            <Stack
              direction="row"
              sx={{
                p: 2.5,
                border: "1px solid #EAECF0",
                borderBottom: 0,
                borderRadius: 2,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                justifyContent: "space-between",
              }}
            >
              <Box flexGrow={1}>
                <Stack direction="row" alignItems="center">
                  <P size="large" sx={{ color: "#101828", marginRight: 1 }}>
                    {"Manage Access"}
                  </P>
                  {inputRows.length > 0 && (
                    <Chip
                      size="small"
                      label={`${inputRows.length} Users`}
                      sx={{
                        background: "#EFF2FF",

                        [`& .${chipClasses.label}`]: { color: "#5600c9" },
                      }}
                    />
                  )}
                </Stack>

                <P
                  size="small"
                  weight="regular"
                  sx={{ color: "#475467", marginTop: "4px" }}
                >
                  {"Manage your Users and their account permissions here."}
                </P>
              </Box>

              {/* <Button
              sx={{
                marginRight: "10px",
                background: "white",
                color: "#344054",
                boxShadow: "initial",
                borderWidth: "2px",
                borderStyle: "solid",
                borderColor: "#EAECF0",
                alignSelf: "center",
              }}
              startIcon={<CloudDownloadOutlinedIcon />}
              onClick={() => {
                openDrawer(drawerType.view);
              }}
            >
              Download CSV
            </Button> */}
            </Stack>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={inputRows}
                columns={inputColumns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                selectionModel={selectionModel}
                hideFooterSelectedRowCount
                onSelectionModelChange={(selection) => {
                  if (selection.length >= 1) {
                    const selectionSet = new Set(selectionModel);

                    const result = selection.filter(
                      (s) => !selectionSet.has(s)
                    );
                    setSelectionModel(result);
                    const index = selection.length == 1 ? 0 : 1;

                    inputRows?.map((rowObj) => {
                      if (rowObj) {
                        if (rowObj["id"] == selection[index]) {
                          setModifyFormikValue(rowObj);
                        }
                      }
                    });
                  } else {
                    setSelectionModel(selection);
                    // setSelectedAccountConfigName("");
                  }
                }}
                getRowId={(row) => row.id}
                sx={{
                  borderRadius: 2,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
                    {
                      display: "none",
                    },
                }}
              />
            </div>
          </Box>
        </>
      )}

      <ConfirmationDialog
        open={isDialog}
        handleClose={handleClose}
        formData={deleteformik}
        title={`Delete User`}
        buttonLabel={"Delete"}
        buttonColour={"red"}
        subtitle={`Are you sure you want to Delete ${modifyFormikValue.emailAddress}?`}
        message={
          "To confirm deletion, please enter <b> deleteme </b>, in the field below:"
        }
      />
      <SideDrawerRight
        size="xlarge"
        open={supportDrawerOpen}
        closeDrawer={closeSupportDrawer}
        RenderUI={
          <AccessSupport service={service} currentTabValue={currentTabValue} />
        }
      />
    </DashboardLayout>
  );
}

export default AccessControl;
