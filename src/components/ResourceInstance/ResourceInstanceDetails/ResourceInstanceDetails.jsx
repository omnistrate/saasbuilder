import Link from "next/link";
import { useMemo } from "react";
import { Box, styled } from "@mui/material";
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
import capitalize from "lodash/capitalize";

import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import { PasswordWithOutBorderField } from "components/FormElementsv2/PasswordField/PasswordWithOutBorderField";
import TerraformDownloadURL from "./TerraformDownloadURL";

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
    return result;
  }, [isResourceBYOA, resultParameters, resultParametersSchema]);

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

          {resultParameters.account_configuration_method === "Terraform" && (
            <TerraformDownloadURL
              serviceOffering={serviceOffering}
              subscriptionId={subscriptionId}
              cloud_provider={resultParameters.cloud_provider}
            />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ResourceInstanceDetails;

// const ResourceProxyEndpoint = (props) => {
//   const {
//     endpoint,
//     primary,
//     sx = {},
//     serviceId,
//     environmentId,
//     searchInventoryView,
//   } = props;

//   //regex for instance id extraction from proxy endpoint
//   const regex = /instance-([^\.]+)/;
//   const match = endpoint.match(regex);
//   let instanceId;

//   if (match) {
//     instanceId = match[0];
//     console.log("instanceId", instanceId, match);
//   }

//   let resourceInstanceUrlLink;

//   if (instanceId) {
//     resourceInstanceUrlLink = getInventoryManagementInventoryRoute(
//       serviceId,
//       environmentId,
//       instanceId,
//       searchInventoryView
//     );
//   }

//   return (
//     <Stack
//       direction="row"
//       sx={{
//         border: primary ? "2px solid #7F56D9" : "1px solid #EAECF0",
//         background: primary ? "#F9F5FF" : "white",
//         padding: "16px",
//         borderRadius: "12px",
//         ...sx,
//       }}
//     >
//       <Image src={resourceEndpointIcon} alt="resource-endpoint" />
//       <Box
//         sx={{
//           flexGrow: 1,
//           marginLeft: "16px",
//           textAlign: "left",
//           alignSelf: "center",
//         }}
//       >
//         <LinkResourceInstance
//           href={resourceInstanceUrlLink ?? ""}
//           target="_blank"
//         >
//           <Text
//             size="small"
//             weight="regular"
//             color={primary ? "#6941C6" : ""}
//             sx={{ wordBreak: "break-all" }}
//           >
//             {endpoint}
//           </Text>
//           <ArrowOutwardIcon />
//         </LinkResourceInstance>
//       </Box>
//       {endpoint && (
//         <Box alignSelf="start">
//           <CopyToClipbpoardButton text={endpoint} />
//         </Box>
//       )}
//     </Stack>
//   );
// };

const LinkResourceInstance = styled(Link)(({ theme }) => ({
  display: "flex",
  color: "#6941C6",
  fontWeight: 500,
  gap: 2,
  alignItems: "center",
}));
