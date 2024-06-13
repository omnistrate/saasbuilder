import { Box, Stack } from "@mui/material";
import DataGrid from "../../DataGrid/DataGrid";
import { Text } from "../../Typography/Typography";
import { useEffect, useMemo, useState } from "react";
import LoadingSpinnerSmall from "../../CircularProgress/CircularProgress";
import Button from "../../Button/Button";
import nodeIcon from "../../../../public/assets/images/dashboard/resource-instance-nodes/node.svg";
import zoneIcon from "../../../../public/assets/images/dashboard/resource-instance-nodes/zone.svg";
import Divider from "../../Divider/Divider";
import Image from "next/image";
import StatusChip, { statusStyles } from "../../StatusChip/StatusChip";
import { LuRefreshCw } from "react-icons/lu";
import {
  TableContainer,
  TableTitle,
} from "../../TableComponents/TableComponents";
import { useMutation } from "@tanstack/react-query";
import { failoverResourceInstanceNode } from "../../../api/resourceInstance";
import GridCellExpand from "../../GridCellExpand/GridCellExpand";
import FailoverIcon from "../../Icons/Failover/Failover";
import {
  getEnumFromUserRoleString,
  isOperationAllowedByRBAC,
  operationEnum,
  viewEnum,
} from "../../../utils/isAllowedByRBAC";
import { useSelector } from "react-redux";
import { selectUserrootData } from "../../../slices/userDataSlice";
import Card from "src/components/Card/Card";
import { NodeStatus } from "./NodeStatus";
import DataGridText from "src/components/DataGrid/DataGridText";

export default function NodesTable(props) {
  const {
    isAccessSide,
    subscriptionData,
    nodes,
    refetchData,
    isRefetching,
    resourceName,
    isFailoverLoading,
    serviceOffering,
    resourceKey,
    resourceInstanceId,
    context,
    subscriptionId,
  } = props;
  let sectionLabel = "Resource";

  if (context === "inventory") {
    sectionLabel = "Service Component";
  }
  const [selectionModel, setSelectionModel] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const selectUser = useSelector(selectUserrootData);
  const role = getEnumFromUserRoleString(
    isAccessSide ? subscriptionData?.roleType : selectUser.roleType
  );
  const view = viewEnum.Access_Resources;

  const modifyAccessServiceAllowed = isOperationAllowedByRBAC(
    operationEnum.Update,
    role,
    view
  );

  //remove serverless nodes added on frontend
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => !node.isServerless);
  }, [nodes]);

  const columns = useMemo(
    () => [
      {
        field: "nodeId",
        headerName: "Container ID",
        flex: 1,
        minWidth: 190,
        renderCell: (params) => {
          const nodeId = params.row.nodeId;
          return (
            <GridCellExpand
              startIcon={<Image src={nodeIcon} alt="node" />}
              value={nodeId}
              textStyles={{
                color: "#101828",
                marginLeft: "4px",
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 500,
              }}
            />
          );
        },
        headerAlign: "center",
        align: "center",
      },
      {
        field: "resourceName",
        headerName: `${sectionLabel} Name`,
        flex: 0.9,
        minWidth: 100,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "endpoint",
        headerName: "Endpoint",
        flex: 1,
        minWidth: 190,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          const endpoint = params.row.endpoint;
          if (!endpoint) {
            return "-";
          }
          return (
            <DataGridText showCopyButton>{params.row.endpoint}</DataGridText>
          );
        },
      },
      {
        field: "ports",
        headerName: "Ports",
        flex: 0.7,
        minWidth: 100,
        headerAlign: "center",
        align: "center",
        cellClassName: "node-ports",
      },
      {
        field: "availabilityZone",
        headerName: "Availability Zone",
        flex: 1,
        minWidth: 150,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          const availabilityZone = params.row.availabilityZone;
          return (
            <GridCellExpand
              startIcon={<Image src={zoneIcon} alt="zone" />}
              value={availabilityZone}
              textStyles={{
                color: "#101828",
                marginLeft: "4px",
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 500,
              }}
            />
          );
        },
      },
      {
        field: "status",
        headerName: "Lifecycle Status",
        flex: 0.9,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          const status = params.row.status;
          return <StatusChip status={status} />;
        },
        minWidth: 200,
      },
      {
        field: "healthStatus",
        headerName: "Health Status",
        flex: 0.9,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          const status = params.row.healthStatus
            ? params.row.healthStatus
            : "UNKNOWN";
          return (
            <>
              {params.row?.detailedHealth ? (
                <>
                  <NodeStatus detailedHealth={params.row?.detailedHealth} />
                </>
              ) : (
                <StatusChip
                  status={status}
                  {...(status === "HEALTHY"
                    ? { pulsateDot: true }
                    : { dot: true })}
                />
              )}
            </>
          );
        },
        minWidth: 180,
      },
    ],
    [sectionLabel]
  );

  const failoverMutation = useMutation(
    (payload) => {
      return failoverResourceInstanceNode(payload);
    },
    {
      onSuccess: (response) => {
        refetchData();
        setSelectionModel([]);
      },
    }
  );

  function handleFailover(nodeId, resourceKey) {
    if (serviceOffering && nodeId) {
      failoverMutation.mutate({
        serviceProviderId: serviceOffering?.serviceProviderId,
        serviceKey: serviceOffering?.serviceURLKey,
        serviceAPIVersion: serviceOffering?.serviceAPIVersion,
        serviceEnvironmentKey: serviceOffering?.serviceEnvironmentURLKey,
        serviceModelKey: serviceOffering?.serviceModelURLKey,
        productTierKey: serviceOffering?.productTierURLKey,
        resourceKey: resourceKey,
        instanceId: resourceInstanceId,
        failedReplicaId: nodeId,
        subscriptionId: subscriptionId,
      });
    }
  }

  useEffect(() => {
    if (selectionModel.length > 0) {
      const selectedNodeId = selectionModel[0];
      const node = filteredNodes.find((node) => node.id === selectedNodeId);
      if (node) {
        setSelectedNode(node);
      }
    } else {
      setSelectedNode(null);
    }
  }, [selectionModel, filteredNodes]);

  let isFailoverEnabled = false;

  if (selectedNode && selectedNode.status === "RUNNING") {
    isFailoverEnabled = true;
  }

  if (!filteredNodes?.length) {
    return (
      <Card sx={{ minHeight: "500px", marginTop: "54px" }}>
        <Stack direction="row" justifyContent="center" marginTop="200px">
          <Text size="xlarge">No Containers data</Text>
        </Stack>
      </Card>
    );
  }

  return (
    <TableContainer mt={3}>
      <TableTitle>
        List of Containers {resourceName ? "for" : ""} {resourceName}
      </TableTitle>
      <Divider sx={{ marginTop: "10px" }} />
      <Stack direction="row" justifyContent="space-between" mt="10px">
        <Box></Box>
        <Box display="flex" alignItems="center">
          <Button
            size="large"
            variant="outlined"
            startIcon={<LuRefreshCw size={18} color="#FDB022" />}
            sx={{ marginRight: "11px" }}
            disabled={isRefetching}
            onClick={refetchData}
          >
            Refresh
            {isRefetching && (
              <LoadingSpinnerSmall
                sx={{ color: "#7F56D9", marginLeft: "12px" }}
              />
            )}
          </Button>
          {isAccessSide && (
            <Button
              size="large"
              variant="outlined"
              startIcon={
                <FailoverIcon color={!isFailoverEnabled && "#EAECF0"} />
              }
              sx={{ marginRight: "11px" }}
              disabled={
                !isFailoverEnabled ||
                isFailoverLoading ||
                !modifyAccessServiceAllowed
              }
              onClick={() => {
                if (selectedNode && isFailoverEnabled) {
                  handleFailover(selectedNode.nodeId, selectedNode.resourceKey);
                }
              }}
            >
              Failover
              {isFailoverLoading && (
                <LoadingSpinnerSmall
                  sx={{ color: "#7F56D9", marginLeft: "12px" }}
                />
              )}
            </Button>
          )}
        </Box>
      </Stack>
      <Box height="708px" mt={3}>
        <DataGrid
          checkboxSelection
          disableColumnMenu
          columns={columns}
          rows={filteredNodes}
          //rows={rows}
          components={{ NoResultsOverlay: "" }}
          rowHeight={72}
          rowsPerPageOptions={[10]}
          pageSize={10}
          disableSelectionOnClick
          getRowClassName={(params) => `${params.row.status}`}
          sx={{
            [`& .node-ports`]: {
              color: "#101828",
              fontWeight: 500,
            },
            ...getRowBorderStyles(),
          }}
          selectionModel={selectionModel}
          onSelectionModelChange={(newRowSelectionModel) => {
            if (newRowSelectionModel.length > 0) {
              const selectionSet = new Set(selectionModel);
              const newSelectedItem = newRowSelectionModel.filter(
                (s) => !selectionSet.has(s)
              );
              setSelectionModel(newSelectedItem);
            } else {
              setSelectionModel(newRowSelectionModel);
            }
          }}
        />
      </Box>
    </TableContainer>
  );
}

const getRowBorderStyles = () => {
  const styles = {};

  for (let statusType in statusStyles) {
    let color = statusStyles[statusType].color;
    if (!color) {
      color = "#06AED4";
    }
    styles[`& .${statusType}::before`] = {
      content: '""',
      height: "60px",
      width: "3px",
      borderRadius: "6px",
      background: color,
      transform: "translateY(5px)",
      position: "absolute",
    };
  }

  return styles;
};
