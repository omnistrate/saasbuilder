import { Box, CircularProgress, Divider } from "@mui/material";
import React from "react";
import Button from "src/components/Button/Button";
import Card from "src/components/Card/Card";
import Tooltip from "src/components/Tooltip/Tooltip";
import { Text } from "src/components/Typography/Typography";
import { findSubscriptionByPriority } from "src/utils/access/findSubscription";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { parseOfferingDescriptionDom } from "src/utils/constants/serviceOfferingDescription";
import SubscriptionRequestPendingSnack from "./SubscriptionRequestPendingSnack";

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

  const handleSubscribeClick = () => {
    subscribeMutation.mutate({
      productTierId: offering?.productTierID,
      serviceId,
    });
  };

  const handleCancelPendingRequest = () => {
    cancelSubscriptionRequestMutation.mutate(pendingRequest?.id);
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
        border: isSelected ? "2px solid #53389E;" : "auto",
        width: "100%",
        maxWidth: "400px",
        minWidth: "300px",
        mb: "20px",
      }}
      onClick={handleSelectProductTier}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection="column"
        sx={{
          pointerEvents: !isSelected ? "none" : "auto",
        }}
      >
        {pendingRequestExists && (
          <Box marginBottom={"16px"}>
            <SubscriptionRequestPendingSnack />
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
        <Divider sx={{ mt: "18px" }} />
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
              {parseOfferingDescriptionDom(offering?.productTierDescription)}
            </Text>
          </Box>
        </Box>
        <Divider sx={{ mt: "18px" }} />
        <Box display="flex" justifyContent="center" mt={"18px"} gap={2}>
          {!isUserFromServiceOrg && (
            <>
              {hasAlreadySubscribedAsRoot ? (
                <Button
                  variant="outlined"
                  sx={{
                    minWidth: "150px",
                    color: "##B42318 !important",
                  }}
                  disabled={
                    subscribeMutation.isLoading || unSubscribeMutation.isLoading
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
                  sx={{ minWidth: "170px", color: "#B42318 !important" }}
                  onClick={handleCancelPendingRequest}
                  disabled={
                    subscribeMutation.isLoading ||
                    unSubscribeMutation.isLoading ||
                    cancelSubscriptionRequestMutation.isLoading
                  }
                >
                  Cancel Subscribe Request
                  {isSelected &&
                    cancelSubscriptionRequestMutation.isLoading && (
                      <CircularProgress size={16} sx={{ marginLeft: "8px" }} />
                    )}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  sx={{
                    minWidth: "150px",
                    color: "#344054 !important",
                  }}
                  onClick={handleSubscribeClick}
                  disabled={
                    subscribeMutation.isLoading || unSubscribeMutation.isLoading
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
            <span>
              <Button
                variant={"contained"}
                sx={{
                  minWidth: "150px",
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
                  (!hasAlreadySubscribedAsRoot && !isUserFromServiceOrg) ||
                  !isServiceModelReady
                }
              >
                {isMarketplacePage ? "Dashboard" : "Service Plan Dashboard"}
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
}

export default MultiProductTierPlanCard;
