import FieldContainer from "../FormElementsv2/FieldContainer/FieldContainer";
import FieldTitle from "../FormElementsv2/FieldTitle/FieldTitle";
import DateSelectComponent from "./DateSelectComponent";
import { Text } from "../Typography/Typography";
import FieldError from "../FormElementsv2/FieldError/FieldError";
import { Box } from "@mui/material";
import TimeSelectComponent from "./TimeSelectComponent";
import FieldDescription from "../FormElementsv2/FieldDescription/FieldDescription";

function RestoreInstanceDateTime({ formData }) {
  const { errors, touched } = formData;

  return (
    <Box>
      <FieldContainer>
        <FieldTitle>Select Date</FieldTitle>
        <FieldDescription sx={{ marginBottom: "6px" }}>
          Choose the date to which you want to restore your instance
        </FieldDescription>
        <DateSelectComponent formData={formData} />
        <FieldError>{touched.date && errors.date}</FieldError>
      </FieldContainer>

      <FieldContainer sx={{ marginTop: "34px" }}>
        <FieldTitle sx={{ marginBottom: "6px" }}>Select Time</FieldTitle>
        <FieldDescription sx={{ marginBottom: "6px" }}>
          Specify the exact time to restore your instance
        </FieldDescription>
        <TimeSelectComponent formData={formData} />

        <FieldError>{touched.time && errors.time}</FieldError>
      </FieldContainer>

      <Box sx={{ marginTop: "24px" }}>
        <Text size="small" weight="medium" color="#344054">
          <strong>Note :- </strong> Creating a new instance from a backup may
          take a few minutes. However this process will not affect your current
          instance.
        </Text>
      </Box>
    </Box>
  );
}

export default RestoreInstanceDateTime;
