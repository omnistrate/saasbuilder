import { FC, useMemo, useState } from "react";
import { Box, Stack } from "@mui/material";
import BackupSummary from "./components/BackupSummary";
import useSnackbar from "src/hooks/useSnackbar";
import { useMutation } from "@tanstack/react-query";
import DataGrid, { selectSingleItem } from "src/components/DataGrid/DataGrid";
import StatusChip from "src/components/StatusChip/StatusChip";
import { postInstanceRestoreAccess } from "src/api/resourceInstance";
import formatDateUTC from "src/utils/formatDateUTC";
import useBackup from "./hooks/useBackup";
import { getResourceInstanceStatusStylesAndLabel } from "src/constants/statusChipStyles/resourceInstanceStatus";
import { roundNumberToTwoDecimals } from "src/utils/formatNumber";
import { initialRangeState } from "src/components/DateRangePicker/DateRangePicker";
import BackupsTableHeader from "./components/BackupTableHeader";
import { Range } from "react-date-range";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import RestoreInstanceSuccessStep from "src/components/RestoreInstance/RestoreInstanceSuccessStep";
import { getResourceInstanceBackupStatusStylesAndLabel } from "src/constants/statusChipStyles/resourceInstanceBackupStatus";
import LinearProgress from "src/components/LinearProgress/LinearProgress";
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export type BackupStatus = {
  backupPeriodInHours: string;
  backupRetentionInDays?: string;
  earliestRestoreTime?: string;
  lastBackupTime?: string;
};

export type accessQueryParams = {
  serviceProviderId?: string;
  serviceKey?: string;
  serviceAPIVersion?: string;
  serviceEnvironmentKey?: string;
  serviceModelKey?: string;
  productTierKey?: string;
  resourceKey?: string;
  subscriptionId?: string;
};

const Backup: FC<{
  instanceId: string;
  backupStatus: BackupStatus;
  serviceId: string;
  environmentId: string;
  accessQueryParams?: accessQueryParams;
  resourceName?: string;
}> = ({ instanceId, backupStatus, accessQueryParams, resourceName }) => {
  const snackbar = useSnackbar();

  const [selectionModel, setSelectionModel] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isRestoreInstanceSuccess, setRestoreInstanceSuccess] = useState(false);
  const [restoredInstanceID, setRestoredInstanceID] = useState("");
  const restoreQuery = useBackup({
    accessQueryParams,
    instanceId,
  });
  const { data: restoreData = [], isRefetching, refetch } = restoreQuery;
  const [selectedDateRange, setSelectedDateRange] =
    useState<Range>(initialRangeState);

  const handleClose = () => {
    setRestoreInstanceSuccess(false);
  };

  const filteredsnapshots = useMemo(() => {
    let filtered = restoreData;
    if (searchText) {
      filtered = filtered.filter((snapshot) =>
        snapshot?.snapshotId.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (
      selectedDateRange &&
      selectedDateRange.startDate &&
      selectedDateRange.endDate
    ) {
      const startDate = dayjs(selectedDateRange.startDate).format("YYYY-MM-DD");
      const endDate = dayjs(selectedDateRange.endDate).format("YYYY-MM-DD");

      filtered = filtered.filter((backup) => {
        const backupDate = dayjs(backup.createdTime).format("YYYY-MM-DD");

        return (
          dayjs(backupDate).isSameOrAfter(startDate) &&
          dayjs(backupDate).isSameOrBefore(endDate)
        );
      });
    }
    return filtered;
  }, [restoreData, searchText, selectedDateRange]);

  const restoreMutation = useMutation(
    async () => {
      if (selectionModel?.length > 0) {
        const snapshotId = selectionModel[0];
        const {
          serviceProviderId,
          serviceKey,
          serviceAPIVersion,
          serviceEnvironmentKey,
          serviceModelKey,
          productTierKey,
          resourceKey,
          subscriptionId,
        } = accessQueryParams;

        return await postInstanceRestoreAccess(
          serviceProviderId,
          serviceKey,
          serviceAPIVersion,
          serviceEnvironmentKey,
          serviceModelKey,
          productTierKey,
          resourceKey,
          snapshotId,
          subscriptionId
        );
      }
    },
    {
      onSuccess: (response) => {
        setRestoreInstanceSuccess(true);
        setRestoredInstanceID(response?.data);
        snackbar.showSuccess(`Restore successfully`);
      },
    }
  );

  const columns = useMemo(
    () => [
      {
        field: "snapshotId",
        headerName: "Name",
        flex: 1,
        minWidth: 190,
      },
      {
        field: "status",
        headerName: "Status",
        flex: 0.5,
        renderCell: (params) => {
          const status = params.row.status;
          const statusStylesAndMap =
            getResourceInstanceStatusStylesAndLabel(status);
          return <StatusChip status={status} {...statusStylesAndMap} />;
        },
        minWidth: 100,
      },
      {
        field: "createdTime",
        headerName: "Created On",
        flex: 1,
        minWidth: 170,
        valueGetter: (params) => formatDateUTC(params.row.createdTime),
      },
      {
        field: "completeTime",
        headerName: "Completion Time",
        flex: 1,
        minWidth: 170,
        valueGetter: (params) => formatDateUTC(params.row.completeTime),
      },
      {
        field: "progress",
        headerName: `Progress`,
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
          const progress = params.row.progress;
          return (
            <Stack direction="row" gap="8px" alignItems="center">
              <Box width="100px">
                <LinearProgress variant="determinate" value={progress} />{" "}
              </Box>
              <Box component="span" sx={{ fontSize: 14 }}>
                {roundNumberToTwoDecimals(progress)}%
              </Box>
            </Stack>
          );
        },
      },
      {
        field: "encrypted",
        headerName: "Encryption Status",
        flex: 0.7,
        renderCell: (params) => {
          const encrypted = params.row.encrypted;
          const statusStylesAndMap =
            getResourceInstanceBackupStatusStylesAndLabel(encrypted);
          return <StatusChip status={encrypted} {...statusStylesAndMap} />;
        },
        minWidth: 150,
      },
    ],
    []
  );

  return (
    <>
      <Box mt="32px" display={"flex"} flexDirection={"column"} gap="32px">
        <BackupSummary
          backupPeriodInHours={backupStatus?.backupPeriodInHours}
          backupRetentionInDays={backupStatus?.backupRetentionInDays}
          earliestRestoreTime={backupStatus?.earliestRestoreTime}
          lastBackupTime={backupStatus?.lastBackupTime}
        />
        <DataGrid
          checkboxSelection
          getRowId={(row) => row.snapshotId}
          disableColumnMenu
          disableSelectionOnClick
          hideFooterSelectedRowCount
          columns={columns}
          rows={isRefetching ? [] : filteredsnapshots}
          components={{
            Header: BackupsTableHeader,
          }}
          componentsProps={{
            header: {
              count: filteredsnapshots?.length,
              refetch,
              isRefetching,
              restoreMutation,
              searchText,
              setSearchText,
              resourceName,
              selectedDateRange,
              setSelectedDateRange,
            },
          }}
          getRowClassName={(params) => `${params.row.status}`}
          sx={{
            "& .node-ports": {
              color: "#101828",
              fontWeight: 500,
            },
            borderRadius: "8px",
          }}
          selectionModel={selectionModel}
          onSelectionModelChange={(newSelection) => {
            selectSingleItem(newSelection, selectionModel, setSelectionModel);
          }}
          loading={isRefetching}
          noRowsText="No Backups"
        />
      </Box>
      {isRestoreInstanceSuccess && (
        <RestoreInstanceSuccessStep
          handleClose={handleClose}
          restoredInstanceID={restoredInstanceID}
        />
      )}
    </>
  );
};

export default Backup;
