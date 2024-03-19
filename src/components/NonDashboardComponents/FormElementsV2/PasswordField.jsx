import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";
import TextField from "./TextField";

const PasswordField = ({ bottom, ...restProps }) => {
  const [showPassword, setShowPassword] = useState(false);

  console.log("Password is required ", restProps);

  return (
    <TextField
      type={showPassword ? "text" : "password"}
      bottom={bottom}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowPassword((prev) => !prev)}
            onMouseDown={(e) => e.preventDefault()}
            edge="end"
            sx={{ marginRight: "-6px" }} // Default: "-12px"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
      {...restProps}
    />
  );
};

export default PasswordField;
