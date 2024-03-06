import { Box, Stack, chipClasses } from "@mui/material";
import { Column, InfoCardContainer } from "../../InfoCard/InfoCard";
import AwsLogo from "../../Logos/AwsLogo/AwsLogo";
import GcpLogo from "../../Logos/GcpLogo/GcpLogo";
import ResourceInstanceStatusChip from "../ResourceInstanceStatusChip/ResourceInstanceStatusChip";
import regionIcon from "../../../../public/assets/images/dashboard/resource-instance-nodes/region.svg";
import dateIcon from "../../../../public/assets/images/dashboard/resource-instance-nodes/date.svg";
import Image from "next/image";
import { Text } from "../../Typography/Typography";
import _ from "lodash";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  CellTitle,
} from "components/InfoTable/InfoTable";
import GradientProgressBar from "src/components/GradientProgessBar/GradientProgressBar";

function ResourceInstanceOverview(props) {
  const {
    resourceInstanceId,
    region,
    cloudProvider,
    status,
    createdAt,
    modifiedAt,
    networkType,
    context,
    healthStatusPercent,
  } = props;

  let sectionLabel = "Resource";

  if (context === "inventory") {
    sectionLabel = "Service Component ";
  }

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
                  }}
                >
                  <Box sx={{ color: "#475467" }}>{resourceInstanceId}</Box>
                </Box>
              </TableCell>

              <TableCell>
                <Stack
                  direction={"row"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={"10px"}
                >
                  <ResourceInstanceStatusChip status={status} />
                </Stack>
              </TableCell>

              <TableCell>
                <Stack
                  direction="row"
                  justifyContent={"center"}
                  alignItems="center"
                >
                  <Image src={regionIcon} alt="region" />
                  <Box
                    component="span"
                    ml="5.5px"
                    fontWeight={500}
                    color="#101828"
                  >
                    {region}
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
                </Stack>
              </TableCell>
              <TableCell>
                <Stack
                  direction={"row"}
                  alignItems={"flex-end"}
                  justifyContent={"center"}
                >
                  <Box sx={{ width: "100px", maxWidth: "100%" }}>
                    <GradientProgressBar percentage={healthStatusPercent} />
                  </Box>
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
