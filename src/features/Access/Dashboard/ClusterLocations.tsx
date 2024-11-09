import { Box, Stack, styled } from "@mui/material";
import { FC } from "react";
import ClusterLocationsIcon from "src/components/Icons/Dashboard/ClusterLocations";
import { Text } from "src/components/Typography/Typography";
import { AccessResourceInstance } from "src/types/resourceInstance";
import dynamic from "next/dynamic";
const DottedWorldMap = dynamic(() => import("./components/DottedWorldMap"), {
  ssr: false,
});
import { CloudProvider } from "src/types/common/enums";

const ContainerCard = styled(Box)({
  border: "1px solid #E4E7EC",
  borderRadius: "12px",
  boxShadow: "box-shadow: 0px 1px 2px 0px ",
  padding: "24px",
  marginTop: "32px",
});

type ClusterLocationsProps = {
  resourceInstances: AccessResourceInstance[];
  isFetchingInstances: boolean;
};

const ClusterLocations: FC<ClusterLocationsProps> = (props) => {
  const { resourceInstances = [] } = props;

  const regionsWithInstanceCount = Object.entries(
    resourceInstances.reduce(
      (
        acc: Record<
          string,
          {
            instanceCount: number;
            cloudProvider: CloudProvider;
            region: string;
          }
        >,
        curr
      ) => {
        const { region, cloud_provider } = curr;
        const key = `${cloud_provider}-${region}`;
        if (acc[key]) {
          acc[key] = {
            cloudProvider: cloud_provider,
            instanceCount: acc[key].instanceCount + 1,
            region: region,
          };
        } else {
          acc[key] = {
            cloudProvider: cloud_provider,
            instanceCount: 1,
            region: region,
          };
        }
        return acc;
      },
      {}
    )
  ).map(([, { instanceCount, cloudProvider, region }]) => ({
    region,
    instanceCount,
    cloudProvider,
  }));

  return (
    <ContainerCard>
      <Stack
        paddingBottom="20px"
        borderBottom="1px solid #E4E7EC"
        direction="row"
        alignItems="center"
        gap="16px"
      >
        <ClusterLocationsIcon />
        <Text size="large" weight="semibold">
          Cluster Locations
        </Text>
      </Stack>
      <Box marginTop="8px" sx={{ marginInline: "auto", maxWidth: "1200px" }}>
        <DottedWorldMap regionsWithInstanceCount={regionsWithInstanceCount} />
      </Box>
    </ContainerCard>
  );
};

export default ClusterLocations;
