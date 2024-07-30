import { Box, Stack } from "@mui/material";
import DataGrid from "../../DataGrid/DataGrid";
import { Text } from "../../Typography/Typography";
import { useEffect, useMemo, useState } from "react";
import nodeIcon from "public/assets/images/dashboard/resource-instance-nodes/node.svg";
import zoneIcon from "public/assets/images/dashboard/resource-instance-nodes/zone.svg";
import Image from "next/image";
import StatusChip from "../../StatusChip/StatusChip";
import { useMutation } from "@tanstack/react-query";
import { failoverResourceInstanceNode } from "../../../api/resourceInstance";
import GridCellExpand from "../../GridCellExpand/GridCellExpand";
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
import NodesTableHeader from "./NodesTableHeader";
import {
  getResourceInstanceStatusStylesAndLabel,
  resourceInstanceStatusMap,
} from "src/constants/statusChipStyles/resourceInstanceStatus";
import {
  chipCategoryColors,
  defaultChipStyles,
} from "src/constants/statusChipStyles";

export default function NodesTable(props) {
  const {
    isInventoryManageInstance,
    isManagedProxy,
    isAccessSide,
    subscriptionData,
    nodes,
    refetchData,
    isRefetching,
    resourceName,
    serviceOffering,
    resourceInstanceId,
    context,
    subscriptionId,
    resourceId,
    serviceId,
    environmentId,
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
        minWidth: 100,

        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          const endpoint = params.row.endpoint;
          if (!endpoint || endpoint === "-internal") {
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
        valueGetter: (params) => params.row.ports || "-",
      },
      {
        field: "availabilityZone",
        headerName: "Availability Zone",
        flex: 1,
        minWidth: 100,

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
          const statusStylesAndMap =
            getResourceInstanceStatusStylesAndLabel(status);
          return <StatusChip status={status} {...statusStylesAndMap} />;
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
                  <NodeStatus
                    detailedHealth={params.row?.detailedHealth}
                    isStopped={params.row.healthStatus === "STOPPED"}
                  />
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
    (payload) => failoverResourceInstanceNode(payload),
    {
      onSuccess: async () => {
        await refetchData();
        setSelectionModel([]);
      },
    }
  );

  function handleFailover(nodeId, resourceKey) {
    if (isInventoryManageInstance && nodeId) {
      failoverMutation.mutate({
        resourceKey: resourceKey,
        failedReplicaID: nodeId,
      });
    } else if (serviceOffering && nodeId) {
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
      <Card sx={{ minHeight: "500px", mt: "24px" }}>
        <Stack direction="row" justifyContent="center" marginTop="200px">
          <Text size="xlarge">No Containers data</Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Box height="700px" mt={3}>
      <DataGrid
        checkboxSelection
        disableColumnMenu
        disableSelectionOnClick
        hideFooterSelectedRowCount
        columns={columns}
        rows={filteredNodes}
        components={{
          Header: NodesTableHeader,
          NoRowsOverlay: (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No Containers Found
            </Stack>
          ),
        }}
        componentsProps={{
          header: {
            resourceName,
            count: filteredNodes.length,
            refetchData,
            isRefetching,
            isFailoverDisabled:
              !isFailoverEnabled ||
              failoverMutation.isLoading ||
              !modifyAccessServiceAllowed ||
              (isInventoryManageInstance && isManagedProxy), //can't failover fleet instances of type serverless proxy and managedProxyType==="PortsbasedProxy"
            selectedNode,
            isAccessSide,
            isInventoryManageInstance,
            handleFailover,
            failoverMutation,
          },
        }}
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
  );
}

const getRowBorderStyles = () => {
  const styles = {};

  for (const status in resourceInstanceStatusMap) {
    const category = resourceInstanceStatusMap[status]?.category;
    let color = chipCategoryColors[category]?.color;
    if (!color) {
      color = defaultChipStyles.color;
    }
    styles[`& .${status}::before`] = {
      content: '""',
      height: "40px",
      width: "3px",
      borderRadius: "6px",
      background: color,
      transform: "translateY(5px)",
      position: "absolute",
    };
  }

  return styles;
};
