import React from "react";
import {
  InputBase,
  styled,
  IconButton,
  InputAdornment,
  inputBaseClasses,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
const StyledTextField = styled(InputBase)(({ theme }) => ({
  // marginTop: 12,
  boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
  color: theme.palette.gray["900"],
  fontSize: "16px",
  fontWeight: 400,
  background: "#FFF",
  border: " 1px solid #D1D5DB",
  borderRadius: "6px",
  marginTop: "6px",
  [`& .${inputBaseClasses.input}`]: {
    padding: "10px 12px",
    color: "#111827",
    borderRadius: "6px",
  },
  [`&.${inputBaseClasses.error}`]: {
    border: `1px solid ${theme.palette.error[300]}`,
  },
  [`& .${inputBaseClasses.input}::placeholder`]: {
    opacity: 1,
    color: "#9CA3AF",
  },
}));

export const PasswordField = (props) => {
  const { disabled = false, values, ...restProps } = props;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <StyledTextField
      disabled={disabled}
      fullWidth
      {...restProps}
      value={values}
      type={isPasswordVisible ? "text" : "password"}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            size="small"
            sx={{ marginRight: "12px" }}
            onClick={toggleVisibility}
          >
            {isPasswordVisible ? (
              <VisibilityOffOutlinedIcon sx={{ fontSize: "20px" }} />
            ) : (
              <VisibilityOutlinedIcon sx={{ fontSize: "20px" }} />
            )}
          </IconButton>
        </InputAdornment>
      }
    />
  );
};
