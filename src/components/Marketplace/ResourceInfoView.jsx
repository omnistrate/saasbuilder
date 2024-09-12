import { Box } from "@mui/material";
import React from "react";
import FieldContainer from "../FormElements/FieldContainer/FieldContainer";
import FieldDescription from "../FormElements/FieldDescription/FieldDescription";
import FieldLabel from "../FormElements/FieldLabel/FieldLabel";
import TextField from "../FormElements/TextField/TextField";
import formatDateUTC from "../../utils/formatDateUTC";
import FormTitle from "../FormElements/FormTitle/FormTitle";
import FormDescription from "../FormElements/FormDescription/FormDescription";

function ResourceInfoView(props) {
  const { data, serviceName } = props;

  const objects = Object.entries(data.result_params).map((param) => {
    return { key: param[0], val: param[1] };
  });
  let viewAPIOutputParams = [];
  data.schema.apis.forEach((api) => {
    if (api.verb === "DESCRIBE") {
      viewAPIOutputParams = api.outputParameters;
    }
  });

  const viewParams = [];
  objects.forEach((obj) => {
    const result = viewAPIOutputParams.find(
      (attribute) => attribute.key === obj.key && attribute.custom == true
    );
    if (result) {
      obj = { ...result, ...obj };
      viewParams.push(obj);
    }
  });
  return (
    <>
      <FormTitle>Details</FormTitle>
      <FormDescription>{serviceName} Instance Details</FormDescription>
      <>
        <FieldContainer>
          <FieldLabel>ID</FieldLabel>
          <FieldDescription sx={{ mt: "5px" }}>
            unique id of resource instance
          </FieldDescription>
          <TextField
            id="id"
            disabled
            copyButton
            name="id"
            sx={{
              marginTop: "5px",
              fontSize: "14px",
              color: "black",
              cursor: "default",
              caretColor: "transparent",
            }}
            value={data.id}
          />
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>Cloud Provider</FieldLabel>
          <FieldDescription sx={{ mt: "5px" }}>
            Cloud Provider of resource instance
          </FieldDescription>
          <TextField
            id="cloud_provider"
            name="cloud_provider"
            disabled
            copyButton
            value={data.cloud_provider}
            sx={{ marginTop: "16px" }}
          />
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>Region</FieldLabel>
          <FieldDescription sx={{ mt: "5px" }}>Region</FieldDescription>
          <TextField
            id="id"
            name="id"
            disabled
            copyButton
            value={data.region}
            sx={{
              marginTop: "16px",
              cursor: "default",
              caretColor: "transparent",
            }}
          />
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>Network Type</FieldLabel>
          <FieldDescription sx={{ mt: "5px" }}>
            Type of Network
          </FieldDescription>
          <TextField
            id="network_type"
            name="network_type"
            disabled
            copyButton
            value={data.network_type}
            sx={{ marginTop: "16px" }}
          />
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>Status</FieldLabel>
          <FieldDescription sx={{ mt: "5px" }}>
            current status of instance
          </FieldDescription>
          <TextField
            id="status"
            name="status"
            disabled
            copyButton
            sx={{
              marginTop: "5px",
              cursor: "default",
              caretColor: "transparent",
            }}
            value={data.status}
          />
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>Created On</FieldLabel>
          <FieldDescription sx={{ mt: "5px" }}>Created On</FieldDescription>
          <TextField
            id="created_at"
            name="created_at"
            disabled
            copyButton
            sx={{
              marginTop: "5px",
              fontSize: "14px",
              cursor: "default",
              caretColor: "transparent",
            }}
            value={formatDateUTC(data.created_at)}
          />
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>Modified At</FieldLabel>
          <FieldDescription sx={{ mt: "5px" }}>
            Last modified at
          </FieldDescription>
          <TextField
            id="last_modified_at"
            name="last_modified_at"
            disabled
            copyButton
            sx={{
              marginTop: "5px",
              fontSize: "14px",
              cursor: "default",
              caretColor: "transparent",
            }}
            value={formatDateUTC(data.last_modified_at)}
          />
        </FieldContainer>
        <Box mt={5}>
          {viewParams.length > 0 ? (
            <FieldLabel>
              <b>Result Parameters</b>
            </FieldLabel>
          ) : (
            ""
          )}
          {viewParams.map((param) => {
            return (
              <FieldContainer key={param.key}>
                <FieldLabel>{param.displayName}</FieldLabel>
                <FieldDescription sx={{ mt: "5px" }}>
                  {param.description}
                </FieldDescription>
                <TextField
                  id={param.key}
                  name={param.key}
                  disabled
                  value={param.val}
                  sx={{ marginTop: "16px" }}
                  copyButton
                />
              </FieldContainer>
            );
          })}
        </Box>
      </>
    </>
  );
}

export default ResourceInfoView;
