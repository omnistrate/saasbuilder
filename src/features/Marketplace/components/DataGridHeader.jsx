import { Box, Stack, InputAdornment, MenuItem } from "@mui/material";
import Chip from "components/Chip/Chip";
import { Text } from "components/Typography/Typography";

import TextField from "components/FormElementsv2/TextField/TextField";
import Select from "src/components/FormElementsv2/Select/Select";
import SubscriptionTypeDirectIcon from "src/components/Icons/SubscriptionType/SubscriptionTypeDirectIcon";
import SubscriptionTypeInvitedIcon from "src/components/Icons/SubscriptionType/SubscriptionTypeInvitedIcon";
import SearchLens from "src/components/Icons/SearchLens/SearchLens";

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
}) => {
  return (
    <Box borderBottom="1px solid #EAECF0" p="20px 24px" pt="28px">
      <Stack
        width="100%"
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap="20px"
      >
        <Stack direction="row" gap="8px">
          <Text size="large" weight="semibold">
            Detailed list of your service subscriptions
          </Text>
          {numSubscriptions > 0 && <Chip label={numSubscriptions} />}
        </Stack>
        <Actions
          searchText={searchText}
          setSearchText={setSearchText}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />
      </Stack>
    </Box>
  );
};

export default DataGridHeader;

export const Actions = (props) => {
  const { searchText, setSearchText, typeFilter, setTypeFilter } = props;
  return (
    <Stack
      direction={"row"}
      justifyContent={"flex-end"}
      alignItems={"center"}
      gap={"16px"}
    >
      <TextField
        placeholder="Search by Name"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{
          [`& .MuiOutlinedInput-input`]: {
            paddingLeft: "0px !important",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ marginLeft: "12px" }}>
              <SearchLens />
            </InputAdornment>
          ),
        }}
      />
      <Select
        sx={{ marginTop: "6px" }}
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
