import { Box, styled } from "@mui/material";
import { DisplayText } from "../Typography/Typography";

export const TableContainer = styled(Box)(() => ({
  border: "1px solid #EAECF0",
  backgroundColor: "white",
  boxShadow:
    "0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)",
  borderRadius: 12,
  padding: 20,
}));

export const TableTitle = styled((props) => (
  <DisplayText {...props} size="xsmall" />
))(() => ({}));
