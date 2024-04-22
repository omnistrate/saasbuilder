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
import React from "react";
import Link from "next/link";
import capitalize from "lodash/capitalize";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import { PasswordWithOutBorderField } from "src/components/FormElementsv2/PasswordField/PasswordWithOutBorderField";

function ResourceInstanceDetails(props) {
  const {
    resourceInstanceId,
    resultParameters = {},
    isLoading,
    resultParametersSchema = [],
    createdAt,
    modifiedAt,
    // proxyEndpointDetails,
    // serviceId,
    // environmentId,
    // searchInventoryView,
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

          {/* proxy endpoint */}
          {/* {proxyEndpointDetails && proxyEndpointDetails.proxyEndpoint && (
            <TableRow>
              <TableCell sx={{ verticalAlign: "baseline" }}>
                <CellTitle>Proxy Endpoint</CellTitle>
                <CellSubtext></CellSubtext>
              </TableCell>
              <TableCell align="right" sx={{ paddingRight: 0 }}>
                <ResourceProxyEndpoint
                  primary
                  endpoint={proxyEndpointDetails.proxyEndpoint}
                  serviceId={serviceId}
                  environmentId={environmentId}
                  searchInventoryView={searchInventoryView}
                />
              </TableCell>
            </TableRow>
          )} */}

          {/* proxy ports */}

          {/* {proxyEndpointDetails && proxyEndpointDetails.openPorts && (
            <TableRow>
              <TableCell>
                <CellTitle>Proxy Port(s)</CellTitle>
              </TableCell>
              <TableCell align="right">
                <CellDescription>
                  {proxyEndpointDetails.openPorts}
                </CellDescription>
              </TableCell>
            </TableRow>
          )} */}

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
