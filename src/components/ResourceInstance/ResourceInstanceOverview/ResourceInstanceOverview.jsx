import { Box, Stack } from "@mui/material";
import AwsLogo from "src/components/Logos/AwsLogo/AwsLogo";
import GcpLogo from "src/components/Logos/GcpLogo/GcpLogo";
import { Text } from "src/components/Typography/Typography";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
} from "components/InfoTable/InfoTable";
import GradientProgressBar from "src/components/GradientProgessBar/GradientProgressBar";
import RegionIcon from "src/components/Region/RegionIcon";
import { getResourceInstanceStatusStylesAndLabel } from "src/constants/statusChipStyles/resourceInstanceStatus";
import StatusChip from "src/components/StatusChip/StatusChip";

function ResourceInstanceOverview(props) {
  const {
    resourceInstanceId,
    region,
    cloudProvider,
    status,
    context,
    healthStatusPercent,
    isResourceBYOA,
    isCliManagedResource,
  } = props;

  let sectionLabel = "Resource";

  if (context === "inventory") {
    sectionLabel = "Service Component ";
  }

  if (isResourceBYOA) {
    sectionLabel = "Account";
  }

  const statusStylesAndLabel = getResourceInstanceStatusStylesAndLabel(status);

  return (
    <>
      <TableContainer
        sx={{
          mt: "24px",
        }}
      >
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ minWidth: "200px" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>{`${sectionLabel} Instance ID`} </Text>
                </Box>
              </TableCell>
              <TableCell sx={{ minWidth: "200px" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>Status </Text>
                </Box>
              </TableCell>
              <TableCell sx={{ minWidth: "200px" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>Region</Text>
                </Box>
              </TableCell>
              <TableCell sx={{ minWidth: "200px" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>Cloud Provider</Text>
                </Box>
              </TableCell>
              <TableCell sx={{ minWidth: "200px" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>Health Status</Text>
                </Box>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#475467",
                  }}
                >
                  {resourceInstanceId}
                </Box>
              </TableCell>

              <TableCell>
                <Stack
                  direction={"row"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={"10px"}
                >
                  {" "}
                  {status ? (
                    <StatusChip status={status} {...statusStylesAndLabel} />
                  ) : (
                    <Box sx={{ color: "#475467" }}>NA</Box>
                  )}
                </Stack>
              </TableCell>

              <TableCell>
                <Stack
                  direction="row"
                  justifyContent={"center"}
                  alignItems="center"
                >
                  <RegionIcon />
                  <Box
                    component="span"
                    ml="5.5px"
                    fontWeight={500}
                    color="#101828"
                  >
                    {region ?? "Global"}
                  </Box>
                </Stack>
              </TableCell>

              <TableCell>
                <Stack
                  direction={"row"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={"10px"}
                >
                  {cloudProvider === "aws" && <AwsLogo />}
                  {cloudProvider === "gcp" && <GcpLogo />}
                  {!cloudProvider && (
                    <Box sx={{ color: "#475467" }}>Everywhere</Box>
                  )}
                </Stack>
              </TableCell>
              <TableCell>
                <Stack
                  direction={"row"}
                  alignItems={"flex-end"}
                  justifyContent={"center"}
                >
                  {isCliManagedResource ? (
                    <StatusChip category="unknown" label="Unknown" />
                  ) : status === "STOPPED" ? (
                    <StatusChip category="unknown" label="N/A" />
                  ) : (
                    <GradientProgressBar percentage={healthStatusPercent} />
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ResourceInstanceOverview;
