import { Box, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Card from "components/Card/Card";
import Button from "components/Button/Button";
import { Text } from "components/Typography/Typography";
import ResourceConnectivityEndpoint from "./ConnectivityEndpoint";

import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import PropertyTable from "./PropertyTable";
import ResourceConnectivityCustomDNS from "./ConnectivityCustomDNS";

function Connectivity(props) {
  const {
    networkType,
    ports,
    publiclyAccessible,
    privateNetworkCIDR,
    privateNetworkId,
    globalEndpoints,
    context,
    nodes,
    addCustomDNSMutation,
    removeCustomDNSMutation,
    accessQueryParams,
    fleetQueryParams,
    refetchInstance,
  } = props;

  const [availabilityZones, setAvailabilityZones] = useState("");
  const primaryResourceName = globalEndpoints?.primary?.resourceName;
  const primaryResourceEndpoint = globalEndpoints?.primary?.endpoint;
  const primaryResourcePorts = ports?.[0];

  const [otherResourceFilteredPorts, otherResourceFilteredEndpoints] =
    useMemo(() => {
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
            // filter out omnistrate observability
            if (resourceName === "Omnistrate Observability") {
              return;
            }
            otherResourceFilteredPorts.push(matchingResourcePort);
            otherResourceFilteredEndpoints.push(endpointData);
          }
        }
      });
      return [otherResourceFilteredPorts, otherResourceFilteredEndpoints];
    }, [ports, globalEndpoints]);

  const noConnectivityData =
    !globalEndpoints?.primary &&
    !otherResourceFilteredEndpoints?.length &&
    !ports?.length;

  const [isEndpointsExpanded, setIsEndpointsExpanded] = useState(false);
  // const [isPortsExpanded, setIsPortsExpanded] = useState(false);

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

  const rows = useMemo(() => {
    let sectionLabel = "Resource";

    if (context === "inventory") {
      sectionLabel = "Service Component";
    }

    const res = [];

    if (
      (primaryResourceName && primaryResourceEndpoint) ||
      otherResourceFilteredEndpoints?.length > 0
    ) {
      res.push({
        label: "Global endpoint",
        description: `The global endpoint of the ${sectionLabel.toLowerCase()}`,
        valueType: "custom",
        value: (
          <>
            {primaryResourceName &&
              primaryResourceEndpoint &&
              primaryResourcePorts && (
                <ResourceConnectivityEndpoint
                  isPrimaryResource={true}
                  endpointURL={primaryResourceEndpoint}
                  resourceName={primaryResourceName}
                  viewType="endpoint"
                  ports={primaryResourcePorts?.ports}
                  resourceHasCompute={
                    globalEndpoints?.primary?.resourceHasCompute
                  }
                />
              )}
            {otherResourceFilteredEndpoints?.length > 0 &&
              otherResourceFilteredPorts?.length > 0 && (
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
                    otherResourceFilteredEndpoints.map(
                      ({ resourceName, endpoint, resourceId }) =>
                        ports
                          .filter((port) => port?.ports)
                          .map((port) => (
                            <ResourceConnectivityEndpoint
                              key={resourceId}
                              isPrimaryResource={false}
                              resourceName={resourceName}
                              ports={port.ports}
                              viewType="endpoint"
                              endpointURL={endpoint}
                              containerStyles={{ marginTop: "16px" }}
                            />
                          ))
                    )}
                </>
              )}
          </>
        ),
      });
    }
    if (globalEndpoints?.primary?.customDNSEndpoint) {
      res.push({
        label: "gateway",
        description: `The gateway of the ${sectionLabel.toLowerCase()}`,
        valueType: "custom",
        value: (
          <>
            {primaryResourceName &&
              primaryResourceEndpoint &&
              primaryResourcePorts && (
                <ResourceConnectivityCustomDNS
                  context={context}
                  isPrimaryResource={false}
                  resourceName={"gateway"}
                  viewType="endpoint"
                  endpointURL={primaryResourceEndpoint}
                  customDNSData={globalEndpoints?.primary?.customDNSEndpoint}
                  fleetQueryParams={fleetQueryParams}
                  accessQueryParams={accessQueryParams}
                  resourceKey={globalEndpoints?.primary?.resourceKey}
                  resourceId={globalEndpoints?.primary?.resourceId}
                  refetchInstance={refetchInstance}
                  ports={primaryResourcePorts?.ports}
                  resourceHasCompute={
                    globalEndpoints?.primary?.resourceHasCompute
                  }
                />
              )}
          </>
        ),
      });
    }

    return res;
  }, [
    context,
    primaryResourceName,
    primaryResourceEndpoint,
    otherResourceFilteredEndpoints,
    primaryResourcePorts,
    otherResourceFilteredPorts,
    globalEndpoints?.primary?.customDNSEndpoint,
    addCustomDNSMutation,
    removeCustomDNSMutation,
    isEndpointsExpanded,
    // isPortsExpanded,
  ]);

  return (
    <Card
      sx={{
        marginTop: "32px",
        padding: "12px",
        borderRadius: "8px",
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottom: "1px solid #E4E7EC",
          padding: "12px 0px",
        }}
        alignItems="center"
      >
        <DataGridHeaderTitle
          title={`Connectivity Details Info`}
          desc="Information about the resource instance connectivity options and network settings"
        />
      </Stack>

      {noConnectivityData ? (
        <Stack direction="row" justifyContent="center" marginTop="200px">
          <Text size="xlarge">No Connectivity data</Text>
        </Stack>
      ) : (
        <>
          <Stack
            sx={{
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "12px 0px",
            }}
            alignItems="left"
          >
            <Text size="small" weight="semibold" color="#101828">
              {"Connectivity info"}
            </Text>
            <Text size="small" weight="regular" color="#475467">
              {
                "Connectivity details, including instance access and network information"
              }
            </Text>
          </Stack>
          <Box display="flex" flexDirection="row" justifyContent="center">
            <Box
              flex="1"
              p="16px 24px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <Text size="small" weight="semibold" color="#101828">
                {"Network type"}
              </Text>
              <Text size="small" weight="regular" color="#475467">
                {networkType}
              </Text>
            </Box>
            {availabilityZones && (
              <Box
                flex="1"
                borderLeft="1px solid #EAECF0"
                p="16px 24px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
              >
                <Text size="small" weight="semibold" color="#101828">
                  {"Availability zones"}
                </Text>
                <Text size="small" weight="regular" color="#475467">
                  {availabilityZones}
                </Text>
              </Box>
            )}
            <Box
              flex="1"
              borderLeft="1px solid #EAECF0"
              p="16px 24px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <Text size="small" weight="semibold" color="#101828">
                {"Publicly accessible"}
              </Text>
              <Text size="small" weight="regular" color="#475467">
                {publiclyAccessible ? "Yes" : "No"}
              </Text>
            </Box>
            {privateNetworkCIDR && (
              <Box
                flex="1"
                borderLeft="1px solid #EAECF0"
                p="16px 24px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
              >
                <Text size="small" weight="semibold" color="#101828">
                  {"Private network CIDR"}
                </Text>
                <Text size="small" weight="regular" color="#475467">
                  {privateNetworkCIDR}
                </Text>
              </Box>
            )}
            {privateNetworkId && (
              <Box
                flex="1"
                borderLeft="1px solid #EAECF0"
                p="16px 24px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
              >
                <Text size="small" weight="semibold" color="#101828">
                  {"Private network ID"}
                </Text>
                <Text size="small" weight="regular" color="#475467">
                  {privateNetworkId}
                </Text>
              </Box>
            )}
          </Box>
          {rows.length > 0 && (
            <Box paddingTop={"12px"}>
              <PropertyTable data-testid="connectivity-table" rows={rows} />
            </Box>
          )}
        </>
      )}
    </Card>
  );
}

export default Connectivity;
