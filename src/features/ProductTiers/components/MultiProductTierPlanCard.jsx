import { Box, CircularProgress, Divider } from "@mui/material";
import React from "react";
import Button from "src/components/Button/Button";
import Card from "src/components/Card/Card";
import Tooltip from "src/components/Tooltip/Tooltip";
import { Text } from "src/components/Typography/Typography";
import { findSubscriptionByPriority } from "src/utils/access/findSubscription";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { parseOfferingDescriptionDom } from "src/utils/constants/serviceOfferingDescription";

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
  } = props;

  const isSelected = selectedProductTierId === offering?.productTierID;

  const existingSubscription = findSubscriptionByPriority(
    subscriptionsData,
    serviceId,
    offering?.productTierID
  );

  const hasAlreadySubscribedAsRoot = existingSubscription?.roleType === "root";

  // const hasAlreadySubscribed = findSubscriptionByPriority(
  //   subscriptionsData,
  //   serviceId,
  //   offering?.productTierID
  // );

  const handleSubscribeClick = () => {
    subscribeMutation.mutate({
      productTierId: offering?.productTierID,
      serviceId,
    });
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
        maxWidth: "350px",
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
        <Box sx={{ padding: "18px" }}>
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
                    color: "#8D0E00 !important",
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
              ) : (
                <Button
                  variant="outlined"
                  sx={{
                    minWidth: "150px",
                    color: "#8D0E00 !important",
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
            title="Service setup in progress. This product tier will become available once the service is ready"
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
                {isMarketplacePage ? "Dashboard" : "Product Tier Dashboard"}
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
}

export default MultiProductTierPlanCard;
