import { Box, styled } from "@mui/material";

const FieldContainer = styled(Box)(({ marginTop }) => ({
  marginTop: marginTop ?? 16,
}));

export default FieldContainer;
