import { Box, Stack } from "@mui/material";

import { getEnumFromUserRoleString } from "src/utils/isAllowedByRBAC";
import {
  Table,
  TableCell,
  TableRow,
  TableContainer,
  TableCellCenterText,
  TableHead,
} from "src/components/TableComponents/TableComponents";

import AwsLogo from "../Logos/AwsLogo/AwsLogo";
import GcpLogo from "../Logos/GcpLogo/GcpLogo";

import { Fragment } from "react";
import { Text } from "../Typography/Typography";

const CLOUD_PROVIDERS_MAP = {
  aws: <AwsLogo />,
  gcp: <GcpLogo />,
};

function AccessHeaderCard(props) {
  const { serviceName, productTierName, currentSubscription, cloudProviders } =
    props;

  const role = getEnumFromUserRoleString(currentSubscription?.roleType);

  return (
    <TableContainer
      sx={{
        padding: "0px 0px",
      }}
    >
      <Table>
        <TableHead>
          <TableCellCenterText>
            <Text size="xsmall" weight="medium" color="rgba(71, 84, 103, 1)">
              Service Name
            </Text>
          </TableCellCenterText>
          <TableCellCenterText>
            <Text size="xsmall" weight="medium" color="rgba(71, 84, 103, 1)">
              Service Plan Name
            </Text>
          </TableCellCenterText>
          <TableCellCenterText>
            <Text size="xsmall" weight="medium" color="rgba(71, 84, 103, 1)">
              Role
            </Text>
          </TableCellCenterText>
          <TableCellCenterText>
            <Text size="xsmall" weight="medium" color="rgba(71, 84, 103, 1)">
              Supported Cloud
            </Text>
          </TableCellCenterText>
        </TableHead>

        <TableRow>
          <TableCell>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Text size="small" weight="medium" color="rgba(16, 24, 40, 1)">
                {serviceName}
              </Text>
            </Box>
          </TableCell>

          <TableCell>
            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={"10px"}
            >
              <Text size="small" weight="medium" color="rgba(16, 24, 40, 1)">
                {productTierName}
              </Text>
            </Stack>
          </TableCell>

          <TableCell>
            <Stack
              direction="row"
              justifyContent={"center"}
              alignItems="center"
            >
              <Text size="small" weight="regular" color="rgba(16, 24, 40, 1)">
                {role[0].toUpperCase() + role.slice(1)}
              </Text>
            </Stack>
          </TableCell>

          <TableCell>
            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={"10px"}
            >
              {cloudProviders?.map((provider, i) => {
                return (
                  <Fragment key={i}>{CLOUD_PROVIDERS_MAP[provider]}</Fragment>
                );
              })}
            </Stack>
          </TableCell>
        </TableRow>
      </Table>
    </TableContainer>
  );
}

export default AccessHeaderCard;
