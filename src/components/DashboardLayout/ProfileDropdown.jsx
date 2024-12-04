import profile_icon from "public/assets/images/dashboard/avatar.jpeg";
// import BillingIcon from "src/components/Icons/Billing/BillingIcon";
import LogoutIcon from "src/components/Icons/Logout/LogoutIcon";
// import SettingsIcon from "src/components/Icons/Settings/SettingsIcon";
import Menu from "src/components/Menu/Menu";
import { Box, MenuItem as MuiMenuItem, Stack, styled } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import {
  getEnumFromUserRoleString,
  isOperationAllowedByRBAC,
  operationEnum,
  viewEnum,
} from "src/utils/isAllowedByRBAC";
// import Link from "next/link";
import { selectUserrootData } from "src/slices/userDataSlice";
import { useSelector } from "react-redux";
import { Text } from "../Typography/Typography";
// import ProfileUser from "../Icons/ProfileDropDown/ProfileUser";
import EllipsisTooltipText from "../Tooltip/EllipsisTooltip";
import { styleConfig } from "src/providerConfig";
// import SubscriptionsIcon from "../Icons/Subscriptions/SubscriptionsIcon";
import SideDrawerRight from "../SideDrawerRight/SideDrawerRight";
import ProfileUser from "../Icons/ProfileDropDown/ProfileUser";
import SubscriptionsIcon from "../Icons/Subscriptions/SubscriptionsIcon";
import BillingIcon from "../Icons/Billing/BillingIcon";
import { tabs } from "src/features/ProfileSettings/constants";
import SettingsMarketplace from "src/features/ProfileSettings/SettingsMarketplace";
// import { getSettingsRoute } from "src/utils/route/settings";

function ProfileDropdown(props) {
  const { userAllData, logout, isBillingEnabled } = props;
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const selectUser = useSelector(selectUserrootData);
  const role = getEnumFromUserRoleString(selectUser.roleType);
  const view = viewEnum.BillingPricing;
  const isReadAllowed = isOperationAllowedByRBAC(
    operationEnum.Read,
    role,
    view
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [currentTab, setCurrentTab] = useState(tabs.profile);

  // const settingsPath = getSettingsRoute(accessPage, marketplacePage);

  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  function handleSideDrawerOpen(view) {
    setCurrentTab(view);
    setSideDrawerOpen(true);
  }

  return (
    <Box sx={{ display: "flex", gap: "11px", alignItems: "center" }}>
      <UserName>{Object.values(userAllData)[0]?.name}</UserName>

      <Avatar
        src={profile_icon}
        alt="avatar"
        sx={{
          cursor: "pointer",
        }}
        onClick={handleMenuOpen}
      />

      <Menu
        anchorEl={anchorEl}
        id="#profile-menu"
        open={open}
        onClick={handleMenuClose}
        onClose={handleMenuClose}
        sx={{
          boxShadow: "0px 4px 6px -2px #10182808 0px 12px 16px -4px #10182814",
          maxWidth: "350px",
          ".MuiMenu-list": {
            borderRadius: "8px",
            border: "1px solid #EAECF0",
            padding: 0,
          },
        }}
      >
        <MenuItem
          key="userInfo"
          sx={{
            padding: "12px 16px",
            borderBottom: "1px solid #EAECF0",
            cursor: "auto",
            width: "100%",
          }}
          disableRipple
        >
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            gap="12px"
            width={"100%"}
          >
            <Avatar
              src={profile_icon}
              alt="avatar-two"
              sx={{
                width: "40px",
                height: "40px",
                flexShrink: 0,
              }}
            />
            <Stack sx={{ flex: 1, overflow: "hidden" }}>
              <EllipsisTooltipText
                weight="semibold"
                color="#344054"
                text={Object.values(userAllData)[0]?.name}
              />

              <EllipsisTooltipText
                weight="regular"
                color="#475467"
                text={Object.values(userAllData)[0]?.email}
              />
            </Stack>
          </Stack>
        </MenuItem>
        <MenuItem
          key="Profile"
          onClick={() => handleSideDrawerOpen(tabs.profile)}
        >
          {/* <DropdownMenuLink href={`${settingsPath}?view=Profile`}> */}
          <MenuItemContainer>
            <ProfileUser />
            <Text weight="medium" size="small" color="#344054">
              Profile
            </Text>
          </MenuItemContainer>
          {/* </DropdownMenuLink> */}
        </MenuItem>
        <MenuItem
          key="Subscriptions"
          onClick={() => handleSideDrawerOpen(tabs.subscriptions)}
        >
          {/* <DropdownMenuLink href="/subscriptions"> */}
          <MenuItemContainer>
            <SubscriptionsIcon />
            <Text weight="medium" size="small" color="#344054">
              Subscriptions
            </Text>
          </MenuItemContainer>
          {/* </DropdownMenuLink> */}
        </MenuItem>
        {isBillingEnabled && (
          <MenuItem
            key="Billing"
            disabled={!isReadAllowed}
            onClick={() => handleSideDrawerOpen(tabs.billing)}
          >
            <MenuItemContainer>
              {/* <DropdownMenuLink href="/billing"> */}
              <BillingIcon />
              <Text weight="medium" size="small" color="#344054">
                Billing
              </Text>
            </MenuItemContainer>
            {/* </DropdownMenuLink> */}
          </MenuItem>
        )}

        {/* <MenuItem key="Change Password">
          <DropdownMenuLink
            sx={{ display: "contents" }}
            href={`${settingsPath}?view=Password`}
          >
            <SettingsIcon />

            <Text weight="medium" size="small" color="#344054">
              Change Password
            </Text>
          </DropdownMenuLink>
        </MenuItem> */}

        {/* <MenuItem
          key="Billing"
          sx={{ borderBottom: "1px solid #EAECF0" }}
          disabled={!isReadAllowed}
        >
          <DropdownMenuLink href="/billing">
            <BillingIcon />
            <Text weight="medium" size="small" color="#344054">
              Billing
            </Text>
          </DropdownMenuLink>
        </MenuItem> */}

        {/* {isProdEnvironment && accessPage && currentSubscription?.id && (
          <MenuItem
            sx={{
              borderBottom: "1px solid #EAECF0",
              cursor: "auto",
            }}
            disableRipple
          >
            <Box sx={{ padding: "12px 16px" }}>
              <Text size="small" color="#344054">
                Subscription ID
              </Text>
              <Stack
                direction={"row"}
                justifyContent={"flex-start"}
                alignItems={"center"}
                gap="5px"
                marginTop={"5px"}
              >
                {currentSubscription?.roleType === "root" ? (
                  <SubscriptionTypeDirectIcon />
                ) : (
                  <SubscriptionTypeInvitedIcon />
                )}

                <Text size="small" color="#475467" weight="regular">
                  {currentSubscription?.id}
                  &nbsp;(
                  {getEnumFromUserRoleString(currentSubscription?.roleType)})
                </Text>
              </Stack>
            </Box>
          </MenuItem>
        )} */}

        <MenuItem
          onClick={() => {
            logout();
          }}
          sx={{
            padding: "12px 16px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "8px",
            borderTop: "1px solid #EAECF0",
          }}
        >
          <LogoutIcon />
          <Text weight="medium" size="small" color="#344054">
            Log out
          </Text>
        </MenuItem>
      </Menu>
      <SideDrawerRight
        size="xlarge"
        open={sideDrawerOpen}
        closeDrawer={() => {
          setSideDrawerOpen(false);
        }}
        RenderUI={
          <SettingsMarketplace
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            isBillingEnabled={isBillingEnabled}
          />
        }
        containerStyles={{ padding: "12px 32px" }}
      />
    </Box>
  );
}

export default ProfileDropdown;

const Avatar = styled(Image)({
  borderRadius: "50%",
  height: 32,
  width: 32,
  objectFit: "cover",
});

const UserName = styled("div")({
  fontSize: 14,
  lineHeight: "20px",
  fontWeight: 600,
  color: styleConfig.navbarTextColor,
});

const MenuItem = styled(MuiMenuItem)({
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "20px",
  padding: 0,
});

const MenuItemContainer = styled(Box)({
  display: "flex !important",
  alignItems: "center",
  gap: 8,
  width: "100%",
  padding: "12px 16px",
});

// const DropdownMenuLink = styled(Link)(() => ({
//   display: "flex !important",
//   alignItems: "center",
//   gap: 8,
//   width: "100%",
//   padding: "12px 16px",
// }));
