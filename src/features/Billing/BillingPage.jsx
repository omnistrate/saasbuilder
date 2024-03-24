import { Box, LinearProgress, Stack } from "@mui/material";
import Button from "src/components/Button/Button";
import Chip from "src/components/Chip/Chip";
import { DisplayText, Text } from "src/components/Typography/Typography";
import useBillingDetails from "src/hooks/query/useBillingDetails";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import Card from "src/components/Card/Card";
import { useState } from "react";
import LoadingSpinnerSmall from "src/components/CircularProgress/CircularProgress";
import { getBillingDetails } from "src/api/users";
import { useSelector } from "react-redux";
import { selectUserrootData } from "src/slices/userDataSlice";

function BillingPage() {
  const [isFetchingPortalURL, setIsFetchingPortalURL] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const billingDetailsQuery = useBillingDetails();
  const userData = useSelector(selectUserrootData);
  const userId = userData?.id;

  const {
    isLoading,
    data: billingDetails = {
      billingEmbedURL:
        "https://console.paigo.tech/embedded/public/668d7cca-8293-458a-aa4b-5f0c5aa75f30?template=template1&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvcmctZWgzZGd5MGZzZiIsImJ1c2luZXNzSUQiOiJxeHByNjhoMmdoLXNhbmRib3giLCJpYXQiOjE3MTEyMDc1MDEsImV4cCI6MTcxMTgxMjMwMX0._N0uhs4gDjKXk_M2AkPZyfnrFVtUsQ_tnElaQ9vs0I0#%7B%7B%20urlparams.token%20%7D%7D=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvcmctZWgzZGd5MGZzZiIsImJ1c2luZXNzSUQiOiJxeHByNjhoMmdoLXNhbmRib3giLCJpYXQiOjE3MTEyMDc1MDEsImV4cCI6MTcxMTgxMjMwMX0._N0uhs4gDjKXk_M2AkPZyfnrFVtUsQ_tnElaQ9vs0I0",

      name: "John Dae",
      paymentConfigured: false,
      paymentInfoPortalURL:
        "https://billing.stripe.com/p/session/test_YWNjdF8xT3FsczVKdGNnOWdMeXNBLF9QbjZXb2Zia3pqam9xeG1jYXpCbmhwT2ZURHNPWEdr01003NOB3evU",
      userId: "user-abcd1234",
    },
  } = billingDetailsQuery;

  let paymentConfigured = billingDetails?.paymentConfigured;

  function fetchPortalURL() {
    setIsFetchingPortalURL(true);
    getBillingDetails(userId)
      .then((response) => {
        const portalURL = response.data.paymentInfoPortalURL;
        window.open(portalURL, "_blank");
      })
      .catch(() => {})
      .finally(() => {
        setIsFetchingPortalURL(false);
      });
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  //   if (billingDetailsQuery.error) {
  //     const errorMessage = billingDetailsQuery.error?.response?.data?.message;
  //     let errorDisplayText =
  //       "Please subscribe to a service to start using billing";
  //     if (errorMessage) {
  //       if (
  //         errorMessage === "Your provider has not enabled billing for the user."
  //       ) {
  //       }

  //       if (
  //         errorMessage === "Your provider has not enabled billing for the user."
  //       ) {
  //       }
  //     }

  //     return (
  //       <Stack p={3} pt="200px" alignItems="center" justifyContent="center">
  //         <DisplayText>{errorDisplayText}</DisplayText>
  //       </Stack>
  //     );
  //   }

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
          <Button variant="outlined" onClick={fetchPortalURL}>
            Configure Payment Method
            <ArrowOutwardIcon
              sx={{
                marginLeft: "6px",
                fontSize: "18px",
              }}
            />
            {isFetchingPortalURL && <LoadingSpinnerSmall />}
          </Button>
        </Stack>
      </Card>
      <Box mt={3}>
        {isIframeLoading && <LinearProgress />}
        <iframe
          onLoad={() => {
            setIsIframeLoading(false);
          }}
          src={billingDetails.billingEmbedURL}
          style={{ width: "100%", height: 900, border: "none" }}
        />
      </Box>
    </>
  );
}

export default BillingPage;
