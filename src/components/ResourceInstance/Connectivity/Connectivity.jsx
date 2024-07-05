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
import { Text } from "../../Typography/Typography";
import Button from "../../Button/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useEffect, useState } from "react";
import Card from "src/components/Card/Card";
import ResourceConnectivityEndpoint from "./ConnectivityEndpoint";
import { Stack } from "@mui/material";

function Connectivity(props) {
  const {
    networkType,
    ports,
    publiclyAccessible,
    privateNetworkCIDR,
    privateNetworkId,
    globalEndpoints,
    nodes,
    queryData,
    refetchInstance,
  } = props;
  const [availabilityZones, setAvailabilityZones] = useState("");
  let sectionLabel = "Resource";

  const primaryResourceName = globalEndpoints?.primary?.resourceName;
  const primaryResourceEndpoint = globalEndpoints?.primary?.endpoint;
  const primaryResourcePorts = ports?.[0];

  const otherResourcePorts = ports?.slice(1) ?? [];

  const otherEndpoints = globalEndpoints?.others;

  const otherResourceFilteredPorts = [];
  const otherResourceFilteredEndpoints = [];

  otherEndpoints?.forEach((endpointData) => {
    const { resourceName, endpoint } = endpointData;
    if (resourceName && endpoint) {
      const matchingResourcePort = otherResourcePorts.find(
        (port) => port.resourceName === resourceName && port.ports
      );
      if (matchingResourcePort) {
        if (resourceName === "Omnistrate Observability") {
          return;
        }
        otherResourceFilteredPorts.push(matchingResourcePort);
        otherResourceFilteredEndpoints.push(endpointData);
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
                  <ResourceConnectivityEndpoint
                    isPrimaryResource={true}
                    resourceName={primaryResourceName}
                    viewType="endpoint"
                    endpointURL={primaryResourceEndpoint}
                    customDNSData={globalEndpoints?.primary?.customDNSEndpoint}
                    queryData={queryData}
                    resourceKey={globalEndpoints?.primary?.resourceKey}
                    resourceId={globalEndpoints?.primary?.resourceId}
                    refetchInstance={refetchInstance}
                    resourceHasCompute={
                      globalEndpoints?.primary?.resourceHasCompute
                    }
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
                        const {
                          resourceName,
                          endpoint,
                          resourceId,
                          customDNSEndpoint,
                          resourceKey,
                          resourceHasCompute,
                        } = obj;
                        return (
                          <ResourceConnectivityEndpoint
                            key={resourceId}
                            isPrimaryResource={false}
                            resourceName={resourceName}
                            viewType="endpoint"
                            endpointURL={endpoint}
                            customDNSData={customDNSEndpoint}
                            queryData={queryData}
                            resourceKey={resourceKey}
                            resourceId={resourceId}
                            refetchInstance={refetchInstance}
                            containerStyles={{ marginTop: "16px" }}
                            resourceHasCompute={resourceHasCompute}
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
              <TableCell sx={{ verticalAlign: "baseline" }}>
                <CellTitle>Port(s)</CellTitle>
              </TableCell>
              <TableCell align="right" sx={{ paddingRight: 0 }}>
                {primaryResourcePorts?.resourceName &&
                  primaryResourcePorts?.ports && (
                    <ResourceConnectivityEndpoint
                      isPrimaryResource={true}
                      resourceName={primaryResourcePorts?.resourceName}
                      viewType="ports"
                      ports={primaryResourcePorts?.ports}
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
                          <ResourceConnectivityEndpoint
                            resourceName={resourceName}
                            ports={ports}
                            viewType="ports"
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
