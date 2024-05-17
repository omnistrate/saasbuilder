import { Box } from "@mui/material";
import {
  CellDescription,
  CellSubtext,
  CellTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "../../InfoTable/InfoTable";
import formatDateUTC from "../../../utils/formatDateUTC";
import React, { useMemo } from "react";
import capitalize from "lodash/capitalize";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import { getTerraformKitURL } from "src/api/resourceInstance";
import { baseURL } from "src/axios";
import { PasswordWithOutBorderField } from "src/components/FormElementsv2/PasswordField/PasswordWithOutBorderField";

function ResourceInstanceDetails(props) {
  const {
    resourceInstanceId,
    resultParameters = {},
    isLoading,
    resultParametersSchema = [],
    createdAt,
    modifiedAt,
    subscriptionId,
    serviceOffering,

  } = props;

  const isResourceBYOA =
    resultParameters.gcp_project_id || resultParameters.aws_account_id;

  const resultParametersWithDescription = useMemo(() => {
    const result = Object.keys(resultParameters)
      .map((key) => {
        const match = resultParametersSchema.find((param) => param.key === key);
        return {
          ...match,
          value: resultParameters[key],
          key,
        };
      })
      .filter((param) => {
        const filterArr = [
          "availability_zones",
          "cluster_endpoint",
          "node_endpoints",
          "private_network_cidr",
          "private_network_id",
        ];

        if (isResourceBYOA) {
          if (resultParameters.cloud_provider === "aws") {
            filterArr.push(
              ...[
                "gcp_project_id",
                "gcp_project_number",
                "gcp_service_account_email",
              ]
            );
          } else if (resultParameters.cloud_provider === "gcp") {
            filterArr.push(...["aws_account_id", "aws_bootstrap_role_arn"]);
          }

          if (resultParameters.account_configuration_method === "Terraform") {
            filterArr.push("cloudformation_url");
          }
        }

        return !filterArr.includes(param.key);
      });

    if (resultParameters.account_configuration_method === "Terraform") {
      result.push({
        key: "terraform_url",
        displayName: "Terraform URL",
        description:
          "Terraform Kit URL to configure access to an AWS/GCP account.",
        type: "String",
        isList: false,
        custom: true,
        value: `${baseURL}${getTerraformKitURL(
          serviceOffering?.serviceProviderId,
          serviceOffering?.serviceURLKey,
          serviceOffering?.serviceAPIVersion,
          serviceOffering?.serviceEnvironmentURLKey,
          serviceOffering?.serviceModelURLKey,
          subscriptionId,
          resultParameters?.cloud_provider
        )}`,
      });
    }

    return result;
  }, [
    isResourceBYOA,
    resultParameters,
    resultParametersSchema,
    serviceOffering,
    subscriptionId,
  ]);

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          mt: "54px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <TableContainer
      sx={{
        mt: "24px",
      }}
    >
      <Table sx={{ width: "100%" }}>
        <TableBody sx={{ width: "100%" }}>
          <TableRow>
            <TableCell sx={{ verticalAlign: "baseline" }}>
              <CellTitle>Instance ID </CellTitle>
            </TableCell>
            <TableCell
              align="right"
              sx={{ width: "50%", verticalAlign: "baseline" }}
            >
              <CellDescription>{resourceInstanceId}</CellDescription>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ verticalAlign: "baseline" }}>
              <CellTitle>Created at</CellTitle>
            </TableCell>
            <TableCell
              align="right"
              sx={{ width: "50%", verticalAlign: "baseline" }}
            >
              <CellDescription>{formatDateUTC(createdAt)}</CellDescription>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ verticalAlign: "baseline" }}>
              <CellTitle>Modified at</CellTitle>
            </TableCell>
            <TableCell
              align="right"
              sx={{ width: "50%", verticalAlign: "baseline" }}
            >
              <CellDescription>{formatDateUTC(modifiedAt)}</CellDescription>
            </TableCell>
          </TableRow>

          {resultParametersWithDescription.map((parameter, index) => {
            const displayName = parameter.displayName;
            if (parameter.type === "Password") {
              return (
                <TableRow key={parameter.key} sx={{ width: "100%" }}>
                  <TableCell sx={{ verticalAlign: "baseline" }}>
                    <CellTitle>
                      {capitalize(displayName) || parameter.key}
                    </CellTitle>
                    <CellSubtext>{parameter.description}</CellSubtext>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ width: "50%", verticalAlign: "baseline" }}
                  >
                    <PasswordWithOutBorderField>
                      {parameter.value}
                    </PasswordWithOutBorderField>
                  </TableCell>
                </TableRow>
              );
            } else {
              return (
                <TableRow key={parameter.key} sx={{ width: "100%" }}>
                  <TableCell sx={{ verticalAlign: "baseline" }}>
                    <CellTitle>
                      {capitalize(displayName) || parameter.key}
                    </CellTitle>
                    <CellSubtext>{parameter.description}</CellSubtext>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ width: "50%", verticalAlign: "baseline" }}
                  >
                    <CellDescription
                      sx={{ wordBreak: "break-word", paddingLeft: "30px" }}
                    >
                      {parameter.value}
                    </CellDescription>
                  </TableCell>
                </TableRow>
              );
            }
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ResourceInstanceDetails;
