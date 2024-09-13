import { useSelector } from "react-redux";
import { selectDrawerExpandedState } from "../../slices/dashboardSideDrawerSlice";

import { Box } from "@mui/material";
import {
  ListItem,
  ListItemText,
  MenuHoverTooltip,
  MenuHoverTooltipTitle,
  StyledLinkContainer,
} from "../DashboardLayout/NavItem";
import { List } from "../DashboardLayout/NavList";
import MySubscriptionIcon from "../Icons/MySubscription/MySubscription";
import PublicServiceIcon from "../Icons/PublicService/PublicService";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { marketplaceServicePageTypes } from "src/features/Marketplace/constants/marketplaceServicePageTypes";

export const serviceTypes = {
  all: "all",
  private: "private",
  subscription: "subscription",
  shared: "shared",
  popular: "popular",
  new: "new",
  myServices: "my-services",
};

function MarketplaceServiceSidebar(props) {
  const { active } = props;
  const router = useRouter();
  const isDrawerExpanded = useSelector(selectDrawerExpandedState);
  const isAllServiceActive = active === serviceTypes.all;
  const isSubscriptionActive = active === serviceTypes.subscription;
  const [isPublicServiceActive, setIsPublicServiceActive] = useState(false);
  useEffect(() => {
    //We use url to track whether the user reached the marketplace product tiers page from the public services page or my services page

    if (router.isReady) {
      const { serviceType } = router.query;

      if (serviceType) {
        if (serviceType === marketplaceServicePageTypes.public) {
          setIsPublicServiceActive(true);
        }
      }
    }
  }, [router]);

  return (
    <List open={isDrawerExpanded}>
      <>
        <Box>
          <MenuHoverTooltip
            title={<MenuHoverTooltipTitle>Services</MenuHoverTooltipTitle>}
            isVisible={!isDrawerExpanded}
          >
            <ListItem
              active={isAllServiceActive || isPublicServiceActive}
              href={`/`}
            >
              <StyledLinkContainer>
                <PublicServiceIcon />
                <ListItemText visible={isDrawerExpanded}>Services</ListItemText>
              </StyledLinkContainer>
            </ListItem>
          </MenuHoverTooltip>

          <MenuHoverTooltip
            title={
              <MenuHoverTooltipTitle>My Subscriptions</MenuHoverTooltipTitle>
            }
            isVisible={!isDrawerExpanded}
          >
            <ListItem active={isSubscriptionActive} href={`/subscriptions`}>
              <StyledLinkContainer>
                <MySubscriptionIcon />
                <ListItemText visible={isDrawerExpanded}>
                  My Subscriptions
                </ListItemText>
              </StyledLinkContainer>
            </ListItem>
          </MenuHoverTooltip>
        </Box>
      </>
    </List>
  );
}

export default MarketplaceServiceSidebar;
