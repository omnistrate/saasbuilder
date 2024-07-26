import { Box } from "@mui/material";
import { LuRefreshCw } from "react-icons/lu";

import Button from "src/components/Button/Button";
import LoadingSpinnerSmall from "src/components/CircularProgress/CircularProgress";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import FailoverIcon from "src/components/Icons/Failover/Failover";

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
      <Box p="20px 24px" borderBottom="1px solid #EAECF0">
        <DataGridHeaderTitle
          title={`List of Containers ${resourceName ? `for ${resourceName}` : ""}`}
          desc="View and manage your Containers"
          count={count ? `${count} Container${count > 1 ? "s" : ""}` : 0}
        />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        gap="12px"
        justifyContent="flex-end"
        p="12px 16px"
        borderBottom="1px solid #EAECF0"
      >
        <Button
          variant="outlined"
          startIcon={<LuRefreshCw size={18} color="#FDB022" />}
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
      </Box>
    </>
  );
};

export default NodesTableHeader;
