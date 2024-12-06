import { Box, CircularProgress, Divider } from "@mui/material";
import React from "react";
import Button from "src/components/Button/Button";
import Card from "src/components/Card/Card";
import Tooltip from "src/components/Tooltip/Tooltip";
import { Text } from "src/components/Typography/Typography";
import { findSubscriptionByPriority } from "src/utils/access/findSubscription";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import SubscriptionRequestPendingSnack from "./SubscriptionRequestPendingSnack";
import SubscriptionSuspendedSnack from "./SubscriptionSuspendedSnack";

function MultiProductTierPlanCard(props) {
  const {
    offering,
    serviceId,
    subscriptionsData,
    selectedProductTierId,
    setSelectedProductTierId,
    source,
    isUserFromServiceOrg,
    subscribeMutation,
    unSubscribeMutation,
    handleNavigateToDashboard,
    handleUnsubscribeClick,
    isMarketplacePage,
    subscriptionRequests,
    cancelSubscriptionRequestMutation,
    reRenderCarousel,
  } = props;

  const isSelected = selectedProductTierId === offering?.productTierID;

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

  const handleSubscribeClick = async () => {
    await subscribeMutation.mutateAsync({
      productTierId: offering?.productTierID,
      serviceId,
    });
    reRenderCarousel();
  };

  const handleCancelPendingRequest = async () => {
    await cancelSubscriptionRequestMutation.mutateAsync(pendingRequest?.id);
    reRenderCarousel();
  };

  const handleSelectProductTier = () => {
    if (subscribeMutation.isLoading || unSubscribeMutation.isLoading) return;
    if (selectedProductTierId !== offering.productTierID) {
      setSelectedProductTierId(offering?.productTierID);
    }
  };

  const isServiceModelReady = offering.serviceModelStatus === "READY";

  return (
    <Card
      sx={{
        color: "#FFFFFF",
        padding: "18px",
        borderRadius: "16px",
        cursor: "pointer",
        opacity: isSelected ? 1.0 : 0.5,
        border: isSelected ? "2px solid #53389E;" : "1px solid #E5E5E5",
        width: "100%",
        maxWidth: "400px",
        minWidth: "300px",
        minHeight: "250px",
        mb: "20px",
      }}
      onClick={handleSelectProductTier}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection="column"
        height={"100%"}
        sx={{
          pointerEvents: !isSelected ? "none" : "auto",
        }}
      >
        <Box>
          {pendingRequestExists && (
            <Box
              marginBottom={"16px"}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <SubscriptionRequestPendingSnack />
            </Box>
          )}

          {isSubscriptionSuspended && (
            <Box
              marginBottom={"16px"}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <SubscriptionSuspendedSnack />
            </Box>
          )}
          <Box display="flex" justifyContent="center">
            <Tooltip title={offering?.productTierName}>
              <Text
                size="xlarge"
                weight="bold"
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
              </Text>
            </Tooltip>
          </Box>
          <Divider sx={{ mt: "16px" }} />
          <Box>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                paddingTop: "18px",
                paddingBottom: "18px",
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
            </Box>
          </Box>
        </Box>
        <Box>
          <Divider sx={{ mt: "12px" }} />
          <Box
            display="flex"
            justifyContent="center"
            alignItems={"center"}
            flexWrap={"wrap"}
            mt={"18px"}
            gap={2}
          >
            {!isUserFromServiceOrg && (
              <>
                {hasAlreadySubscribedAsRoot ? (
                  <Button
                    variant="outlined"
                    sx={{
                      flex: 1,
                      color: "##B42318 !important",
                    }}
                    disabled={
                      subscribeMutation.isLoading ||
                      unSubscribeMutation.isLoading
                    }
                    onClick={handleUnsubscribeClick}
                  >
                    Unsubscribe
                    {isSelected && unSubscribeMutation.isLoading && (
                      <CircularProgress size={16} sx={{ marginLeft: "8px" }} />
                    )}
                  </Button>
                ) : pendingRequestExists ? (
                  <Button
                    variant="outlined"
                    sx={{
                      flex: "0 1 1",
                      color: "#B42318 !important",
                    }}
                    onClick={handleCancelPendingRequest}
                    disabled={
                      subscribeMutation.isLoading ||
                      unSubscribeMutation.isLoading ||
                      cancelSubscriptionRequestMutation.isLoading
                    }
                  >
                    Cancel Subscription Request
                    {isSelected &&
                      cancelSubscriptionRequestMutation.isLoading && (
                        <CircularProgress
                          size={16}
                          sx={{ marginLeft: "8px" }}
                        />
                      )}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    sx={{
                      color: "#344054 !important",
                      flex: 1,
                    }}
                    onClick={handleSubscribeClick}
                    disabled={
                      subscribeMutation.isLoading ||
                      unSubscribeMutation.isLoading
                    }
                  >
                    Subscribe
                    {isSelected && subscribeMutation.isLoading && (
                      <CircularProgress size={16} sx={{ marginLeft: "8px" }} />
                    )}
                  </Button>
                )}
              </>
            )}
            <Tooltip
              placement="top"
              title="Service setup in progress. This service plan will become available once the service is ready"
              isVisible={!isServiceModelReady}
            >
              <Button
                variant={"contained"}
                sx={{
                  flex: "1",
                  maxWidth: "250px",
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
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

export default MultiProductTierPlanCard;
