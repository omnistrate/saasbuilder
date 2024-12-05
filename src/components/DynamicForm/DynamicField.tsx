import { FC, useState } from "react";
import { SxProps, Theme, Stack, InputAdornment, Box } from "@mui/material";
import Generator from "generate-password";
import FieldLabel from "src/components/FormElements/FieldLabel/FieldLabel";
import Autocomplete from "src/components/FormElementsv2/AutoComplete/AutoComplete";
import FieldContainer from "src/components/FormElementsv2/FieldContainer/FieldContainer";
import FieldDescription from "src/components/FormElementsv2/FieldDescription/FieldDescription";
import FormControlLabel from "src/components/FormElementsv2/FormControlLabel/FormControlLabel";
import MenuItem from "src/components/FormElementsv2/MenuItem/MenuItem";
import Radio, { RadioGroup } from "src/components/FormElementsv2/Radio/Radio";
import Select from "src/components/FormElementsv2/Select/Select";
import TextField from "src/components/FormElementsv2/TextField/TextField";
import FieldError from "src/components/FormElementsv2/FieldError/FieldError";
import { Text } from "src/components/Typography/Typography";
import KeyIcon from "src/components/Icons/Key/KeyIcon";
import Tooltip from "../Tooltip/Tooltip";

type DynamicFieldProps = {
  field: any;
  formData: any;
  sx?: SxProps<Theme>;
};

const PasswordInput = ({ field, formData, value }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <TextField
      inputProps={{
        "data-testid": field.dataTestId,
      }}
      autoComplete="new-password"
      type={isPasswordVisible ? "text" : "password"}
      id={field.name}
      name={field.name}
      value={value || formData.values[field.name]}
      onChange={(e) => {
        field.onChange?.(e);
        formData.handleChange(e);
      }}
      error={Boolean(
        formData.touched[field.name] && formData.errors[field.name]
      )}
      onBlur={(e) => {
        field.onBlur?.(e);
        formData.handleBlur(e);
      }}
      disabled={field.disabled}
      placeholder={field.placeholder}
      sx={{
        "& .MuiInputAdornment-root": {
          border: "none",
          paddingRight: 0,
        },
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Text
              size="xsmall"
              weight="medium"
              style={{
                color: "#7F56D9",
                cursor: "pointer",
                userSelect: "none",
                paddingRight: "14px",
                width: "46px",
                textAlign: "center",
              }}
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? "Hide" : "Show"}
            </Text>
            {field.showPasswordGenerator && (
              <Tooltip title="Password Generator" placement="top-end" arrow>
                <Box
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: "15px",
                    backgroundColor: "#F9F5FF",
                    height: "100%",
                    borderRadius: "0 8px 8px 0",
                    borderLeft: "1px solid #D0D5DD",
                  }}
                  onClick={() => {
                    const password = Generator.generate({
                      length: 12,
                      numbers: true,
                    });

                    formData.setFieldValue(field.name, password);
                    field.onChange?.({
                      target: {
                        name: field.name,
                        value: password,
                      },
                    });
                  }}
                >
                  <KeyIcon />
                </Box>
              </Tooltip>
            )}
          </InputAdornment>
        ),
      }}
    />
  );
};

const DynamicField: FC<DynamicFieldProps> = ({ field, formData, sx = {} }) => {
  const {
    type,
    name,
    value,
    menuItems = [],
    options = [],
    isHidden,
    isLoading, // For Menu Items in Select Field
    placeholder = "",
    dataTestId = "",
    emptyMenuText = "No Options Available",
    customComponent,
  } = field;
  const { values, handleBlur, handleChange, touched, errors } = formData;

  if (isHidden) {
    return null;
  }

  let Field = null;

  if (customComponent) {
    Field = customComponent;
  } else if (type === "text" || type === "description" || type === "number") {
    Field = (
      <TextField
        inputProps={{
          "data-testid": dataTestId,
        }}
        type={type === "number" ? "number" : "text"}
        id={name}
        name={name}
        value={value || values[name]}
        onChange={(e) => {
          field.onChange?.(e);
          handleChange(e);
        }}
        error={Boolean(touched[name] && errors[name])}
        onBlur={(e) => {
          field.onBlur?.(e);
          handleBlur(e);
        }}
        disabled={field.disabled}
        {...(type === "description" && {
          multiline: true,
          minRows: 3,
          maxRows: 6,
        })}
        placeholder={placeholder}
      />
    );
  } else if (type === "password") {
    Field = <PasswordInput field={field} formData={formData} value={value} />;
  } else if (type === "select") {
    Field = (
      <Select
        selectProps={{
          "data-testid": dataTestId,
        }}
        isLoading={isLoading}
        id={name}
        name={name}
        value={value || values[name]}
        onBlur={(e) => {
          field.onBlur?.(e);
          handleBlur(e);
        }}
        onChange={(e) => {
          field.onChange?.(e);
          handleChange(e);
        }}
        error={Boolean(touched[name] && errors[name])}
        disabled={field.disabled}
      >
        {menuItems?.length > 0 ? (
          menuItems.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem value="" disabled>
            <i>{emptyMenuText}</i>
          </MenuItem>
        )}
      </Select>
    );
  } else if (type === "single-select-autocomplete") {
    Field = (
      <Autocomplete
        data-testid={dataTestId}
        options={menuItems}
        name={name}
        value={value}
        onChange={(e, newValue) => {
          field.onChange?.(e);
          formData.setFieldValue(name, newValue);
        }}
        onBlur={(e) => {
          field.onBlur?.(e);
          formData.setFieldTouched(name, true);
        }}
        disabled={field.disabled}
        getOptionLabel={(option) => option}
        error={Boolean(touched[name] && errors[name])}
      />
    );
  } else if (type === "multi-select") {
    Field = (
      <Autocomplete
        data-testid={dataTestId}
        multiple
        options={menuItems}
        name={name}
        value={value || values[name]}
        onChange={(e, newValue) => {
          field.onChange?.(e);
          formData.setFieldValue(name, newValue);
        }}
        onBlur={() => {
          formData.setFieldTouched(name, true);
        }}
        disabled={field.disabled}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        error={Boolean(touched[name] && errors[name])}
      />
    );
  } else if (type === "radio") {
    Field = (
      <RadioGroup
        row
        name={name}
        value={value !== undefined ? value : values[name]} // For the case when value might be 'false'
        onChange={(e) => {
          field.onChange?.(e);
          handleChange(e);
        }}
      >
        {options.map((option) => (
          <FormControlLabel
            data-testid={dataTestId}
            control={<Radio />}
            key={option.value}
            value={option.value}
            label={
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"flex-start"}
                gap="2px"
              >
                {option.label}
                {option.labelChips?.map((item) => item)}
              </Stack>
            }
            disabled={option.disabled}
          />
        ))}
      </RadioGroup>
    );
  }

  return (
    <FieldContainer sx={sx}>
      <FieldLabel required={field.required}>{field.label}</FieldLabel>
      <FieldDescription>{field.description}</FieldDescription>

      {Field}

      <FieldError>{touched[field.name] && errors[field.name]}</FieldError>
    </FieldContainer>
  );
};

export default DynamicField;
