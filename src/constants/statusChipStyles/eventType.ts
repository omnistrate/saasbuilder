import { EventType } from "src/types/event";
import { ColorObject } from "./index";

const stylesMap: Record<EventType, ColorObject & { label: string }> = {
  Customer: {
    color: "#6941C6",
    bgColor: "#F9F5FF",
    label: "Customer",
  },
  Infra: {
    color: "#C11574",
    bgColor: "#F9F5FF",
    label: "Infra",
  },
  Maintenance: {
    color: "#026AA2",
    bgColor: "#F0F9FF",
    label: "Maintenance",
  },
};

export function getEventTypeStylesAndLabel(
  eventType: EventType
): ColorObject & { label: string } {
  let styles = stylesMap[eventType];

  if (!styles) {
    styles = { ...stylesMap["Infra"], label: eventType };
  }

  return styles;
}
