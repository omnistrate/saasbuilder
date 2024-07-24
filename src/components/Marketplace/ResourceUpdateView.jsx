import {
  Box,
  Chip,
  CircularProgress,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../Button/Button";
import FieldContainer from "../FormElements/FieldContainer/FieldContainer";
import FieldDescription from "../FormElements/FieldDescription/FieldDescription";
import FieldLabel from "../FormElements/FieldLabel/FieldLabel";
import Form from "../FormElements/Form/Form";
import { FormControlLabel } from "../FormElements/Radio/Radio";
import TextField from "../FormElements/TextField/TextField";
import { H6, P } from "../Typography/Typography";
import ErrorLabel from "../ErrorLabel/ErrorLabel";
import { describeServiceOfferingResource } from "../../api/serviceOffering";
import Select from "../FormElements/Select/Select";
import useAvailabilityZone from "src/hooks/query/useAvailabilityZone";
import { PasswordField } from "../FormElementsv2/PasswordField/PasswordField";
import { cloudProviderLabels } from "src/constants/cloudProviders";

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
function ResourceUpdateView(props) {
  const {
    serviceId,
    selectedResourceKey,
    serviceName,
    formCancelClick,
    formData,
    regions,
    isLoading,
    isCurrentResourceBYOA,
  } = props;

  const [viewParams, setCreateSchema] = useState([]);

  const [nonModifiableviewParams, setNonModifiableParamsSchema] = useState([]);

  const shouldDisableEdit = useMemo(() => {
    const editableFieds = viewParams?.filter((param) => param?.custom);
    if (editableFieds?.length > 0) {
      return false;
    } else {
      return true;
    }
  }, [viewParams]);

  useEffect(() => {
    async function getSchema() {
      const schema = await describeServiceOfferingResource(
        serviceId,
        selectedResourceKey.id,
        formData.values.id
      );

      schema.data.apis.forEach((api) => {
        if (api.verb === "UPDATE") {
          if (api.inputParameters?.length > 0) {
            setCreateSchema(
              api.inputParameters?.filter((item) => item?.modifiable)
            );
          }
        } else if (api.verb === "CREATE") {
          let filteredInputParams = api.inputParameters?.filter(
            (item) => item?.custom && !item?.modifiable
          );
          if (filteredInputParams?.length) {
            setNonModifiableParamsSchema(filteredInputParams);
          }
        }
      });
    }
    getSchema();
  }, []);

  const shouldShowParamField = useCallback(
    (paramKey) => {
      if (
        paramKey === "aws_bootstrap_role_arn" ||
        paramKey === "account_configuration_method" ||
        paramKey === "gcp_service_account_email"
      ) {
        return false;
      }

      // formData.values.cloud_provider can be 'aws', 'gcp' or 'azure'. Field names with same prefix must be shown
      if (
        formData.values.cloud_provider &&
        paramKey.startsWith(formData.values.cloud_provider)
      ) {
        return true;
      }
      return false;
    },
    [formData.values.cloud_provider]
  );

  const customAvailabilityZoneQuery = useAvailabilityZone(
    formData.values.region,
    formData.values.cloud_provider
  );

  const {
    data: customAvailabilityZoneData,
    isLoading: isLoadingCustomAvailabilityZone,
  } = customAvailabilityZoneQuery;

  const customAvailabilityZone = useMemo(() => {
    const availabilityZones = customAvailabilityZoneData?.availabilityZones;
    return availabilityZones?.sort(function (a, b) {
      if (a.code < b.code) return -1;
      else if (a.code > b.code) {
        return 1;
      }
      return -1;
    });
  }, [
    isLoadingCustomAvailabilityZone,
    customAvailabilityZoneData?.availabilityZones,
  ]);

  return (
    <>
      <H6 weight="extrabold" variant="mobile">
        Update {serviceName}
      </H6>
      <P
        weight="semibold"
        sx={{ color: (theme) => theme.palette.neutral[600], mt: "14px" }}
      >
        {serviceName} Instance Details
      </P>
      <Form onSubmit={formData.handleSubmit}>
        <>
          <FieldContainer>
            <FieldLabel>ID</FieldLabel>
            <FieldDescription sx={{ mt: "5px" }}>
              unique id of resource instance
            </FieldDescription>
            <TextField
              id="id"
              disabled="true"
              name="id"
              sx={{
                marginTop: "5px",
                fontSize: "14px",
                color: "black",
                cursor: "default",
                caretColor: "transparent",
              }}
              value={formData.values.id}
            />
          </FieldContainer>
          {(isCurrentResourceBYOA || formData.values.cloud_provider) && (
            <FieldContainer>
              <FieldLabel>Cloud Provider</FieldLabel>
              <FieldDescription sx={{ mt: "5px" }}>
                Cloud Provider of resource instance
              </FieldDescription>
              <TextField
                id="cloud_provider"
                name="cloud_provider"
                disabled="true"
                value={
                  cloudProviderLabels[formData.values.cloud_provider] ||
                  formData.values.cloud_provider
                }
                sx={{ marginTop: "16px" }}
              />
            </FieldContainer>
          )}
          {!isCurrentResourceBYOA && (
            <>
              {formData.values.region && (
                <FieldContainer>
                  <FieldLabel required>Region</FieldLabel>
                  <Select
                    sx={{ marginTop: "16px" }}
                    id="region"
                    name="region"
                    disabled="true"
                    displayEmpty
                    /*multiple*/
                    value={formData.values.region}
                    // value={formData.values.region}
                    onChange={formData.handleChange}
                    input={<OutlinedInput />}
                  >
                    <MenuItem disabled value="">
                      <em>None</em>
                    </MenuItem>
                    {regions[formData.values.cloud_provider]?.map((region) => (
                      <MenuItem key={region} value={region}>
                        {formData.values.cloud_provider} - {region}
                      </MenuItem>
                    ))}
                  </Select>
                  <ErrorLabel></ErrorLabel>
                </FieldContainer>
              )}
              {formData.values.requestParams?.custom_availability_zone && (
                <FieldContainer>
                  <FieldLabel required>Custom Availability Zone</FieldLabel>
                  <Select
                    sx={{ marginTop: "16px" }}
                    id="requestParams.custom_availability_zone"
                    name="requestParams.custom_availability_zone"
                    disabled="true"
                    displayEmpty
                    /*multiple*/
                    value={
                      formData.values?.requestParams?.custom_availability_zone
                    }
                    onChange={formData.handleChange}
                    input={<OutlinedInput />}
                  >
                    <MenuItem disabled value="">
                      <em>None</em>
                    </MenuItem>
                    {customAvailabilityZone?.map((region) => (
                      <MenuItem key={region.code} value={region.code}>
                        {region.cloudProviderName} - {region.code}
                      </MenuItem>
                    ))}
                  </Select>
                </FieldContainer>
              )}
              {formData.values.network_type && (
                <FieldContainer>
                  <FieldLabel>Network Type</FieldLabel>
                  <FieldDescription sx={{ mt: "5px" }}>
                    Type of Network
                  </FieldDescription>
                  <Select
                    id="network_type"
                    name="network_type"
                    disabled="true"
                    value={formData.values.network_type}
                    onChange={formData.handleChange}
                    sx={{ marginTop: "16px" }}
                  >
                    {["PUBLIC"].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  <ErrorLabel>
                    {formData.touched.network_type &&
                      formData.errors.network_type}
                  </ErrorLabel>
                </FieldContainer>
              )}
            </>
          )}

          <Box mt={5}>
            {viewParams.filter(
              (param) =>
                param.custom === true &&
                param.key !== "custom_availability_zone"
            ).length > 0 ? (
              <FieldLabel>
                <b>Result Parameters</b>
              </FieldLabel>
            ) : (
              ""
            )}
            {viewParams.map((param) => {
              if (isCurrentResourceBYOA && !shouldShowParamField(param.key)) {
                return null;
              }

              if (param.type === "Password") {
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
                    <PasswordField
                      sx={{ color: "#FFF" }}
                      id={`requestParams.${param.key}`}
                      name={`requestParams.${param.key}`}
                      onChange={formData.handleChange}
                      values={formData.values.requestParams[param.key]}
                      onBlur={formData.handleBlur}
                      required={param.required == true ? "required" : ""}
                    />
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
                      value={formData.values.requestParams[param.key]}
                      onChange={formData.handleChange}
                      sx={{ marginTop: "16px" }}
                      //modifiable={param.modifiable}
                      required={param.required == true ? "required" : ""}
                    >
                      <FormControlLabel
                        value={true}
                        control={<Radio />}
                        label="True"
                      />
                      <FormControlLabel
                        value={false}
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
                    <FieldDescription sx={{ mt: "5px" }}>
                      {param.description}
                    </FieldDescription>
                    <Select
                      multiple
                      fullWidth
                      sx={{ display: "block", marginTop: "16px" }}
                      id={`requestParams.${param.key}`}
                      name={`requestParams.${param.key}`}
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
                      value={formData.values.requestParams[param.key] || []}
                      onChange={formData.handleChange}
                      //modifiable={param.modifiable}
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
                      value={formData.values.requestParams[param.key] || []}
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
                    />
                  </FieldContainer>
                );
              }
            })}

            {/* show non modifiable params in disabled mode */}
            {nonModifiableviewParams.map((param) => {
              if (isCurrentResourceBYOA && !shouldShowParamField(param.key)) {
                return null;
              }

              if (param.key !== "custom_availability_zone") {
                if (param.type === "Password") {
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
                      <PasswordField
                        sx={{ color: "#FFF" }}
                        id={`requestParams.${param.key}`}
                        name={`requestParams.${param.key}`}
                        onChange={formData.handleChange}
                        values={formData.values.requestParams[param.key]}
                        onBlur={formData.handleBlur}
                        required={param.required == true ? "required" : ""}
                      />
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
                        value={formData.values.requestParams[param.key]}
                        onChange={formData.handleChange}
                        sx={{ marginTop: "16px" }}
                        //modifiable={param.modifiable}
                        required={param.required == true ? "required" : ""}
                        disabled
                      >
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="True"
                          disabled
                        />
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="True"
                          disabled
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="False"
                          disabled
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
                      <FieldDescription sx={{ mt: "5px" }}>
                        {param.description}
                      </FieldDescription>
                      <Select
                        disabled
                        multiple
                        fullWidth
                        sx={{ display: "block", marginTop: "16px" }}
                        id={`requestParams.${param.key}`}
                        name={`requestParams.${param.key}`}
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
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {plist.split(",").map((value) => (
                                <Chip key={value} label={value} />
                              ))}
                            </Box>
                          );
                        }}
                        value={formData.values.requestParams[param.key] || []}
                        onChange={formData.handleChange}
                        //modifiable={param.modifiable}
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
                        disabled
                        fullWidth
                        MenuProps={MenuProps}
                        id={`requestParams.${param.key}`}
                        name={`requestParams.${param.key}`}
                        value={formData.values.requestParams[param.key] || []}
                        renderValue={(selectedVal) => {
                          return (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
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
                        disabled
                        id={`requestParams.${param.key}`}
                        name={`requestParams.${param.key}`}
                        value={formData.values.requestParams[param.key]}
                        onChange={formData.handleChange}
                        sx={{ marginTop: "16px" }}
                        modifiable={param.modifiable}
                        required={param.required == true ? "required" : ""}
                      />
                    </FieldContainer>
                  );
                }
              }
            })}
          </Box>
        </>
        {
          <Box display="flex" justifyContent="flex-end" gap="10px" mt="40px">
            <Button
              variant="contained"
              size="xsmall"
              bgColor="white"
              fontColor="black"
              onClick={formCancelClick}
              sx={{ border: " 1px solid #D1D5DB" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="xsmall"
              type="submit"
              disabled={isLoading || shouldDisableEdit}
            >
              Update {serviceName} Instance{" "}
              {isLoading && (
                <CircularProgress size={16} sx={{ marginLeft: "8px" }} />
              )}
            </Button>
          </Box>
        }
      </Form>
    </>
  );
}

export default ResourceUpdateView;
