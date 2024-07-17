import StatusChip from "../StatusChip/StatusChip";
import { getEventMessageStylesAndLabel } from "src/constants/statusChipStyles/eventMessage";

function EventMessageChip({ message }) {
  const { color, bgColor } = getEventMessageStylesAndLabel(message);

  return <StatusChip color={color} bgColor={bgColor} status={message} />;
}

export default EventMessageChip;
