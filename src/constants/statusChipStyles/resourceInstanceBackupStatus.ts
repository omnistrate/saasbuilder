import {
  Category,
  ColorObject,
  chipCategoryColors,
  defaultChipStyles,
} from "./index";

export const resourceInstanceStatusMap: Record<
  string,
  { category: Category; label: string }
> = {
  true: { category: "unknown", label: "Encrypted" },
  false: { category: "terminated", label: "Not Encrypted" },
};

export const getResourceInstanceBackupStatusStylesAndLabel = (
  status: string
): ColorObject & { label?: string } => {
  const category = resourceInstanceStatusMap[status]?.category;
  const label = resourceInstanceStatusMap[status]?.label;
  return {
    ...(category ? chipCategoryColors[category] : { ...defaultChipStyles }),
    ...(label ? { label } : {}),
  };
};
