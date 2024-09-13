import * as React from "react";
import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";

const UnCheckedIcon = styled("span")(() => ({
  borderRadius: 4,
  width: 16,
  height: 16,
  border: "1px solid #98A2B3",
  background: "#fff",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: "#F2F4F7",
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background: "#EAECF0",
  },
}));

const CheckedIcon = styled(UnCheckedIcon)({
  border: "1px solid  #7F56D9",
  background: "#F9F5FF",
  backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIiBmaWxsPSJub25lIj4KICA8cGF0aCBkPSJNMTAgM0w0LjUgOC41TDIgNiIgc3Ryb2tlPSIjN0Y1NkQ5IiBzdHJva2Utd2lkdGg9IjEuNjY2NiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==)`,
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  "input:hover ~ &": {
    backgroundColor: "rgba(105, 65, 198, 0.15)",
  },
});

const CustomCheckbox = React.forwardRef(function CustomCheckbox(props, ref) {
  return (
    <Checkbox
      sx={{
        "&:hover": { bgcolor: "transparent" },
      }}
      disableRipple
      color="default"
      checkedIcon={<CheckedIcon />}
      icon={<UnCheckedIcon />}
      inputProps={{ "aria-label": "Checkbox demo" }}
      ref={ref}
      {...props}
    />
  );
});

export default CustomCheckbox;
