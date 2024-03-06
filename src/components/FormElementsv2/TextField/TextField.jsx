import React from "react";
import MuiTextField from "@mui/material/TextField";
import { styled } from "@mui/material";

const StyledTextField = styled(MuiTextField, {
  shouldForwardProp: (prop) => {
    return prop !== "marginTop";
  },
})(({ theme, marginTop }) => ({
  marginTop: marginTop,

  [`.MuiOutlinedInput-root`]: {
    padding: 0,
    color: theme.palette.gray["900"],
    fontSize: "16px",
    fontWeight: 400,
    [`& .MuiOutlinedInput-input`]: {
      padding: "10px 14px",
      background: "#FFF",
      "&::placeholder": {
        color: theme.palette.gray["500"],
      },
    },

    [`& .MuiOutlinedInput-notchedOutline`]: {
      borderRadius: "8px",
      boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
      border: `1px solid  ${theme.palette.gray["300"]}`,
    },
  },
  ".MuiOutlinedInput-root.Mui-focused": {
    [`& .MuiOutlinedInput-notchedOutline`]: {
      border: `1px solid  ${theme.palette.primary["300"]}`,
      boxShadow:
        "0px 0px 0px 4px #F4EBFF, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
    },
  },
  ".MuiOutlinedInput-root.Mui-error": {
    [`& .MuiOutlinedInput-notchedOutline`]: {
      border: `1px solid  ${theme.palette.error["300"]}`,
    },
  },
  ".MuiOutlinedInput-root.Mui-error.Mui-focused": {
    [`& .MuiOutlinedInput-notchedOutline`]: {
      boxShadow:
        "0px 0px 0px 4px #FEE4E2, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
    },
  },
  ".MuiOutlinedInput-root.Mui-disabled": {
    [`& .MuiOutlinedInput-notchedOutline`]: {
      border: `1px solid  ${theme.palette.gray["300"]}`,
    },
    [`& .MuiOutlinedInput-input`]: {
      WebkitTextFillColor: theme.palette.gray["500"],
      background: theme.palette.gray["50"],
    },
  },
}));

function TextField(props) {
  const { marginTop = "6px", ...restProps } = props;
  return <StyledTextField fullWidth marginTop={marginTop} {...restProps} />;
}

export default TextField;
