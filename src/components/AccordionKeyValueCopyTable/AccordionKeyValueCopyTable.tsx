import { Box, Stack, styled } from "@mui/material";
import { FC } from "react";
import { Text } from "../Typography/Typography";
import CopyButton from "../Button/CopyButton";

type AccordionKeyValueCopyTableRowProps = {
  label: string;
  value: string;
  copyValue?: string;
};

type AccordionKeyValueCopyProps = {
  rows: AccordionKeyValueCopyTableRowProps[];
};

const RowContainer = styled(Box)({
  display: "flex",
  flexDirection: "row",
  border: "1px solid #D0D5DD",
  borderRadius: "8px",
  boxShadow: "0px 1px 2px 0px #1018280D",
  "& + &": {
    marginTop: "16px",
  },
});

export const AccordionKeyValueCopyTableRow: FC<
  AccordionKeyValueCopyTableRowProps
> = (props) => {
  const { label, value, copyValue } = props;
  return (
    <RowContainer>
      <Box
        width="150px"
        p="10px 7px 10px 14px"
        borderRight="1px solid #D0D5DD"
        bgcolor="#F2F4F7"
        sx={{ borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" }}
        flexShrink={0}
      >
        <Text size="medium" weight="regular" color="#475467">
          {label}
        </Text>
      </Box>

      <Stack
        direction="row"
        overflow="hidden"
        flexGrow={1}
        p="12px 0px 12px 14px"
      >
        <Box flexGrow={1}>
          <Text size="small" weight="regular" color="#101828">
            {value}
          </Text>
        </Box>
        <Box px="4px">
          <CopyButton text={copyValue || value} />
        </Box>
      </Stack>
    </RowContainer>
  );
};

const AccordionKeyValueCopyTable: FC<AccordionKeyValueCopyProps> = (props) => {
  const { rows } = props;
  return rows.map((rowData, index) => {
    return (
      <AccordionKeyValueCopyTableRow
        label={rowData.label}
        value={rowData.value}
        key={index}
      />
    );
  });
};

export default AccordionKeyValueCopyTable;
