import { Box, CircularProgress } from "@mui/material";
import React from "react";
import Button from "src/components/Button/Button";
import Card from "src/components/Card/Card";
import Tooltip from "src/components/Tooltip/Tooltip";
import { DisplayText, Text } from "src/components/Typography/Typography";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { findSubscriptionByPriority } from "src/utils/access/findSubscription";
import SubscriptionRequestPendingSnack from "./SubscriptionRequestPendingSnack";
import SubscriptionSuspendedSnack from "./SubscriptionSuspendedSnack";

function SingleProductTierPlanCard(props) {
  const {
    offering,
    serviceId,
    subscriptionsData,
    source,
    isUserFromServiceOrg,
    subscribeMutation,
    unSubscribeMutation,
    handleNavigateToDashboard,
    handleUnsubscribeClick,
    isMarketplacePage,
    subscriptionRequests,
    cancelSubscriptionRequestMutation,
  } = props;

  const existingSubscription = findSubscriptionByPriority(
    subscriptionsData,
    serviceId,
    offering?.productTierID
  );

  const pendingRequest = subscriptionRequests?.find(
    (item) =>
      item?.productTierId === offering?.productTierID &&
      item?.serviceId === serviceId &&
      item?.status === "PENDING"
  );

  const pendingRequestExists = !!pendingRequest;

  const hasAlreadySubscribedAsRoot = existingSubscription?.roleType === "root";

  const isSubscriptionSuspended = existingSubscription?.status === "SUSPENDED";

  const handleSubscribeClick = () => {
    subscribeMutation.mutate({
      productTierId: offering?.productTierID,
      serviceId,
    });
  };

  const handleCancelPendingRequest = () => {
    cancelSubscriptionRequestMutation.mutate(pendingRequest?.id);
  };

  const isServiceModelReady = offering.serviceModelStatus === "READY";

  return (
    <Card
      sx={{
        color: "#FFFFFF",
        padding: "24px 94px",
        borderRadius: "16px",
        mb: "20px",
        border: "auto",
      }}
    >
      <Box display="flex" gap={"30px"} justifyContent="space-between">
        <Box maxWidth="800px">
          <Tooltip title={offering?.productTierName}>
            <DisplayText
              size="medium"
              weight="extrabold"
              sx={{
                color: "#53389E",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "1",
                WebkitBoxOrient: "vertical",
              }}
            >
              {offering?.productTierName}
            </DisplayText>
          </Tooltip>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
              paddingTop: "6px",
              paddingBottom: "24px",
              flexGrow: 1,
            }}
          >
            <Text
              size="small"
              weight="regular"
              sx={{
                color: "#475467",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "4",
                WebkitBoxOrient: "vertical",
              }}
            >
              {offering?.productTierDescription}
            </Text>
            {pendingRequestExists && (
              <Box sx={{ marginTop: "12px" }}>
                <SubscriptionRequestPendingSnack />
              </Box>
            )}
            {isSubscriptionSuspended && (
              <Box sx={{ marginTop: "12px" }}>
                <SubscriptionSuspendedSnack />
              </Box>
            )}
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection="column"
          gap={2}
          flexShrink={0}
        >
          {!isUserFromServiceOrg && (
            <>
              {hasAlreadySubscribedAsRoot ? (
                <Button
                  variant="outlined"
                  sx={{ minWidth: "200px", color: "#B42318 !important" }}
                  disabled={
                    subscribeMutation.isLoading || unSubscribeMutation.isLoading
                  }
                  onClick={handleUnsubscribeClick}
                >
                  Unsubscribe
                  {unSubscribeMutation.isLoading && (
                    <CircularProgress size={16} sx={{ marginLeft: "8px" }} />
                  )}
                </Button>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  {pendingRequestExists ? (
                    <Button
                      variant="outlined"
                      sx={{ minWidth: "200px", color: "#B42318 !important" }}
                      onClick={handleCancelPendingRequest}
                      disabled={
                        subscribeMutation.isLoading ||
                        unSubscribeMutation.isLoading ||
                        cancelSubscriptionRequestMutation.isLoading
                      }
                    >
                      Cancel Subscription Request
                      {cancelSubscriptionRequestMutation.isLoading && (
                        <CircularProgress
                          size={16}
                          sx={{ marginLeft: "8px" }}
                        />
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      sx={{ minWidth: "200px", color: "#344054 !important" }}
                      onClick={handleSubscribeClick}
                      disabled={
                        subscribeMutation.isLoading ||
                        unSubscribeMutation.isLoading ||
                        pendingRequestExists
                      }
                    >
                      Subscribe
                      {subscribeMutation.isLoading && (
                        <CircularProgress
                          size={16}
                          sx={{ marginLeft: "8px" }}
                        />
                      )}
                    </Button>
                  )}
                </Box>
              )}
            </>
          )}
          <Tooltip
            placement="top"
            title="Service setup in progress. This service plan will become available once the service is ready"
            isVisible={!isServiceModelReady}
          >
            <span>
              <Button
                variant={"contained"}
                sx={{
                  minWidth: "200px",
                }}
                endIcon={
                  source === "access" && (
                    <ArrowOutwardIcon sx={{ fontSize: "18px" }} />
                  )
                }
                onClick={handleNavigateToDashboard}
                disabled={
                  subscribeMutation?.isLoading ||
                  unSubscribeMutation?.isLoading ||
                  (!existingSubscription && !isUserFromServiceOrg) ||
                  !isServiceModelReady
                }
              >
                {isMarketplacePage ? "Dashboard" : "Service Plan Dashboard"}
              </Button>{" "}
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
}

export default SingleProductTierPlanCard;
