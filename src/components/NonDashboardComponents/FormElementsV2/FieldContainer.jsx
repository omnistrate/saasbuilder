import { Stack } from "@mui/material";

const FieldContainer = ({ children, mb = "" }) => {
  return (
    <Stack mb={mb} gap="10px">
      {children}
    </Stack>
  );
};

export default FieldContainer;
