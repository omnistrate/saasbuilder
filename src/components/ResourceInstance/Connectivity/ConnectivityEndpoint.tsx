import { Box, SxProps, styled, Theme } from "@mui/material";
import Image from "next/image";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import MuiTableCell from "@mui/material/TableCell";
import { Text } from "src/components/Typography/Typography";
import resourcePortsIcon from "../../../../public/assets/images/dashboard/resource-instance-nodes/ports.svg";
import resourceEndpointIcon from "../../../../public/assets/images/dashboard/resource-instance-nodes/resource-endpoint.svg";
import { FC } from "react";
import CopyButton from "src/components/Button/CopyButton";

const TableCell = styled(MuiTableCell)({
  borderBottom: "none",
});

type ResourceConnectivityEndpointProps = {
  isPrimaryResource?: boolean;
  resourceName: string;
  endpointURL?: string;
  viewType: "ports" | "endpoint";
  ports?: string;
  containerStyles: SxProps<Theme>;
  context: "access" | "fleet";
};

const ResourceConnectivityEndpoint: FC<ResourceConnectivityEndpointProps> = (
  props
) => {
  const {
    resourceName,
    endpointURL,
    ports,
    containerStyles,
    viewType,
    isPrimaryResource = false,
  } = props;
  return (
    <>
      <Box
        sx={{
          border: isPrimaryResource ? "2px solid #7F56D9" : "1px solid #EAECF0",
          background: isPrimaryResource ? "#F9F5FF" : "white",
          borderRadius: "12px",
          ...containerStyles,
        }}
      >
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ paddingRight: "8px" }}>
                {viewType === "endpoint" ? (
                  <Image src={resourceEndpointIcon} alt="resource-endpoint" />
                ) : (
                  <Image src={resourcePortsIcon} alt="resource-ports" />
                )}
              </TableCell>
              <TableCell
                width="100%"
                sx={{ paddingLeft: "8px", paddingRight: "8px" }}
              >
                <Text size="small" weight="medium" color="#53389E">
                  {resourceName}
                </Text>
                <Text
                  size="small"
                  weight="regular"
                  color={isPrimaryResource ? "#6941C6" : ""}
                >
                  {`${endpointURL} : ${ports}`}
                </Text>
              </TableCell>
              <TableCell sx={{ paddingLeft: "8px" }}>
                {Boolean(endpointURL || ports) && (
                  <Box alignSelf="start">
                    <CopyButton
                      text={`${endpointURL} : ${ports}`}
                      iconProps={{ color: "#6941C6", width: 20, height: 20 }}
                    />
                  </Box>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </>
  );
};

export default ResourceConnectivityEndpoint;
