import { Box, Stack } from "@mui/material";
import {
  CellDescription,
  CellSubtext,
  CellTitle,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
} from "../../InfoTable/InfoTable";
import Image from "next/image";
import resourceEndpointIcon from "../../../../public/assets/images/dashboard/resource-instance-nodes/resource-endpoint.svg";
import resourcePortsIcon from "../../../../public/assets/images/dashboard/resource-instance-nodes/ports.svg";
import { Text } from "../../Typography/Typography";
import CopyToClipbpoardButton from "../../CopyClipboardButton/CopyClipboardButton";
import Button from "../../Button/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useEffect, useState } from "react";
import Card from "src/components/Card/Card";

function Connectivity(props) {
  const {
    networkType,
    clusterEndpoint,
    nodeEndpoints,
    ports,
    // availabilityZones,
    publiclyAccessible,
    privateNetworkCIDR,
    privateNetworkId,
    globalEndpoints,
    proxyEndpointDetails,
    serviceId,
    environmentId,
    searchInventoryView,
    context,
    nodes,
  } = props;
  const [availabilityZones, setAvailabilityZones] = useState("");
  let sectionLabel = "Resource";

  if (context === "inventory") {
    sectionLabel = "Service Component";
  }

  const primaryResourceName = globalEndpoints?.primary?.resourceName;
  const primaryResourceEndpoint = globalEndpoints?.primary?.endpoint;
  const primaryResourcePorts = ports?.[0];
  const otherResourcePorts = ports?.slice(1) ?? [];

  const otherEndpoints = globalEndpoints?.others;

  const otherResourceFilteredPorts = [];
  const otherResourceFilteredEndpoints = [];
  otherEndpoints.forEach(({ resourceName, endpoint }) => {
    if (resourceName && endpoint) {
      const matchingResourcePort = otherResourcePorts.find(
        (port) => port.resourceName === resourceName && port.ports
      );
      if (matchingResourcePort) {
        //filter out omnistrate observability
        if (resourceName === "Omnistrate Observability") {
          return;
        }
        otherResourceFilteredPorts.push(matchingResourcePort);
        otherResourceFilteredEndpoints.push({ resourceName, endpoint });
      }
    }
  });

  const noConnectivityData =
    !globalEndpoints?.primary &&
    !otherResourceFilteredEndpoints?.length &&
    !ports?.length;

  const [isEndpointsExpanded, setIsEndpointsExpanded] = useState(false);
  const [isPortsExpanded, setIsPortsExpanded] = useState(false);

  const toggleExpanded = () => setIsEndpointsExpanded((prev) => !prev);

  useEffect(() => {
    let availabilityZone = "";
    const nodeAvailabilityZone = [];
    nodes.map((node) => {
      if (!nodeAvailabilityZone.includes(node.availabilityZone)) {
        if (availabilityZone)
          availabilityZone = availabilityZone + "," + node.availabilityZone;
        else availabilityZone = node.availabilityZone;
        nodeAvailabilityZone.push(node.availabilityZone);
      }
    });
    setAvailabilityZones(availabilityZone);
  }, [nodes]);

  if (noConnectivityData) {
    return (
      <Card mt="54px" sx={{ minHeight: "500px" }}>
        <Stack direction="row" justifyContent="center" marginTop="200px">
          <Text size="xlarge">No Connectivity data</Text>
        </Stack>
      </Card>
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
            <TableCell>
              <CellTitle>Network type</CellTitle>
              <CellSubtext>Type of network</CellSubtext>
            </TableCell>
            <TableCell align="right" sx={{ width: "50%" }}>
              <CellDescription>{networkType}</CellDescription>
            </TableCell>
          </TableRow>
          {((primaryResourceName && primaryResourceEndpoint) ||
            otherResourceFilteredEndpoints?.length > 0) && (
            <TableRow>
              <TableCell sx={{ verticalAlign: "baseline" }}>
                <CellTitle>Global endpoint</CellTitle>
                <CellSubtext>
                  The global endpoint of the {sectionLabel.toLowerCase()}
                </CellSubtext>
              </TableCell>
              <TableCell align="right" sx={{ paddingRight: 0 }}>
                {primaryResourceName && primaryResourceEndpoint && (
                  <ResourceGlobalEndpoint
                    primary
                    resourceName={primaryResourceName}
                    text={primaryResourceEndpoint}
                    type="endpoint"
                  />
                )}
                {otherResourceFilteredEndpoints?.length > 0 && (
                  <>
                    {primaryResourceName && primaryResourceEndpoint && (
                      <Stack direction="row" justifyContent="center">
                        <Button
                          sx={{ color: "#6941C6", marginTop: "16px" }}
                          endIcon={
                            isEndpointsExpanded ? (
                              <RemoveCircleOutlineIcon />
                            ) : (
                              <AddCircleOutlineIcon />
                            )
                          }
                          onClick={toggleExpanded}
                        >
                          {isEndpointsExpanded ? "View Less" : "View More"}
                        </Button>
                      </Stack>
                    )}
                    {(isEndpointsExpanded ||
                      !(primaryResourceName && primaryResourceEndpoint)) &&
                      otherResourceFilteredEndpoints.map((obj) => {
                        const { resourceName, endpoint } = obj;
                        return (
                          <ResourceGlobalEndpoint
                            resourceName={resourceName}
                            text={endpoint}
                            type="endpoint"
                            key={obj.resourceName}
                            sx={{ marginTop: "16px" }}
                          />
                        );
                      })}
                  </>
                )}
              </TableCell>
            </TableRow>
          )}
          {((primaryResourcePorts?.resourceName &&
            primaryResourcePorts?.ports) ||
            otherResourceFilteredPorts?.length > 0) && (
            <TableRow>
              <TableCell>
                <CellTitle>Port(s)</CellTitle>
              </TableCell>
              <TableCell align="right" sx={{ paddingRight: 0 }}>
                {primaryResourcePorts?.resourceName &&
                  primaryResourcePorts?.ports && (
                    <ResourceGlobalEndpoint
                      primary
                      resourceName={primaryResourcePorts?.resourceName}
                      text={primaryResourcePorts?.ports}
                      type="ports"
                    />
                  )}
                {otherResourceFilteredPorts?.length > 0 && (
                  <>
                    {primaryResourcePorts?.resourceName &&
                      primaryResourcePorts?.ports && (
                        <Stack direction="row" justifyContent="center">
                          <Button
                            sx={{ color: "#6941C6", marginTop: "16px" }}
                            endIcon={
                              isPortsExpanded ? (
                                <RemoveCircleOutlineIcon />
                              ) : (
                                <AddCircleOutlineIcon />
                              )
                            }
                            onClick={() => setIsPortsExpanded(!isPortsExpanded)}
                          >
                            {isPortsExpanded ? "View Less" : "View More"}
                          </Button>
                        </Stack>
                      )}
                    {(isPortsExpanded ||
                      !(
                        primaryResourcePorts?.resourceName &&
                        primaryResourcePorts?.ports
                      )) &&
                      otherResourceFilteredPorts.map((obj) => {
                        const { resourceName, ports } = obj;
                        return (
                          <ResourceGlobalEndpoint
                            resourceName={resourceName}
                            text={ports}
                            type="ports"
                            key={obj.resourceName}
                            sx={{ marginTop: "16px" }}
                          />
                        );
                      })}
                  </>
                )}
              </TableCell>
            </TableRow>
          )}
          {/* proxt endpoint */}
          {/* {proxyEndpointDetails && proxyEndpointDetails.proxyEndpoint && (
            <TableRow>
              <TableCell sx={{ verticalAlign: "baseline" }}>
                <CellTitle>Proxy Endpoint</CellTitle>
                <CellSubtext>
                  The proxy endpoint of the {sectionLabel.toLowerCase()}
                </CellSubtext>
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

          <TableRow>
            <TableCell>
              <CellTitle>Availability zones</CellTitle>
              <CellSubtext>
                The availability zone of the {sectionLabel.toLowerCase()}
              </CellSubtext>
            </TableCell>
            <TableCell align="right">
              <CellDescription>{availabilityZones}</CellDescription>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderBottom: "none" }}>
              <CellTitle>Publicly accessible</CellTitle>
            </TableCell>
            <TableCell align="right" sx={{ borderBottom: "none" }}>
              <CellDescription>
                {publiclyAccessible ? "Yes" : "No"}
              </CellDescription>
            </TableCell>
          </TableRow>
          {privateNetworkCIDR && (
            <TableRow>
              <TableCell>
                <CellTitle>Private network CIDR</CellTitle>
                <CellSubtext>
                  The private network CIDR of the {sectionLabel.toLowerCase()}
                </CellSubtext>
              </TableCell>
              <TableCell align="right">
                <CellDescription>{privateNetworkCIDR}</CellDescription>
              </TableCell>
            </TableRow>
          )}
          {privateNetworkCIDR && (
            <TableRow>
              <TableCell>
                <CellTitle>Private network ID</CellTitle>
                <CellSubtext>
                  The private network ID of the {sectionLabel.toLowerCase()}
                </CellSubtext>
              </TableCell>
              <TableCell align="right">
                <CellDescription>{privateNetworkId}</CellDescription>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Connectivity;

const ResourceGlobalEndpoint = (props) => {
  const { resourceName, text, type, primary, sx = {} } = props;

  return (
    <Stack
      direction="row"
      sx={{
        border: primary ? "2px solid #7F56D9" : "1px solid #EAECF0",
        background: primary ? "#F9F5FF" : "white",
        padding: "16px",
        borderRadius: "12px",
        ...sx,
      }}
    >
      {type === "endpoint" ? (
        <Image src={resourceEndpointIcon} alt="resource-endpoint" />
      ) : (
        <Image src={resourcePortsIcon} alt="resource-ports" />
      )}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: "16px",
          textAlign: "left",
        }}
      >
        <Text size="small" weight="medium" color="#53389E">
          {resourceName}
        </Text>
        <Text size="small" weight="regular" color={primary ? "#6941C6" : ""}>
          {text}
        </Text>
      </Box>
      {text && (
        <Box alignSelf="start">
          <CopyToClipbpoardButton text={text} />
        </Box>
      )}
    </Stack>
  );
};
