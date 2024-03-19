import { TextField as MuiTextField } from "@mui/material";

const TextField = ({ type, endAdornment, bottom = -24, ...restProps }) => {
  return (
    <MuiTextField
      fullWidth
      autoComplete="off"
      type={type || "text"}
      sx={{
        ".MuiOutlinedInput-root": {
          borderRadius: "10px",
          fontSize: "14px",
          color: "#111827",
          fontWeight: "500",
          "& .MuiOutlinedInput-input": {
            padding: "16px 20px",
            backgroundColor: "#FFF",
            "&::placeholder": {
              fontSize: "14px",
              // color: "#A0AEC0",
              color: "#767F8C",
            },
          },
        },
      }}
      InputProps={{
        endAdornment: endAdornment || null,
      }}
      FormHelperTextProps={{
        sx: {
          position: "absolute",
          left: "0px",
          bottom: bottom,
        },
      }}
      {...restProps}
    />
  );
};

export default TextField;
