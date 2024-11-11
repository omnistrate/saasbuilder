import { ElementType, FC, ReactNode } from "react";
import { Box, Stack, SxProps, Theme } from "@mui/material";
import styled from "@emotion/styled";

import Chip from "components/Chip/Chip";

type DataGridHeaderTitleProps = {
  icon?: ElementType;
  title: string | ReactNode;
  desc?: string | ReactNode;
  count?: number | string;
  sx?: SxProps<Theme>;
  units?: {
    singular: string;
    plural: string;
  };
};

const Title = styled("p")({
  color: "#6941C6",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "24px",
});

const Description = styled("p")({
  color: "#475467",
  fontSize: "14px",
  lineHeight: "20px",
  marginTop: "4px",
  fontWeight: 400,
});

const getLabel = (
  count: number | string,
  units?: {
    singular: string;
    plural: string;
  }
) => {
  if (typeof count === "number") {
    if (count > 0) {
      const unit = units ? (count > 1 ? units.plural : units.singular) : "";
      return `${count} ${unit}`;
    }
    return null;
  }
  return count;
};

const DataGridHeaderTitle: FC<DataGridHeaderTitleProps> = ({
  icon: Icon,
  title,
  desc,
  count,
  sx,
  units,
}) => {
  const label = getLabel(count, units);

  return (
    <Stack direction="row" gap="8px" alignItems="flex-start">
      {Icon && <Icon />}
      <Box sx={sx}>
        <Stack direction="row" gap="8px">
          <Title>{title}</Title>
          {label && (
            <Chip
              size="small"
              label={label}
              fontColor="#067647"
              bgColor="#ECFDF3"
              borderColor="#ABEFC6"
            />
          )}
        </Stack>
        {desc && <Description>{desc}</Description>}
      </Box>
    </Stack>
  );
};

export default DataGridHeaderTitle;
