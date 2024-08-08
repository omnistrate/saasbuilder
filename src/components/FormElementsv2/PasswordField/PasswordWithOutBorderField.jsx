import { useState } from "react";
import { IconButton, InputAdornment, Stack, Tooltip } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOff";
import { Text } from "src/components/Typography/Typography";

function convertToAsterisks(str) {
  // Get the length of the input string
  const length = str.length > 100 ? 100 : str.length;

  // Create a new string with the same length filled with asterisks
  const asterisks = "*".repeat(length);

  return asterisks;
}
export const PasswordWithOutBorderField = (props) => {
  const { children } = props;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const toggleVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-end">
      <div>
        {isPasswordVisible ? (
          <Tooltip title={children} placement="top" arrow>
            <div>
              <Text
                size="small"
                weight="semibold"
                color="#667085"
                sx={{
                  wordBreak: "break-word",
                }}
              >
                {typeof children === "string"
                  ? `${children?.slice(0, 100)}${children?.length > 100 ? "..." : ""}`
                  : children}
              </Text>
            </div>
          </Tooltip>
        ) : (
          <Text
            size="small"
            weight="semibold"
            color="#667085"
            sx={{
              wordBreak: "break-word",
            }}
          >
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
