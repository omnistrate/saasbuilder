import React from "react";
import { IconButton, InputAdornment, Stack } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { Text } from "src/components/Typography/Typography";

function convertToAsterisks(str) {
  // Get the length of the input string
  var length = str.length;

  // Create a new string with the same length filled with asterisks
  var asterisks = "*".repeat(length);

  return asterisks;
}

export const PasswordWithOutBorderField = (props) => {
  const { children } = props;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      sx={{ width: "100%" }}
    >
      <div>
        {isPasswordVisible ? (
          <Text size="large" color="#475467">
            {typeof children === "string"
              ? `${children?.slice(0, 100)}${children?.length > 100 ? "..." : ""}`
              : children}
          </Text>
        ) : (
          <Text size="large" color="#475467">
            {convertToAsterisks(children)}
          </Text>
        )}
      </div>
      {children && typeof children === "string" && (
        <InputAdornment position="end">
          <IconButton size="small" onClick={toggleVisibility}>
            {isPasswordVisible ? (
              <VisibilityOffOutlinedIcon sx={{ fontSize: "24px" }} />
            ) : (
              <VisibilityOutlinedIcon sx={{ fontSize: "24px" }} />
            )}
          </IconButton>
        </InputAdornment>
      )}
    </Stack>
  );
};
