import { Box, IconButton, Stack } from "@mui/material";
import { FC } from "react";
import Button from "src/components/Button/Button";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import Add from "@mui/icons-material/Add";
import { FormMode } from "src/types/common/enums";
import RefreshIcon from "src/components/Icons/Refresh/Refresh";
import { QueryObserverResult } from "@tanstack/react-query";
import { CustomNetwork } from "src/types/customNetwork";

type CustomNetworkDataGridHeaderProps = {
  count: number;
  /*eslint-disable-next-line no-unused-vars*/
  openSideDrawer: (drawerType: FormMode) => void;
  refetchCustomNetworks: () => Promise<
    QueryObserverResult<CustomNetwork[], unknown>
  >;
  isFetchingCustomNetworks: boolean;
};

const CustomNetworkDataGridHeader: FC<CustomNetworkDataGridHeaderProps> = (
  props
) => {
  const {
    count,
    openSideDrawer,
    refetchCustomNetworks,
    isFetchingCustomNetworks,
  } = props;

  return (
    <Box
      display="flex"
      alignItems="center"
      gap="12px"
      p="20px 24px"
      borderBottom="1px solid #EAECF0"
      justifyContent="space-between"
    >
      <DataGridHeaderTitle
        title="List of Custom Networks"
        desc="List of configured custom networks"
        count={count}
        units={{
          singular: "Custom Network",
          plural: "Custom Networks",
        }}
      />
      <Stack direction="row" gap="8px">
        <IconButton
          size="small"
          disabled={isFetchingCustomNetworks}
          onClick={refetchCustomNetworks}
        >
          <RefreshIcon disabled={isFetchingCustomNetworks} />
        </IconButton>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => openSideDrawer("create")}
        >
          Create Custom Network
        </Button>
      </Stack>
    </Box>
  );
};

export default CustomNetworkDataGridHeader;
