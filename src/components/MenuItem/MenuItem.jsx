import { styled } from "@mui/material";
import MuiMenuItem from "@mui/material/MenuItem";

const MenuItem = styled(MuiMenuItem)(() => {
  return {
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: 500,
    color: "#344054",
    display: "flex",
    alignItems: "center",
  };
});

export default MenuItem;
