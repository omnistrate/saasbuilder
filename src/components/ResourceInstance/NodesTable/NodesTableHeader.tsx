import { Stack } from "@mui/material";

import Button from "src/components/Button/Button";
import LoadingSpinnerSmall from "src/components/CircularProgress/CircularProgress";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import FailoverIcon from "src/components/Icons/Failover/Failover";
import RefreshWithToolTip from "src/components/RefreshWithTooltip/RefreshWithToolTip";

const NodesTableHeader = ({
  resourceName,
  count,
  refetchData,
  isRefetching,
  isFailoverDisabled,
  selectedNode,
  isAccessSide,
  isInventoryManageInstance,
  handleFailover,
  failoverMutation,
}) => {
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        p="20px 24px 14px"
        borderBottom="1px solid #EAECF0"
      >
        <DataGridHeaderTitle
          title={`List of Nodes ${resourceName ? `for ${resourceName}` : ""}`}
          desc="View and manage your Nodes"
          count={count}
          units={{
            singular: "Node",
            plural: "Nodes",
          }}
        />
        <Stack direction="row" alignItems="center" gap="12px">
          <RefreshWithToolTip refetch={refetchData} disabled={isRefetching} />

          {(isAccessSide || isInventoryManageInstance) && (
            <Button
              variant="outlined"
              startIcon={<FailoverIcon disabled={isFailoverDisabled} />}
              disabled={isFailoverDisabled}
              onClick={() => {
                if (selectedNode && !isFailoverDisabled) {
                  handleFailover(selectedNode.nodeId, selectedNode.resourceKey);
                }
              }}
            >
              Failover
              {failoverMutation.isLoading && (
                <LoadingSpinnerSmall
                  sx={{ color: "#7F56D9", marginLeft: "12px" }}
                />
              )}
            </Button>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default NodesTableHeader;
