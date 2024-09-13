import { useEffect, useState } from "react";
import Autocomplete, {
  StyledTextField,
} from "../FormElementsv2/AutoComplete/AutoComplete";
import { Box, InputAdornment } from "@mui/material";
import ClockIcon from "../Icons/RestoreInstance/ClockIcon";
import { Text } from "../Typography/Typography";
import { getFilteredTimeOptions } from "src/utils/restore";

function TimeSelectComponent({ formData }) {
  const { values, errors, touched, setFieldValue, setFieldTouched } = formData;
  const [filteredTimeOptions, setFilteredTimeOptions] = useState([]);

  useEffect(() => {
    //whenever date changes reset time
    if (values.time) {
      setFieldValue("time", null);
      setFieldTouched("time", false);
    }
    setFilteredTimeOptions(
      getFilteredTimeOptions(values.earliestRestoreTime, values.date)
    );
    /*eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [values.date]);

  return (
    <Autocomplete
      renderInput={(params) => (
        <StyledTextField
          {...params}
          placeholder={"hh:mm"}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <ClockIcon />
                  <Text size="medium" weight="medium" color="#101828">
                    UTC
                  </Text>
                </Box>
              </InputAdornment>
            ),
          }}
          name="time"
          id="time"
          error={!!touched.time && !!errors.time}
        />
      )}
      value={values.time}
      onChange={(e, newValue) => setFieldValue("time", newValue)}
      onBlur={() => setFieldTouched("time", true)}
      options={filteredTimeOptions}
      clearOnBlur
      freeSolo
    />
  );
}

export default TimeSelectComponent;
