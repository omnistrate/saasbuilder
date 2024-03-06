import { Box, Stack } from "@mui/material";

const GoogleLoginButton = ({ lineText }) => {
  const pseudoStyles = {
    flex: 1,
    content: "",
    padding: "1px",
    backgroundColor: "#F1F2F4",
  };

  return (
    <Stack gap="16px">
      <Box
        display="flex"
        alignItems="center"
        gap="16px"
        fontWeight="500"
        fontSize="14px"
        lineHeight="22px"
        color="#687588"
        sx={{
          "&::before": pseudoStyles,
          "&::after": pseudoStyles,
        }}
      >
        {lineText}
      </Box>

      {/* TODO: Google Button */}
    </Stack>
  );
};

export default GoogleLoginButton;
