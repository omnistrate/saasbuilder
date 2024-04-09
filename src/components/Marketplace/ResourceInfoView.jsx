import { Box, CircularProgress, Hidden, MenuItem, styled } from "@mui/material";
import React, { createContext, useEffect, useState } from "react";
import Button from "../Button/Button";
import FieldContainer from "../FormElements/FieldContainer/FieldContainer";
import FieldDescription from "../FormElements/FieldDescription/FieldDescription";
import FieldLabel from "../FormElements/FieldLabel/FieldLabel";
import Form from "../FormElements/Form/Form";
import { FormControlLabel } from "../FormElements/Radio/Radio";
import TextField from "../FormElements/TextField/TextField";
import { H6, P } from "../Typography/Typography";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import { format } from "date-fns";
import CalendarIcon from "../CalendarIcon/CalendarIcon";
import { padding } from "@mui/system";
import ErrorLabel from "../ErrorLabel/ErrorLabel";
import formatDateLocal from "../../utils/formatDateLocal";

function ResourceInfoView(props) {
  const { data, serviceName } = props;
  const { isLoading, setIsLoading } = useState(false);

  const objects = Object.entries(data.result_params).map((param) => {
    return { key: param[0], val: param[1] };
  });
  var viewAPIOutputParams = [];
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
      <H6 weight="extrabold" variant="mobile">
        Details
      </H6>
      <P
        weight="semibold"
        sx={{ color: (theme) => theme.palette.neutral[600], mt: "14px" }}
      >
        {serviceName} Instance Details
      </P>
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
          ></TextField>
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
          ></TextField>
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
          ></TextField>
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
          ></TextField>
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
          ></TextField>
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
            value={formatDateLocal(data.created_at)}
          ></TextField>
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
            value={formatDateLocal(data.last_modified_at)}
          ></TextField>
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
                ></TextField>
              </FieldContainer>
            );
          })}
        </Box>
      </>
    </>
  );
}

export default ResourceInfoView;
