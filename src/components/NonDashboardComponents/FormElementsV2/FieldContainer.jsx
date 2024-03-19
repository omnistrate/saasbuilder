import { Stack } from "@mui/material";

const FieldContainer = ({ children, ...restprop }) => {
  return (
    <Stack sx={{ ...restprop }} gap="10px">
      {children}
    </Stack>
  );
};

export default FieldContainer;
