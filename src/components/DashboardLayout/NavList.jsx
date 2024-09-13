import MuiList from "@mui/material/List";
import { styled } from "@mui/material/styles";

export const List = styled(MuiList, {
  shouldForwardProp: (prop) => prop !== "open",
})(() => ({
  marginTop: "20px",
}));
