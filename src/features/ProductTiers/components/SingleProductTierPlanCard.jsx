import { Box, CircularProgress } from "@mui/material";
import React from "react";
import Button from "src/components/Button/Button";
import Card from "src/components/Card/Card";
import Tooltip from "src/components/Tooltip/Tooltip";
import { DisplayText, Text } from "src/components/Typography/Typography";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { parseOfferingDescriptionDom } from "src/utils/constants/serviceOfferingDescription";
import { findSubscriptionByPriority } from "src/utils/access/findSubscription";

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
  } = props;

  const existingSubscription = findSubscriptionByPriority(
    subscriptionsData,
    serviceId,
    offering?.productTierID
  );

  // const hasAlreadySubscribed = findSubscriptionByPriority(
  //   subscriptionsData,
  //   serviceId,
  //   offering?.productTierID
  // );

  const hasAlreadySubscribedAsRoot = existingSubscription?.roleType === "root";

  const handleSubscribeClick = () => {
    subscribeMutation.mutate({
      productTierId: offering?.productTierID,
      serviceId,
    });
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
              width: "100%",
              paddingTop: "6px",
              paddingBottom: "32px",
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
        <Box
          display="flex"
          justifyContent={"center"}
          flexDirection="column"
          gap={2}
          flexShrink={0}
        >
          {!isUserFromServiceOrg && (
            <>
              {hasAlreadySubscribedAsRoot ? (
                <Button
                  variant="outlined"
                  sx={{ minWidth: "150px", color: "#8D0E00 !important" }}
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
                <Button
                  variant="outlined"
                  sx={{ minWidth: "150px", color: "#8D0E00 !important" }}
                  onClick={handleSubscribeClick}
                  disabled={
                    subscribeMutation.isLoading || unSubscribeMutation.isLoading
                  }
                >
                  Subscribe
                  {subscribeMutation.isLoading && (
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
              </Button>{" "}
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
}

export default SingleProductTierPlanCard;
