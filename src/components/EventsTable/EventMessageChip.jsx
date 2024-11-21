import StatusChip from "../StatusChip/StatusChip";
import { getEventMessageStylesAndLabel } from "src/constants/statusChipStyles/eventMessage";

function EventMessageChip({ message }) {
  const messageStyles = getEventMessageStylesAndLabel(message);

  return <StatusChip {...messageStyles} />;
}

export default EventMessageChip;
