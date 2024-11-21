import { FC, useMemo, useState } from "react";
import { Box, Stack } from "@mui/material";

import DataGridHeaderTitle from "components/Headers/DataGridHeaderTitle";

import {
  getEnumFromUserRoleString,
  isOperationAllowedByRBAC,
  operationEnum,
  viewEnum,
} from "src/utils/isAllowedByRBAC";
import Button from "src/components/Button/Button";
import AddIcon from "@mui/icons-material/Add";
import DeprecateIcon from "src/components/Icons/DeprecateIcon/DeprecateIcon";
import { Text } from "src/components/Typography/Typography";

import RefreshWithToolTip from "src/components/RefreshWithTooltip/RefreshWithToolTip";
import ResourceInstanceControlPanel from "./ResourceInstanceControlPanel";
import SearchInput from "src/components/DataGrid/SearchInput";
import { SetState } from "src/types/common/reactGenerics";
import { AccessResourceInstance } from "src/types/resourceInstance";
import { CLI_MANAGED_RESOURCES } from "src/constants/resource";
import GenerateTokenDialog from "src/components/GenerateToken/GenerateTokenDialog";

type InstancesTableHeaderProps = {
  count?: number;
  selectedResourceName?: string;
  selectedInstance: AccessResourceInstance;
  handleRefresh: () => void;
  searchText: string;
  setSearchText: SetState<string>;
  isFetchingInstances: boolean;
  isCurrentResourceBYOA?: boolean;
  handleRestart?: () => void;
  handleStart?: () => void;
  handleStop?: () => void;
  handleModify?: () => void;
  handleDelete?: () => void;
  handleAddCapacity?: () => void;
  handleRemoveCapacity?: () => void;
  handleRestore?: () => void;
  handleCreate?: () => void;
  roleType?: string;
  maxNumberOfInstancesReached?: boolean;
  isDeprecated?: boolean;
  isResourceParameters?: boolean;
  isVisibleRestore?: boolean;
  selectedResourceId: string;
};

const InstancesTableHeader: FC<InstancesTableHeaderProps> = ({
  count,
  selectedInstance,
  handleRefresh,
  searchText,
  setSearchText,
  isFetchingInstances,
  selectedResourceName,
  isCurrentResourceBYOA,
  handleRestart = () => {},
  handleStart = () => {},
  handleStop = () => {},
  handleRestore = () => {},
  handleAddCapacity = () => {},
  handleRemoveCapacity = () => {},
  handleModify,
  handleDelete,
  handleCreate,
  maxNumberOfInstancesReached,
  roleType,
  isDeprecated,
  isResourceParameters,
  isVisibleRestore,
  selectedResourceId,
}) => {
  const role = getEnumFromUserRoleString(roleType);
  const view = viewEnum.Access_Resources;
  const [isGenerateTokenDialogOpen, setIsGenerateTokenDialogOpen] =
    useState(false);

  const isCreateAllowedByRBAC = isOperationAllowedByRBAC(
    operationEnum.Create,
    role,
    view
  );

  const actions = useMemo(() => {
    const actionsObj = {
      start: false,
      stop: false,
      restart: false,
      delete: false,
      restore: false,
      modify: false,
      addCapacity: false,
      removeCapacity: false,
      isVisibleCapacity: false,
      generateToken: false,
      isVisibleGenerateToken: false,
    };

    if (!selectedInstance) {
      return actionsObj;
    }

    const cliManagedResource = CLI_MANAGED_RESOURCES.includes(
      selectedInstance?.detailedNetworkTopology?.[selectedResourceId]
        ?.resourceType
    );

    const isUpdateAllowedByRBAC = isOperationAllowedByRBAC(
      operationEnum.Update,
      role,
      view
    );

    const isDeleteAllowedByRBAC = isOperationAllowedByRBAC(
      operationEnum.Delete,
      role,
      view
    );

    const { status, backupStatus } = selectedInstance || {};

    if (status === "STOPPED" && isUpdateAllowedByRBAC && !cliManagedResource) {
      actionsObj.start = true;
    }

    if (status === "RUNNING" && isUpdateAllowedByRBAC && !cliManagedResource) {
      actionsObj.stop = true;
    }

    if (
      status === "RUNNING" &&
      isUpdateAllowedByRBAC &&
      !cliManagedResource &&
      selectedInstance?.autoscalingEnabled
    ) {
      actionsObj.addCapacity = true;
      actionsObj.removeCapacity = true;
      actionsObj.isVisibleCapacity = true;
    }

    if (
      (status === "RUNNING" || status === "FAILED") &&
      isUpdateAllowedByRBAC &&
      !cliManagedResource &&
      !isCurrentResourceBYOA
    ) {
      actionsObj.restart = true;
    }

    if (
      (status === "RUNNING" || status === "FAILED") &&
      isUpdateAllowedByRBAC &&
      !isCurrentResourceBYOA
    ) {
      actionsObj.modify = true;
    }

    if (status !== "DELETING" && isDeleteAllowedByRBAC) {
      actionsObj.delete = true;
    }
    if (
      status !== "DELETING" &&
      selectedInstance?.kubernetesDashboardEndpoint?.dashboardEndpoint
    ) {
      actionsObj.isVisibleGenerateToken = true;
    }

    if (
      backupStatus?.earliestRestoreTime &&
      isUpdateAllowedByRBAC &&
      !cliManagedResource
    ) {
      actionsObj.restore = true;
    }

    return actionsObj;
  }, [selectedInstance, role, isCurrentResourceBYOA, view, selectedResourceId]);

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        p="20px"
        borderBottom="1px solid #EAECF0"
      >
        <DataGridHeaderTitle
          title={`List of ${selectedResourceName} Resource Instances`}
          desc={`Details of selected ${selectedResourceName} resource instances`}
          count={count}
          units={{
            singular: "Instance",
            plural: "Instances",
          }}
        />

        <Stack direction="row" alignItems="center" gap="12px">
          <SearchInput
            placeholder="Search by Instance ID"
            searchText={searchText}
            setSearchText={setSearchText}
            width="250px"
          />
          <RefreshWithToolTip
            refetch={handleRefresh}
            disabled={isFetchingInstances}
          />

          <Button
            sx={{ height: "40px", padding: "10px 14px !important" }}
            variant="contained"
            startIcon={<AddIcon />}
            disabled={
              isFetchingInstances ||
              !isResourceParameters ||
              isDeprecated ||
              !isCreateAllowedByRBAC ||
              maxNumberOfInstancesReached
            }
            disabledMessage={
              maxNumberOfInstancesReached
                ? `You have reached the maximum number of instances allowed`
                : !isCreateAllowedByRBAC
                  ? "You do not have permission to create instances"
                  : isDeprecated
                    ? "Resource deprecated, instance creation not allowed"
                    : ""
            }
            onClick={handleCreate}
          >
            Create
          </Button>
          {isDeprecated && (
            <Box display="flex" sx={{ marginTop: "15px" }}>
              <Box>
                <DeprecateIcon />
              </Box>
              <Text
                size="small"
                weight="semibold"
                sx={{
                  marginLeft: "10px",
                  marginTop: "3px",
                  color: "#B42318",
                }}
              >
                {"Resource deprecated, instance creation not allowed"}{" "}
              </Text>
            </Box>
          )}
          <ResourceInstanceControlPanel
            handleRestart={handleRestart}
            handleStart={handleStart}
            handleStop={handleStop}
            handleDelete={handleDelete}
            handleRestore={handleRestore}
            handleModify={handleModify}
            handleRemoveCapacity={handleRemoveCapacity}
            handleAddCapacity={handleAddCapacity}
            isAddCapacity={!actions.addCapacity}
            isRemoveCapacity={!actions.removeCapacity}
            isRestartDisabled={!actions.restart}
            isStartDisabled={!actions.start}
            isStopDisabled={!actions.stop}
            isDeleteDisabled={!actions.delete}
            isRestoreDisabled={!actions.restore}
            isLoading={isFetchingInstances || !selectedInstance}
            isModifyDisabled={!actions.modify}
            isVisibleRestore={isVisibleRestore}
            isVisibleCapacity={actions.isVisibleCapacity}
            isVisibleBYOA={isCurrentResourceBYOA}
            isVisibleGenerateToken={actions.isVisibleGenerateToken}
            handleGenerateToken={() => setIsGenerateTokenDialogOpen(true)}
          />
        </Stack>
      </Stack>
      <Stack
        direction="row"
        justifyContent="right"
        alignItems="center"
        p="12px 16px"
        borderBottom="1px solid #EAECF0"
        gap="12px"
      >
        <SpeedoMeterLegend />
        <SpeedoMeterLegend color="#f5d716" label="Medium" />
        <SpeedoMeterLegend color="#f04438" label="High" />
      </Stack>
      <GenerateTokenDialog
        dashboardEndpoint={
          selectedInstance?.kubernetesDashboardEndpoint?.dashboardEndpoint
        }
        open={isGenerateTokenDialogOpen}
        onClose={() => setIsGenerateTokenDialogOpen(false)}
        selectedInstanceId={selectedInstance?.id}
        subscriptionId={selectedInstance?.subscriptionId}
      />
    </Box>
  );
};

export default InstancesTableHeader;

const SpeedoMeterLegend = ({
  label = "Low",
  color = "rgba(23, 178, 106, 1)",
}) => (
  <Box gap="6px" display="flex" alignItems="center">
    <Box
      sx={{
        width: "8px",
        height: "8px",
        borderRadius: "100%",
        background: color,
      }}
    />
    <Text size="small" weight="regular" color="rgba(71, 84, 103, 1)">
      {label}
    </Text>
  </Box>
);
