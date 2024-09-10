import { Box, styled } from "@mui/material";

export const InfoCardContainer = styled(Box)(() => ({
  background: "#FFFFFF",
  border: "1px solid #EAECF0",
  boxShadow:
    "0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)",
  borderRadius: "12px",
  display: "flex",
  gap: "12px",
  marginTop: "20px",
}));


export const ColumnTitle = styled("h4")({
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "24px",
  color: "#475467",
  padding: "10px 0px",
  textAlign: "center",
  borderBottom: "1px solid #EAECF0;",
});

export const Column = (props) => {
  const { title, children } = props;
  return (
    <Box flex="1">
      <ColumnTitle>{title}</ColumnTitle>
      <Box
        sx={{
          padding: "16px 0px",
          display: "flex",
          justifyContent: "center",
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: "20px",
          color: "#6941C6",
          flexGrow: 1,
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
