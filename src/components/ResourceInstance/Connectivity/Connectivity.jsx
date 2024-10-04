import { Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Card from "components/Card/Card";
import Button from "components/Button/Button";
import { Text } from "components/Typography/Typography";
import ResourceConnectivityEndpoint from "./ConnectivityEndpoint";
import PropertyTable from "components/PropertyTable/PropertyTable";

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
    queryData,
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
            //filter out omnistrate observability
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

  const rows = useMemo(() => {
    let sectionLabel = "Resource";

    if (context === "inventory") {
      sectionLabel = "Service Component";
    }

    const res = [
      {
        label: "Network type",
        description: "Type of network",
        value: networkType,
      },
    ];

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
            {primaryResourceName && primaryResourceEndpoint && (
              <ResourceConnectivityEndpoint
                context={context}
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
                        key={`endpoint-${resourceId}`}
                        context={context}
                        isPrimaryResource={false}
                        resourceName={resourceName}
                        viewType="endpoint"
                        endpointURL={endpoint}
                        customDNSData={customDNSEndpoint}
                        resourceKey={resourceKey}
                        resourceId={resourceId}
                        refetchInstance={refetchInstance}
                        containerStyles={{ marginTop: "16px" }}
                        resourceHasCompute={resourceHasCompute}
                        queryData={queryData}
                      />
                    );
                  })}
              </>
            )}
          </>
        ),
      });
    }

    if (
      (primaryResourcePorts?.resourceName && primaryResourcePorts?.ports) ||
      otherResourceFilteredPorts?.length > 0
    ) {
      const { resourceName, ports } = primaryResourcePorts;

      res.push({
        label: "Port(s)",
        valueType: "custom",
        value: (
          <>
            {resourceName && ports && (
              <ResourceConnectivityEndpoint
                isPrimaryResource={true}
                resourceName={primaryResourcePorts?.resourceName}
                viewType="ports"
                ports={primaryResourcePorts?.ports}
              />
            )}
            {otherResourceFilteredPorts?.length > 0 && (
              <>
                {resourceName && ports && (
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
                {(isPortsExpanded || !(resourceName && ports)) &&
                  otherResourceFilteredPorts.map((obj) => {
                    const { resourceName, ports } = obj;
                    return (
                      <ResourceConnectivityEndpoint
                        resourceName={resourceName}
                        ports={ports}
                        viewType="ports"
                        key={obj.resourceName}
                        containerStyles={{ marginTop: "16px" }}
                      />
                    );
                  })}
              </>
            )}
          </>
        ),
      });
    }

    res.push({
      label: "Availability zones",
      description: `The availability zone of the ${sectionLabel.toLowerCase()}`,
      value: availabilityZones,
    });

    res.push({
      label: "Publicly accessible",
      value: publiclyAccessible ? "Yes" : "No",
    });

    if (privateNetworkCIDR) {
      res.push({
        label: "Private network CIDR",
        description: `The private network CIDR of the ${sectionLabel.toLowerCase()}`,
        value: privateNetworkCIDR,
      });
    }

    if (privateNetworkId) {
      res.push({
        label: "Private network ID",
        description: `The private network ID of the ${sectionLabel.toLowerCase()}`,
        value: privateNetworkId,
      });
    }

    return res;
  }, [
    context,
    networkType,
    primaryResourceName,
    primaryResourceEndpoint,
    otherResourceFilteredEndpoints,
    primaryResourcePorts,
    otherResourceFilteredPorts,
    availabilityZones,
    publiclyAccessible,
    privateNetworkCIDR,
    globalEndpoints,
    isEndpointsExpanded,
    isPortsExpanded,
    privateNetworkId,
    refetchInstance,
    queryData,
  ]);

  if (noConnectivityData) {
    return (
      <Card sx={{ minHeight: "500px" }}>
        <Stack direction="row" justifyContent="center" marginTop="200px">
          <Text size="xlarge">No Connectivity data</Text>
        </Stack>
      </Card>
    );
  }

  return <PropertyTable rows={rows} />;
}

export default Connectivity;
