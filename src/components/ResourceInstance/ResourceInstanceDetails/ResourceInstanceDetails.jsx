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
import { PasswordWithOutBorderField } from "src/components/FormElementsv2/PasswordField/PasswordWithOutBorderField";
import {
  checkCustomerOmnistrateLogsExist,
  checkCustomerOmnistrateMetricsExist,
  getCustomerNonOmnistrateLogs,
  getCustomerNonOmnistrateMetrics,
} from "src/utils/constants/productTierFeatures";

function ResourceInstanceDetails(props) {
  const {
    resourceInstanceId,
    resultParameters = {},
    isLoading,
    resultParametersSchema = [],
    createdAt,
    modifiedAt,

    productTierFeatures,
  } = props;
  //   console.log("Result parameters", resultParameters);
  //   console.log("Result parameters schema", resultParametersSchema);

  const resultParametersWithDescription = Object.keys(resultParameters)
    .map((key) => {
      const match = resultParametersSchema.find((param) => param.key === key);
      return {
        ...match,
        value: resultParameters[key],
        key,
      };
    })
    .filter((param) => {
      return ![
        "availability_zones",
        "cluster_endpoint",
        "node_endpoints",
        "private_network_cidr",
        "private_network_id",
      ].includes(param.key);
    });

  const nonOmnistrateCustomerLogs = useMemo(() => {
    if (productTierFeatures) {
      const result = [];
      const omnistrateLogsExist =
        checkCustomerOmnistrateLogsExist(productTierFeatures);

      //only when omnistrate logs doesn't exist show other providers in this tab
      if (!omnistrateLogsExist) {
        result.push(...getCustomerNonOmnistrateLogs(productTierFeatures));
      }

      return result;
    }
  }, [productTierFeatures]);

  const nonOmnistrateCustomerMetrics = useMemo(() => {
    if (productTierFeatures) {
      const result = [];
      const omnistrateMetricsExist =
        checkCustomerOmnistrateMetricsExist(productTierFeatures);

      //only when omnistrate metrics doesn't exist show other providers in this tab
      if (!omnistrateMetricsExist) {
        result.push(...getCustomerNonOmnistrateMetrics(productTierFeatures));
      }

      return result;
    }
  }, [productTierFeatures]);

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
        mt: "54px",
      }}
    >
      <Table>
        <TableBody>
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
              <CellTitle>Created At</CellTitle>
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
              <CellTitle>Modified At</CellTitle>
            </TableCell>
            <TableCell
              align="right"
              sx={{ width: "50%", verticalAlign: "baseline" }}
            >
              <CellDescription>{formatDateUTC(modifiedAt)}</CellDescription>
            </TableCell>
          </TableRow>

          {nonOmnistrateCustomerMetrics.length > 0 && (
            <TableRow>
              <TableCell sx={{ verticalAlign: "baseline" }}>
                <CellTitle>Metrics</CellTitle>
              </TableCell>
              <TableCell
                align="right"
                sx={{ width: "50%", verticalAlign: "baseline" }}
              >
                <Stack direction={"row"} justifyContent={"flex-end"}>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems={"center"}
                    gap={"8px"}
                  >
                    <CellDescription>{"www.endpoint.com"}</CellDescription>
                  </Stack>
                </Stack>
              </TableCell>
            </TableRow>
          )}

          {nonOmnistrateCustomerLogs.length > 0 && (
            <TableRow>
              <TableCell sx={{ verticalAlign: "baseline" }}>
                <CellTitle>Logs</CellTitle>
              </TableCell>
              <TableCell
                align="right"
                sx={{ width: "50%", verticalAlign: "baseline" }}
              >
                <Stack direction={"row"} justifyContent={"flex-end"}>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems={"center"}
                    gap={"8px"}
                  >
                    <CellDescription>{"www.endpoint.com"}</CellDescription>
                  </Stack>
                </Stack>
              </TableCell>
            </TableRow>
          )}

          {resultParametersWithDescription.map((parameter, index) => {
            if (parameter.type === "Password") {
              return (
                <TableRow key={parameter.key} sx={{ width: "100%" }}>
                  <TableCell sx={{ verticalAlign: "baseline" }}>
                    <CellTitle>
                      {capitalize(parameter.displayName) || parameter.key}
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
                <TableRow key={parameter.key}>
                  <TableCell sx={{ verticalAlign: "baseline" }}>
                    <CellTitle>
                      {capitalize(parameter.displayName) || parameter.key}
                    </CellTitle>
                    <CellSubtext>{parameter.description}</CellSubtext>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ width: "50%", verticalAlign: "baseline" }}
                  >
                    <CellDescription
                      sx={{
                        wordBreak: "break-word",
                        paddingLeft: "30px",
                      }}
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
