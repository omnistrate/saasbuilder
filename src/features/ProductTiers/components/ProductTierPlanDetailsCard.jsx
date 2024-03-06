import { Box, Divider } from "@mui/material";
import React from "react";
import { Text } from "src/components/Typography/Typography";

export default function ProductTierPlanDetailsCard(props) {
  const { name, description } = props;
  return (
    <>
      <Box
        mt={4}
        sx={{
          minHeight: "400px",
          maxHeight: "600px",
          border: " 1px solid #EAECF0",
          boxShadow:
            "0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <Box mt={2} ml={2}>
          <Text size="xlarge" weight="bold" sx={{ color: "#111827" }}>
            {name}
          </Text>
        </Box>
        <Divider sx={{ mt: 2 }} />
        <Box mt={2}>
          <Box className={"ql-snow"}>
            <Box
              className={"ql-editor"}
              sx={{ wordBreak: "break-word" }}
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
