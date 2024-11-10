import { Box, Stack, InputAdornment, MenuItem } from "@mui/material";

import Select from "src/components/FormElementsv2/Select/Select";
import SubscriptionTypeDirectIcon from "src/components/Icons/SubscriptionType/SubscriptionTypeDirectIcon";
import SubscriptionTypeInvitedIcon from "src/components/Icons/SubscriptionType/SubscriptionTypeInvitedIcon";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import SearchInput from "src/components/DataGrid/SearchInput";
import Button from "src/components/Button/Button";
import SpeedometerIcon from "src/components/Icons/Speedometer/SpeedometerIcon";
import RefreshWithToolTip from "src/components/RefreshWithTooltip/RefreshWithToolTip";

const SUBSCRIPTION_TYPES = {
  all: {
    label: "All Subscriptions",
    icon: null,
  },
  direct: {
    label: "Direct",
    icon: <SubscriptionTypeDirectIcon />,
  },
  invited: {
    label: "Invited",
    icon: <SubscriptionTypeInvitedIcon />,
  },
};

const DataGridHeader = ({
  numSubscriptions,
  searchText,
  setSearchText,
  typeFilter,
  setTypeFilter,
  viewResourceInstance,
  setAnchorEl,
  isFetching,
  handleRefresh,
}) => {
  return (
    <Box borderBottom="1px solid #EAECF0" p="20px">
      <Stack
        width="100%"
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap="20px"
      >
        <DataGridHeaderTitle
          title={`Detailed list of your service subscriptions`}
          desc="View and manage your Nodes"
          count={numSubscriptions}
          units={{
            singular: "Subscription",
            plural: "Subscriptions",
          }}
        />

        <Actions
          searchText={searchText}
          setSearchText={setSearchText}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          setAnchorEl={setAnchorEl}
          viewResourceInstance={viewResourceInstance}
          isFetching={isFetching}
          handleRefresh={handleRefresh}
        />
      </Stack>
    </Box>
  );
};

export default DataGridHeader;

export const Actions = (props) => {
  const {
    searchText,
    setSearchText,
    typeFilter,
    setTypeFilter,
    viewResourceInstance,
    setAnchorEl,
    isFetching,
    handleRefresh,
  } = props;
  return (
    <Stack
      direction={"row"}
      justifyContent={"flex-end"}
      alignItems={"center"}
      gap={"16px"}
    >
      <SearchInput
        placeholder="Search by Name"
        searchText={searchText}
        setSearchText={setSearchText}
        width="250px"
      />
      <RefreshWithToolTip refetch={handleRefresh} disabled={isFetching} />
      <Button
        sx={{
          minWidth: "170px",
          height: "40px",
          border: "8px",
          padding: "10px 14px !important",
          boxShadow:
            "0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px -2px 0px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 1px rgba(16, 24, 40, 0.18)",
        }}
        variant="contained"
        startIcon={<SpeedometerIcon />}
        // disabled={
        //   isFetchingInstances ||
        //   !isResourceParameters ||
        //   isDeprecated ||
        //   !isCreateAllowedByRBAC ||
        //   maxNumberOfInstancesReached
        // }

        onClick={() => {
          setAnchorEl(null);
          viewResourceInstance();
        }}
      >
        Go To Dashboard
      </Button>
      <Select
        sx={{
          height: "40px !important",
          padding: "10px 14px !important",
          margin: "0px",
        }}
        id="type"
        name="type"
        value={typeFilter}
        onChange={(event) => {
          setTypeFilter(event.target.value);
        }}
      >
        {Object.keys(SUBSCRIPTION_TYPES).map((option) => (
          <MenuItem key={option} value={option}>
            <Stack direction={"row"} alignItems={"center"} gap="8px">
              {SUBSCRIPTION_TYPES[option]?.icon}
              {SUBSCRIPTION_TYPES[option]?.label}
            </Stack>
          </MenuItem>
        ))}
      </Select>{" "}
    </Stack>
  );
};
