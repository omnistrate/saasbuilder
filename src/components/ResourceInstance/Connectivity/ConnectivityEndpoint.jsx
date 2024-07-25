import { Box, styled, Stack } from "@mui/material";
import Image from "next/image";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import MuiTableCell from "@mui/material/TableCell";
import { Text } from "src/components/Typography/Typography";
import resourcePortsIcon from "../../../../public/assets/images/dashboard/resource-instance-nodes/ports.svg";
import resourceEndpointIcon from "../../../../public/assets/images/dashboard/resource-instance-nodes/resource-endpoint.svg";
import { useEffect, useRef, useState } from "react";
import AccordionEditIcon from "src/components/Icons/AccordionEdit/AccordionEdit";
import Switch from "src/components/Switch/Switch";
import FieldContainer from "src/components/FormElementsv2/FieldContainer/FieldContainer";
import TextField from "src/components/FormElementsv2/TextField/TextField";
import Button from "src/components/Button/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import FieldError from "src/components/FormElementsv2/FieldError/FieldError";
import IconButtonSquare from "src/components/IconButtonSquare/IconButtonSquare";
import EditIcon from "src/components/Icons/Edit/Edit";
import DeleteIcon from "src/components/Icons/Delete/Delete";
import TextConfirmationDialog from "src/components/TextConfirmationDialog/TextConfirmationDialog";
import LoadingSpinnerSmall from "src/components/CircularProgress/CircularProgress";
import CustomDNSDetailsModal from "./CustomDNSDetailsModal";
import StatusChip from "src/components/StatusChip/StatusChip";
import _ from "lodash";
import {
  addCustomDNSToResourceInstance,
  getResourceInstanceDetails,
  removeCustomDNSFromResourceInstance,
} from "src/api/resourceInstance";
import { useMutation } from "@tanstack/react-query";
import ViewInstructionsIcon from "src/components/Icons/ViewInstructions/ViewInstructions";
import CopyButton from "src/components/Button/CopyButton";

const TableCell = styled(MuiTableCell)({
  borderBottom: "none",
});

const ResourceConnectivityEndpoint = (props) => {
  const {
    resourceName,
    endpointURL,
    ports,
    containerStyles,
    viewType,
    isPrimaryResource = false,
    customDNSData = { enabled: false },
    queryData,
    resourceKey,
    resourceId,
    refetchInstance,
    resourceHasCompute,
  } = props;

  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] =
    useState(false);
  const [showConfigurationDialog, setShowConfigurationDialog] = useState(false);
  const [isTextfieldDisabled, setIsTextFieldDisabled] = useState(false);
  const [shouldShowConfigDialog, setShouldShowConfigDialog] = useState(false);
  const [isVerifyingDNSRemoval, setIsVerifyingDNSRemoval] = useState(false);
  const [isVerifyingDNSSetup, setIsVerifyingDNSSetup] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const timeoutID = useRef(null);
  const pollCount = useRef(0);

  const { dnsName } = customDNSData;
  let isCustomDNSSetup = false;
  if (dnsName) {
    isCustomDNSSetup = true;
  }
  const [isToggleChecked, setIsToggleChecked] = useState(isCustomDNSSetup);

  const customDNSFormik = useFormik({
    initialValues: {
      customDNSEndpoint: dnsName ?? "",
    },
    onSubmit: (values) => {
      handleAddDNS({
        customDNS: values.customDNSEndpoint,
      });
    },
    validationSchema: Yup.object().shape({
      customDNSEndpoint: Yup.string()
        //.url("Please enter a valid URL")
        .required("Target Alias is required"),
    }),
    enableReinitialize: true,
  });

  const removeCustomDNSFormik = useFormik({
    initialValues: {
      confirmationText: "",
    },
    onSubmit: async (values) => {
      if (values.confirmationText === "deleteme") {
        try {
          await removeCustomDNSMutation?.mutateAsync();
          setShowDeleteConfirmationDialog(false);
          removeCustomDNSFormik.resetForm();
        } catch (err) {
          console.log(error);
        }
      }
    },
  });

  async function handleAddDNS(payload) {
    try {
      await addCustomDNSMutation?.mutateAsync(payload);
      setShouldShowConfigDialog(true);
      setIsTextFieldDisabled(true);
    } catch {}
  }

  useEffect(() => {
    if (customDNSData.enabled === true && customDNSData.dnsName) {
      setIsTextFieldDisabled(true);
    } else if (customDNSData.enabled === true && !customDNSData.dnsName) {
      setIsTextFieldDisabled(false);
      setIsToggleChecked(false);
    }
  }, [customDNSData]);

  useEffect(() => {
    if (isCustomDNSSetup && shouldShowConfigDialog) {
      setShowConfigurationDialog(true);
      setShouldShowConfigDialog(false);
    }
  }, [isCustomDNSSetup, shouldShowConfigDialog, setShouldShowConfigDialog]);

  function handleSwitchToggle(e) {
    const isChecked = !e.target.checked;
    if (isChecked) {
      //disable toggle if dns is not setup
      if (!isCustomDNSSetup) {
        setIsToggleChecked(false);
      } else {
        setDeleteMessage(
          "Disabling will delete endpoint alias. Are you sure you want to continue?"
        );
        setShowDeleteConfirmationDialog(true);
      }
    } else {
      setIsToggleChecked(true);
    }
  }

  const statusStylesAndLabel = getCustomDNSStatusStylesAndLabel(
    customDNSData?.status
  );

  const addCustomDNSMutation = useMutation({
    mutationFn: (payload) => {
      return addCustomDNSToResourceInstance(
        queryData?.serviceProviderId,
        queryData?.serviceKey,
        queryData?.serviceAPIVersion,
        queryData?.serviceEnvironmentKey,
        queryData?.serviceModelKey,
        queryData?.productTierKey,
        resourceKey,
        queryData.resourceInstanceId,
        queryData.subscriptionId,
        payload
      );
    },
    onSuccess: () => {
      pollInstanceQueryToVerifyDNSSetupSuccess();
    },
  });

  const removeCustomDNSMutation = useMutation({
    mutationFn: (payload) => {
      return removeCustomDNSFromResourceInstance(
        queryData?.serviceProviderId,
        queryData?.serviceKey,
        queryData?.serviceAPIVersion,
        queryData?.serviceEnvironmentKey,
        queryData?.serviceModelKey,
        queryData?.productTierKey,
        resourceKey,
        queryData.resourceInstanceId,
        queryData.subscriptionId
      );
    },
    onSuccess: () => {
      pollInstanceQueryToVerifyDNSRemoval();
    },
  });

  function clearExistingTimeout() {
    if (timeoutID.current) {
      clearTimeout(timeoutID.current);
    }
  }

  function pollInstanceQueryToVerifyDNSSetupSuccess() {
    setIsVerifyingDNSSetup(true);
    clearExistingTimeout();
    pollCount.current = 0;
    verifyDNSSetupSuccess();

    function verifyDNSSetupSuccess() {
      if (pollCount.current < 5) {
        pollCount.current++;
        const id = setTimeout(() => {
          getResourceInstanceDetails(
            queryData?.serviceProviderId,
            queryData?.serviceKey,
            queryData?.serviceAPIVersion,
            queryData?.serviceEnvironmentKey,
            queryData?.serviceModelKey,
            queryData?.productTierKey,
            resourceKey,
            queryData.resourceInstanceId,
            queryData.subscriptionId
          )
            .then((response) => {
              const topologyDetails =
                response.data?.detailedNetworkTopology?.[resourceId];
              //check for dnsName field in the response, absence means dns removal complete
              if (Boolean(topologyDetails?.customDNSEndpoint.dnsName)) {
                setIsVerifyingDNSSetup(false);
                refetchInstance();
              } else {
                setIsVerifyingDNSSetup();
              }
            })
            .catch((error) => {
              setIsVerifyingDNSSetup();
            });
        }, 500);
        timeoutID.current = id;
      } else {
        setIsVerifyingDNSRemoval(false);
      }
    }
  }

  function pollInstanceQueryToVerifyDNSRemoval() {
    setIsVerifyingDNSRemoval(true);
    clearExistingTimeout();
    pollCount.current = 0;
    verifyDNSRemoval();

    function verifyDNSRemoval() {
      if (pollCount.current < 5) {
        pollCount.current++;
        const id = setTimeout(() => {
          getResourceInstanceDetails(
            queryData?.serviceProviderId,
            queryData?.serviceKey,
            queryData?.serviceAPIVersion,
            queryData?.serviceEnvironmentKey,
            queryData?.serviceModelKey,
            queryData?.productTierKey,
            resourceKey,
            queryData.resourceInstanceId,
            queryData.subscriptionId
          )
            .then((response) => {
              const topologyDetails =
                response.data?.detailedNetworkTopology?.[resourceId];
              //check for dnsName field in the response, absence means dns removal complete
              if (!Boolean(topologyDetails?.customDNSEndpoint.dnsName)) {
                setIsVerifyingDNSRemoval(false);
                refetchInstance();
              } else {
                verifyDNSRemoval();
              }
            })
            .catch((error) => {
              verifyDNSRemoval();
            });
        }, 1500);
        timeoutID.current = id;
      } else {
        setIsVerifyingDNSRemoval(false);
      }
    }
  }

  useEffect(() => {
    return () => {
      clearExistingTimeout();
    };
  }, []);

  const shouldDisableMutationButons =
    isVerifyingDNSRemoval ||
    removeCustomDNSMutation.isLoading ||
    isVerifyingDNSSetup ||
    addCustomDNSMutation.isLoading;

  return (
    <>
      <Box
        sx={{
          border: isPrimaryResource ? "2px solid #7F56D9" : "1px solid #EAECF0",
          background: isPrimaryResource ? "#F9F5FF" : "white",
          borderRadius: "12px",
          ...containerStyles,
        }}
      >
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ paddingRight: "8px" }}>
                {viewType === "endpoint" ? (
                  <Image src={resourceEndpointIcon} alt="resource-endpoint" />
                ) : (
                  <Image src={resourcePortsIcon} alt="resource-ports" />
                )}
              </TableCell>
              <TableCell
                width="100%"
                sx={{ paddingLeft: "8px", paddingRight: "8px" }}
              >
                <Text size="small" weight="medium" color="#53389E">
                  {resourceName}
                </Text>
                <Text
                  size="small"
                  weight="regular"
                  color={isPrimaryResource ? "#6941C6" : ""}
                >
                  {viewType === "endpoint" ? endpointURL : ports}
                </Text>
              </TableCell>
              <TableCell sx={{ paddingLeft: "8px" }}>
                {Boolean(endpointURL || ports) && (
                  <Box alignSelf="start">
                    <CopyButton
                      text={viewType === "endpoint" ? endpointURL : ports}
                    />
                  </Box>
                )}
              </TableCell>
            </TableRow>
            {resourceHasCompute && customDNSData?.enabled && (
              <>
                <TableRow>
                  <TableCell align="center" sx={{ paddingRight: "8px" }}>
                    <AccordionEditIcon color="#53389E" />
                  </TableCell>
                  <TableCell colSpan={2} sx={{ paddingLeft: "4px" }}>
                    <Stack direction="row" alignItems="center" gap="10px">
                      <Text color="#53389E" weight="medium" size="small">
                        Configure Endpoint Alias
                      </Text>
                      <Switch
                        checked={isToggleChecked}
                        onChange={handleSwitchToggle}
                      />
                      {isCustomDNSSetup && (
                        <StatusChip
                          {...statusStylesAndLabel}
                          pulsateDot={Boolean(
                            customDNSData?.status === "PENDING"
                          )}
                        />
                      )}
                      {(isVerifyingDNSRemoval || isVerifyingDNSSetup) && (
                        <LoadingSpinnerSmall />
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
                {isToggleChecked && (
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{
                        paddingRight: "8px",
                        paddingTop: 0,
                        paddingBottom: 0,
                      }}
                    />
                    <TableCell
                      colSpan={2}
                      sx={{ paddingLeft: "4px", paddingTop: 0 }}
                    >
                      <FieldContainer marginTop={0}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          gap="6px"
                          marginTop="6px"
                        >
                          <TextField
                            //@ts-ignore
                            marginTop="0px"
                            name="customDNSEndpoint"
                            onChange={customDNSFormik.handleChange}
                            onBlur={customDNSFormik.handleBlur}
                            value={customDNSFormik.values.customDNSEndpoint}
                            disabled={isTextfieldDisabled}
                            copyButton={isTextfieldDisabled}
                          />
                          {isTextfieldDisabled ? (
                            <>
                              <IconButtonSquare
                                onClick={() => {
                                  setShowConfigurationDialog(true);
                                }}
                              >
                                <ViewInstructionsIcon color="#7F56D9" />
                              </IconButtonSquare>
                              <IconButtonSquare
                                onClick={() => {
                                  setIsTextFieldDisabled(false);
                                  setIsEditing(true);
                                }}
                              >
                                <EditIcon color="#7F56D9" />
                              </IconButtonSquare>
                              <IconButtonSquare
                                sx={{ borderColor: "#FDA29B !important" }}
                                onClick={() => {
                                  setDeleteMessage(
                                    "Are you sure you want to delete this endpoint alias?"
                                  );
                                  setShowDeleteConfirmationDialog(true);
                                }}
                                disabled={shouldDisableMutationButons}
                              >
                                <DeleteIcon />
                              </IconButtonSquare>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outlined"
                                sx={{
                                  color: "#039855 !important",
                                }}
                                onClick={() => {
                                  customDNSFormik.submitForm();
                                }}
                                disabled={shouldDisableMutationButons}
                              >
                                Verify{" "}
                                {addCustomDNSMutation?.isLoading && (
                                  <LoadingSpinnerSmall />
                                )}
                              </Button>
                              {isEditing && (
                                <Button
                                  variant="outlined"
                                  sx={{
                                    color: "#D92D20 !important",
                                  }}
                                  onClick={() => {
                                    customDNSFormik.resetForm();
                                    setIsEditing(false);
                                    setIsTextFieldDisabled(true);
                                  }}
                                >
                                  Cancel
                                </Button>
                              )}
                            </>
                          )}
                        </Stack>
                        <FieldError>
                          {customDNSFormik.touched.customDNSEndpoint &&
                            customDNSFormik.errors.customDNSEndpoint}
                        </FieldError>
                      </FieldContainer>
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </Box>
      {isCustomDNSSetup && (
        <TextConfirmationDialog
          open={showDeleteConfirmationDialog}
          handleClose={() => {
            setShowDeleteConfirmationDialog(false);
            removeCustomDNSFormik.resetForm();
          }}
          formData={removeCustomDNSFormik}
          title={`Delete Endpoint Alias`}
          subtitle={deleteMessage}
          message={
            "To confirm deletion, please enter <b>deleteme</b>, in the field below:"
          }
          isLoading={removeCustomDNSMutation?.isLoading}
          isDeleteEnable={true}
        />
      )}
      <CustomDNSDetailsModal
        open={showConfigurationDialog}
        aRecordTarget={customDNSData?.aRecordTarget}
        cnameTarget={customDNSData?.cnameTarget}
        domainName={customDNSData?.dnsName}
        handleClose={() => {
          setShowConfigurationDialog(false);
        }}
      />
    </>
  );
};

export default ResourceConnectivityEndpoint;

const getCustomDNSStatusStylesAndLabel = (status) => {
  const statusStylesMap = {
    PENDING: {
      label: "Pending",
      bgColor: "#faf5e7",
      color: "#f79009",
    },
    READY: {
      label: "Ready",
      bgColor: "#ecfdf3",
      color: "#039855",
    },
  };

  if (!(status in statusStylesMap)) {
    return {
      bgColor: "#e0eaff",
      color: "#444ce7",
      label: _.capitalize(status),
    };
  } else {
    const styles = statusStylesMap[status];
    return styles;
  }
};
