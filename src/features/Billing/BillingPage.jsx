import { Box, LinearProgress, Stack } from "@mui/material";
import Button from "src/components/Button/Button";
import Chip from "src/components/Chip/Chip";
import { DisplayText, Text } from "src/components/Typography/Typography";
import useBillingDetails from "src/hooks/query/useBillingDetails";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import Card from "src/components/Card/Card";
import { useState } from "react";
import Link from "next/link";

function BillingPage() {
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const billingDetailsQuery = useBillingDetails();

  const { isLoading, data: billingDetails } = billingDetailsQuery;

  const paymentConfigured = billingDetails?.paymentConfigured;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (billingDetailsQuery.error) {
    const errorMessage = billingDetailsQuery.error?.response?.data?.message;
    let errorDisplayText =
      "Something went wrong. Try refreshing the page. If the issue persists please contact support for assistance";

    if (errorMessage) {
      if (
        errorMessage ===
          "Your provider has not enabled billing for the user." ||
        errorMessage ===
          "Your provider has not enabled billing for the services."
      ) {
        errorDisplayText =
          "Billing has not been configured. Please contact support for assistance";
      }

      if (errorMessage === "You have not been subscribed to a service yet.") {
        errorDisplayText =
          "Please subscribe to a service to start using billing";
      }

      if (
        errorMessage ===
        "You have not been enrolled in a service plan with a billing plan yet."
      ) {
        errorDisplayText =
          "You have not been enrolled in a service plan with a billing plan. Please contact support for assistance";
      } else {
        errorDisplayText = errorMessage;
      }
    }

    return (
      <Stack p={3} pt="200px" alignItems="center" justifyContent="center">
        <DisplayText
          size="xsmall"
          sx={{ wordBreak: "break-word", textAlign: "center", maxWidth: 900 }}
        >
          {errorDisplayText}
        </DisplayText>
      </Stack>
    );
  }

  return (
    <>
      <DisplayText size="small">Billing</DisplayText>
      <Text size="medium" color="#475467" weight="regular" mt="4px">
        Manage your billing and payment details
      </Text>

      <Card sx={{ mt: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Text size="large" sx={{ display: "inline-block" }}>
              Payment Method{" "}
            </Text>
            <Chip
              sx={{ marginLeft: "10px" }}
              label={
                paymentConfigured === true ? "✅ Configured" : "Not Configured"
              }
              fontColor={paymentConfigured === true ? "#6941C6" : "#D92D20"}
              bgColor={paymentConfigured === true ? "#F9F5FF" : "#f3f3f1"}
            />
          </Box>
          <Link href={billingDetails?.paymentInfoPortalURL} target="_blank">
            <Button variant="outlined">
              Configure Payment Method
              <ArrowOutwardIcon
                sx={{
                  marginLeft: "6px",
                  fontSize: "18px",
                }}
              />
            </Button>
          </Link>
        </Stack>
      </Card>
      <Box mt={3}>
        {isIframeLoading && <LinearProgress />}
        <iframe
          onLoad={() => {
            setIsIframeLoading(false);
          }}
          src={billingDetails?.billingEmbedURL}
          style={{ width: "100%", height: 900, border: "none" }}
        />
      </Box>
    </>
  );
}

export default BillingPage;
