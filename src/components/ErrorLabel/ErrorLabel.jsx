import { Box } from "@mui/material";
import React from "react";

function ErrorLabel(props) {
  const children = props.children;
  return (
    <Box sx={{ color: "#DC2626", fontSize: 12, marginTop: "8px" }} {...props}>
      {children}
    </Box>
  );
}

export default ErrorLabel;
