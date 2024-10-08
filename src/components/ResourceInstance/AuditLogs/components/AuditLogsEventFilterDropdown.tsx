import { FC } from "react";
import MuiMenuItem, { menuItemClasses } from "@mui/material/MenuItem";
import Select from "src/components/FormElementsv2/Select/Select";
import { EventType } from "src/types/event";
import Checkbox from "src/components/Checkbox/Checkbox";
import { SelectChangeEvent, Stack, styled } from "@mui/material";
import { SetState } from "src/types/common/reactGenerics";
import Chip from "src/components/Chip/Chip";
import { Text } from "src/components/Typography/Typography";
import EventTypeChip from "../../../EventsTable/EventTypeChip";

const MenuItem = styled(MuiMenuItem)({
  borderRadius: 6,
  padding: "12px 18px",
  fontSize: "16px",
  fontWeight: 500,
  lineHeight: "24px",
  color: "#101828",
  backgroundColor: "white",
  "&+&": {
    marginTop: "0px",
  },
  [`&.${menuItemClasses.selected}`]: {
    backgroundColor: "white",
  },
  [`&.${menuItemClasses.focusVisible}`]: {
    backgroundColor: "white",
  },
});

type DropdownProps = {
  selectedEventTypes: string[];
  setSelectedEventTypes: SetState<string[]>;
};
const eventTypes: EventType[] = ["Customer", "Infra", "Maintenance"];

const AuditLogsEventFilterDropdown: FC<DropdownProps> = (props) => {
  const { selectedEventTypes, setSelectedEventTypes } = props;

  const handleChange = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;
    setSelectedEventTypes(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <Select
      multiple
      value={selectedEventTypes}
      renderValue={() => {
        return (
          <Stack direction="row" gap="8px" alignItems="center">
            {selectedEventTypes.length > 0 && (
              <Chip size="small" label={selectedEventTypes.length} />
            )}
            <Text size="small" weight="medium" color="#344054">
              Filter by Type
            </Text>
          </Stack>
        );
      }}
      sx={{ width: "auto", marginTop: 0, minWidth: "169px", minHeight: "42px" }}
      onChange={handleChange}
      displayEmpty
    >
      {eventTypes.map((eventType) => {
        return (
          <MenuItem key={eventType} value={eventType}>
            <Checkbox
              //@ts-ignore
              sx={{ padding: "0px", marginRight: "8px" }}
              checked={selectedEventTypes.indexOf(eventType) > -1}
            />{" "}
            <EventTypeChip eventType={eventType} />
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default AuditLogsEventFilterDropdown;
