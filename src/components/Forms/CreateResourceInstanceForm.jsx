import {
  Box,
  Chip,
  CircularProgress,
  Hidden,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import FieldContainer from "../FormElements/FieldContainer/FieldContainer";
import FieldDescription from "../FormElements/FieldDescription/FieldDescription";
import FieldLabel from "../FormElements/FieldLabel/FieldLabel";
import Form from "../FormElements/Form/Form";
import { FormControlLabel } from "../FormElements/Radio/Radio";
import TextField from "../FormElements/TextField/TextField";
import { H6, P } from "../Typography/Typography";
import ErrorLabel from "../ErrorLabel/ErrorLabel";
import { useSelector } from "react-redux";
import { describeServiceOfferingResource } from "../../api/serviceOffering";
import { selectCloudProviders } from "../../slices/providerSlice";
import Select from "../FormElements/Select/Select";
import LoadingSpinnerSmall from "../CircularProgress/CircularProgress";
import Link from "next/link";
import useResourcesInstanceIds from "../../hooks/useResourcesInstanceIds";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function CreateResourceInstanceForm(props) {
  const {
    formData,
    isLoading,
    formCancelClick,
    regions,
    serviceId,
    selectedResourceKey,
    isBYOA,
    downloadTerraformKitMutation,
    setRequestParams,
    cloudProviderAccounts,
    service,
    subscriptionId,
    handleOrgIdModalOpen,
  } = props;

  const [isSchemaLoading, setIsSchemaLoading] = useState(true);
  const [createSchema, setCreateSchema] = useState([]);
  const cloudProviders = useSelector(selectCloudProviders);
  const { isFetching, data: resourceIdInstancesHashMap = {} } =
    useResourcesInstanceIds(
      service?.serviceProviderId,
      service?.serviceURLKey,
      service?.serviceAPIVersion,
      service?.serviceEnvironmentURLKey,
      service?.serviceModelURLKey,
      service?.productTierURLKey,
      service?.resourceParameters,
      subscriptionId
    );

  const regionsFilteredBySelectedProvider = regions.filter(
    (region) => region.cloudProviderName === formData.values.cloud_provider
  );

  useEffect(() => {
    async function getSchema() {
      setIsSchemaLoading(true);
      const schema = await describeServiceOfferingResource(
        serviceId,
        selectedResourceKey.id,
        "none"
      );

      schema.data.apis.forEach((api) => {
        if (api.verb === "CREATE") {
          if (api.inputParameters) {
            let sortedInputParams = [];

            //getting cloud_provider_account_config_id as first item of array if it exists
            sortedInputParams = sortedInputParams.concat(
              api.inputParameters.filter(
                (param) => param.key === "cloud_provider_account_config_id"
              )
            );
            //rest if the items
            sortedInputParams = sortedInputParams.concat(
              api.inputParameters.filter(
                (param) => param.key !== "cloud_provider_account_config_id"
              )
            );

            setCreateSchema(sortedInputParams);
            const createSchemaForDefValue = {};
            api.inputParameters.forEach((kv) => {
              if (kv.defaultValue)
                if (kv.defaultValue === "[]") {
                  createSchemaForDefValue[kv.key] = [];
                } else {
                  createSchemaForDefValue[kv.key] = kv.defaultValue;
                }
              else {
                if (kv.custom) createSchemaForDefValue[kv.key] = "";
              }
            });
            setRequestParams(createSchemaForDefValue);
          }
        }
      });
      setIsSchemaLoading(false);
    }
    getSchema();
  }, []);

  const cloudProviderFieldExists = createSchema.find(
    (field) => field.key === "cloud_provider"
  );
  const networkTypeFieldExists = createSchema.find(
    (field) => field.key === "network_type"
  );
  const regionFieldExists = createSchema.find(
    (field) => field.key === "region"
  );

  if (isSchemaLoading)
    return (
      <Stack alignItems="center" sx={{ mt: "300px" }}>
        <CircularProgress />
      </Stack>
    );

  return (
    <Box sx={{ width: "100%" }}>
      <H6 weight="extrabold" variant="mobile">
        Create {selectedResourceKey.name} Instance
      </H6>
      <P
        weight="semibold"
        sx={{ color: (theme) => theme.palette.neutral[600], fontSize: "14px" }} //mt: "14px"
      >
        Create new Instance of {selectedResourceKey.name}
      </P>

      <Form onSubmit={formData.handleSubmit} sx={{ width: "100%" }}>
        {/* {isBYOA && (
          <>
            <FieldDescription sx={{ mt: "24px", minHeight: "40px" }}>
              {downloadTerraformKitMutation.isLoading ? (
                <Stack
                  mt="8px"
                  direction="row"
                  alignItems="center"
                  fontSize={12}
                >
                  Downloading Terraform. Please wait..{" "}
                  <LoadingSpinnerSmall
                    sx={{ color: "black", ml: "16px" }}
                    size={12}
                  />
                </Stack>
              ) : (
                <Box>
                  <Box
                    sx={{
                      textDecoration: "underline",
                      color: "blue",
                      marginRight: "6px",
                      cursor: "pointer",
                    }}
                    component="span"
                    onClick={() => {
                      downloadTerraformKitMutation.mutate();
                    }}
                  >
                    Click here
                  </Box>
                  to download the terraform kit to configure Role/Service
                  Account access
                </Box>
              )}
            </FieldDescription>
            <FieldDescription sx={{ mt: "8px" }}>
              <Link
                style={{
                  textDecoration: "underline",
                  color: "blue",
                }}
                href="https://www.youtube.com/watch?v=xLjrQOiT1Y0&ab_channel=Omnistrate"
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch this video
              </Link>{" "}
              to learn how to setup BYOA
            </FieldDescription>
          </>
        )} */}

        {cloudProviderFieldExists && (
          <FieldContainer>
            <FieldLabel required>Cloud Provider</FieldLabel>
            <FieldDescription sx={{ mt: "5px" }}>
              Cloud Provider
            </FieldDescription>
            <TextField
              select
              id="cloud_provider"
              name="cloud_provider"
              value={formData.values.cloud_provider}
              onChange={formData.handleChange}
              sx={{ marginTop: "16px" }}
            >
              {cloudProviders.map((option) => (
                <MenuItem
                  key={option.name.toLowerCase()}
                  value={option.name.toLowerCase()}
                >
                  {option.description}
                </MenuItem>
              ))}
            </TextField>
            <ErrorLabel>
              {formData.touched.cloud_provider &&
                formData.errors.cloud_provider}
            </ErrorLabel>
          </FieldContainer>
        )}
        {networkTypeFieldExists && (
          <FieldContainer>
            <FieldLabel required>Network Type</FieldLabel>
            <FieldDescription sx={{ mt: "5px" }}>
              Type of Network
            </FieldDescription>
            <TextField
              select
              id="network_type"
              name="network_type"
              value={formData.values.network_type}
              onChange={formData.handleChange}
              sx={{ marginTop: "16px" }}
            >
              {["PUBLIC"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <ErrorLabel>
              {formData.touched.network_type && formData.errors.network_type}
            </ErrorLabel>
          </FieldContainer>
        )}
        {regionFieldExists && (
          <FieldContainer>
            <FieldLabel required>Region</FieldLabel>
            <Select
              sx={{ marginTop: "16px" }}
              id="region"
              name="region"
              displayEmpty
              /*multiple*/
              value={formData.values.region}
              onChange={formData.handleChange}
              input={<OutlinedInput />}
            >
              <MenuItem disabled value="">
                <em>None</em>
              </MenuItem>
              {[...regionsFilteredBySelectedProvider]
                .sort(function (a, b) {
                  if (a.code < b.code) return -1;
                  else if (a.code > b.code) {
                    return 1;
                  }
                  return -1;
                })
                .map((region) => (
                  <MenuItem key={region.code} value={region.code}>
                    {region.cloudProviderName} - {region.code}
                  </MenuItem>
                ))}
            </Select>
            <ErrorLabel></ErrorLabel>
          </FieldContainer>
        )}

        <Box mt={isBYOA ? 2 : 4}>
          {createSchema.filter((param) => param.custom === true).length > 0 ? (
            <FieldLabel>Request Parameters</FieldLabel>
          ) : (
            ""
          )}
          {createSchema.map((param) => {
            if (isBYOA && param.key === "aws_bootstrap_role_arn") {
              return null;
            }
            if (param.key === "cloud_provider_account_config_id") {
              return (
                <FieldContainer key={param.key}>
                  {param.required == true ? (
                    <FieldLabel required>{param.displayName}</FieldLabel>
                  ) : (
                    <FieldLabel>{param.displayName}</FieldLabel>
                  )}
                  <FieldDescription sx={{ mt: "5px" }}>
                    {param.description}
                  </FieldDescription>
                  <Select
                    sx={{ display: "block", marginTop: "16px" }}
                    id={`requestParams.${param.key}`}
                    name={`requestParams.${param.key}`}
                    onChange={formData.handleChange}
                    values={formData.values.requestParams[param.key]}
                    input={<OutlinedInput />}
                  >
                    <MenuItem disabled value="">
                      <em>None</em>
                    </MenuItem>

                    {[...cloudProviderAccounts]
                      ?.filter(
                        (obj) => obj.type === formData.values.cloud_provider
                      )
                      .map(
                        (cloudProviderAccount) =>
                          cloudProviderAccount.type ===
                            formData.values.cloud_provider && (
                            <MenuItem
                              key={cloudProviderAccount.id}
                              value={cloudProviderAccount.id}
                            >
                              {cloudProviderAccount.id}
                            </MenuItem>
                          )
                      )}
                  </Select>
                </FieldContainer>
              );
            } else {
              if (param.custom === true && param.dependentResourceID) {
                const dependentResourceId = param.dependentResourceID;
                const options = resourceIdInstancesHashMap[dependentResourceId]
                  ? resourceIdInstancesHashMap[dependentResourceId]
                  : [];
                return (
                  <FieldContainer key={param.key}>
                    {param.required == true ? (
                      <FieldLabel required>{param.displayName}</FieldLabel>
                    ) : (
                      <FieldLabel>{param.displayName}</FieldLabel>
                    )}
                    <FieldDescription sx={{ mt: "5px" }}>
                      {param.description}
                    </FieldDescription>
                    <Select
                      isLoading={isFetching}
                      fullWidth
                      MenuProps={MenuProps}
                      id={`requestParams.${param.key}`}
                      name={`requestParams.${param.key}`}
                      value={
                        formData.values.requestParams[param.key]
                          ? formData.values.requestParams[param.key]
                          : []
                      }
                      displayEmpty
                      onChange={formData.handleChange}
                      modifiable={param.modifiable}
                      sx={{ marginTop: "16px" }}
                      required={param.required == true ? "required" : ""}
                    >
                      <MenuItem value={""} disabled={param.required}>
                        None
                      </MenuItem>
                      {options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FieldContainer>
                );
              }
              if (param.custom == true && param.type == "Boolean") {
                return (
                  <FieldContainer key={param.key}>
                    {param.required == true ? (
                      <FieldLabel required>{param.displayName}</FieldLabel>
                    ) : (
                      <FieldLabel>{param.displayName}</FieldLabel>
                    )}
                    <FieldDescription sx={{ mt: "5px" }}>
                      {param.description}
                    </FieldDescription>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      id={`requestParams.${param.key}`}
                      name={`requestParams.${param.key}`}
                      value={
                        formData.values.requestParams[param.key]
                          ? formData.values.requestParams[param.key]
                          : "false"
                      }
                      onChange={formData.handleChange}
                      sx={{ marginTop: "16px" }}
                      modifiable={param.modifiable}
                      required={param.required == true ? "required" : ""}
                    >
                      <FormControlLabel
                        value={"true"}
                        control={<Radio />}
                        label="True"
                      />
                      <FormControlLabel
                        value={"false"}
                        control={<Radio />}
                        label="False"
                      />
                    </RadioGroup>
                  </FieldContainer>
                );
              } else if (
                param.custom == true &&
                param.options !== undefined &&
                param.isList === true
              ) {
                const options = param.options ? param.options : [""];
                return (
                  <FieldContainer key={param.key}>
                    {param.required == true ? (
                      <FieldLabel required>{param.displayName}</FieldLabel>
                    ) : (
                      <FieldLabel>{param.displayName}</FieldLabel>
                    )}
                    {/* <FieldLabel>{param.displayName}</FieldLabel> */}
                    <FieldDescription sx={{ mt: "5px" }}>
                      {param.description}
                    </FieldDescription>
                    <Select
                      multiple
                      fullWidth
                      MenuProps={MenuProps}
                      id={`requestParams.${param.key}`}
                      name={`requestParams.${param.key}`}
                      value={
                        formData.values.requestParams[param.key]
                          ? formData.values.requestParams[param.key]
                          : []
                      }
                      renderValue={(selectedList) => {
                        if (selectedList.length === 0) {
                          return <em>None</em>;
                        }
                        const plist = selectedList
                          .map((valInList) => {
                            const returnVal = formData.values.requestParams[
                              param.key
                            ].find((val) => {
                              return val === valInList;
                            });
                            return returnVal;
                          })
                          .join(", ");
                        return (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {plist.split(",").map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        );
                      }}
                      onChange={formData.handleChange}
                      modifiable={param.modifiable}
                      sx={{ marginTop: "16px" }}
                      required={param.required == true ? "required" : ""}
                    >
                      {options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FieldContainer>
                );
              } else if (
                param.custom == true &&
                param.options !== undefined &&
                param.isList === false
              ) {
                const options = param.options ? param.options : [""];
                return (
                  <FieldContainer key={param.key}>
                    {param.required == true ? (
                      <FieldLabel required>{param.displayName}</FieldLabel>
                    ) : (
                      <FieldLabel>{param.displayName}</FieldLabel>
                    )}
                    <FieldDescription sx={{ mt: "5px" }}>
                      {param.description}
                    </FieldDescription>
                    <Select
                      fullWidth
                      MenuProps={MenuProps}
                      id={`requestParams.${param.key}`}
                      name={`requestParams.${param.key}`}
                      value={
                        formData.values.requestParams[param.key]
                          ? formData.values.requestParams[param.key]
                          : []
                      }
                      renderValue={(selectedVal) => {
                        return (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {<Chip key={selectedVal} label={selectedVal} />}
                          </Box>
                        );
                      }}
                      onChange={formData.handleChange}
                      modifiable={param.modifiable}
                      sx={{ marginTop: "16px" }}
                      required={param.required == true ? "required" : ""}
                    >
                      {options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FieldContainer>
                );
              } else if (param.custom == true) {
                return (
                  <FieldContainer key={param.key}>
                    {param.required == true ? (
                      <FieldLabel required>{param.displayName}</FieldLabel>
                    ) : (
                      <FieldLabel>{param.displayName}</FieldLabel>
                    )}
                    <FieldDescription sx={{ mt: "5px" }}>
                      {param.description}
                    </FieldDescription>
                    <TextField
                      id={`requestParams.${param.key}`}
                      name={`requestParams.${param.key}`}
                      value={formData.values.requestParams[param.key]}
                      onChange={formData.handleChange}
                      sx={{ marginTop: "16px" }}
                      modifiable={param.modifiable}
                      required={param.required == true ? "required" : ""}
                    ></TextField>
                  </FieldContainer>
                );
              }
            }
          })}
        </Box>

        <Box display="flex" justifyContent="flex-end" gap="10px" mt="40px">
          <Button
            variant="contained"
            size="xsmall"
            bgColor="white"
            fontColor="black"
            sx={{ border: " 1px solid #D1D5DB" }}
            onClick={formCancelClick}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="xsmall"
            type="submit"
            disabled={isLoading}
          >
            Create {selectedResourceKey.name} Instance{" "}
            {isLoading && (
              <CircularProgress size={16} sx={{ marginLeft: "8px" }} />
            )}
          </Button>
        </Box>
      </Form>
    </Box>
  );
}

export default CreateResourceInstanceForm;
