import { getEventTypeStylesAndLabel } from "src/constants/statusChipStyles/eventType";
import StatusChip from "src/components/StatusChip/StatusChip";
import { EventType } from "src/types/event";
import { FC } from "react";

type EventTypeChipProps = {
  eventType: EventType;
};

const EventTypeChip: FC<EventTypeChipProps> = (props) => {
  const { eventType } = props;
  const stylesAndLabel = getEventTypeStylesAndLabel(eventType);

  return (
    <StatusChip
      {...stylesAndLabel}
      fontStyles={{ fontSize: "13px", lineHeight: "20px", fontWeight: 500 }}
    />
  );
};

export default EventTypeChip;
