import { Box, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import useLogout from "../../hooks/useLogout";
import useUserData from "../../hooks/usersData";
import ProfileDropdown from "./ProfileDropdown";
import { selectUserData } from "src/slices/userDataSlice";
import { Text } from "../Typography/Typography";
import { styleConfig } from "src/providerConfig";
import ServicesDropdown from "./ServicesDropdown";
import useBillingDetails from "src/hooks/query/useBillingDetails";
import useEnvironmentType from "src/hooks/useEnvironmentType";
import {
  ENVIRONMENT_TYPES,
} from "src/constants/environmentTypes";
import EnvironmentTypeChip from "../EnvironmentTypeChip/EnvironmentTypeChip";

function DashboardHeader(props) {
  const {
    isOpen,
    noSidebar,
    marketplacePage,
    notificationBarHeight,
    accessPage,
    currentSubscription,
    serviceName,
    serviceLogoURL,
  } = props;

  useUserData();
  //prefetch billing data
  useBillingDetails();
  const userAllData = useSelector(selectUserData);
  const { logout } = useLogout();
  const environmentType = useEnvironmentType();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      height="72px"
      pl="25px"
      pr="30px"
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      zIndex="100"
      sx={{
        backgroundColor: styleConfig.navbarBg,
        borderBottom: `1px solid ${styleConfig.navbarBorderColor}`,
      }}
    >
      <Stack direction="row" alignItems="center">
        <Box
          pr="20px"
          sx={{ display: "flex", direction: "row", alignItems: "center" }}
        >
          <ServicesDropdown />
        </Box>

        <Stack direction="row" alignItems="center" gap="10px" pr="16px">
          {serviceLogoURL && (
            <img
              src={
                serviceLogoURL ||
                "/assets/images/dashboard/service/servicePlaceholder.png"
              }
              height={28}
              width={40}
              style={{ maxHeight: "28px", width: "auto", maxWidth: "180px" }}
            />
          )}
          {serviceName && (
            <Text
              color={styleConfig.navbarTextColor}
              sx={{
                width: "100%",
                maxWidth: "260px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {serviceName}
            </Text>
          )}
          {environmentType !== ENVIRONMENT_TYPES.PROD && (
            <EnvironmentTypeChip />
          )}
        </Stack>
      </Stack>

      <ProfileDropdown
        userAllData={userAllData}
        logout={logout}
        accessPage={accessPage}
        marketplacePage={marketplacePage}
        currentSubscription={currentSubscription}
      />
    </Box>
  );
}

export default DashboardHeader;
