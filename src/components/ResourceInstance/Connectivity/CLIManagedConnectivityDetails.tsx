import { Box, Stack } from "@mui/material";
import { Text } from "src/components/Typography/Typography";
import EndpointCard from "./EndpointCard";

const CLIManagedConnectivityDetails = ({ additionalEndpoints }) => {
  return additionalEndpoints.map(
    ({ resourceName, additionalEndpoints: endpoints }) =>
      endpoints ? (
        <Stack
          key={resourceName}
          my="16px"
          borderRadius="8px"
          border="1px solid #E4E7EC"
          gap="12px"
          p="12px"
          pt="0px"
        >
          <Box py="12px" borderBottom="1px solid #E4E7EC">
            <Text size="small" weight="semibold" color="#6941C6">
              {resourceName}
            </Text>
          </Box>

          {Object.entries(endpoints).map(([name, endpoint]: any, index) => (
            <EndpointCard
              key={index}
              isPrimary={endpoint.primary}
              endpointName={name}
              endpointURL={endpoint.endpoint}
              isPublic={endpoint.networkingType === "PUBLIC"}
              openPorts={endpoint.openPorts}
            />
          ))}
        </Stack>
      ) : null
  );
};

export default CLIManagedConnectivityDetails;
