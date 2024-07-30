export type Category =
  | "success"
  | "inProgress"
  | "pending"
  | "info"
  | "terminated"
  | "failed"
  | "unknown";
export type ColorObject = {
  bgColor: string;
  color: string;
};

export const defaultChipStyles: ColorObject = {
  bgColor: "#f2f4f7",
  color: "#667085",
};

export const chipCategoryColors: Record<Category, ColorObject> = {
  success: {
    bgColor: "#ecfdf3",
    color: "#039855",
  },
  inProgress: {
    bgColor: "#e0f2fe",
    color: "#1570ef",
  },
  pending: {
    bgColor: "#faf5e7",
    color: "#f79009",
  },
  info: {
    bgColor: "#e0eaff",
    color: "#444ce7",
  },
  terminated: {
    bgColor: "#fef3f2",
    color: "#b42318",
  },
  failed: {
    bgColor: "#fee4e2",
    color: "#f04438",
  },
  unknown: {
    bgColor: "#f2f4f7",
    color: "#667085",
  },
};
