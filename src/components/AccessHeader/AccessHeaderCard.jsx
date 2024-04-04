import { useSelector } from "react-redux";
import { Box, Stack } from "@mui/material";

import { selectUserrootData } from "src/slices/userDataSlice";
import { getEnumFromUserRoleString } from "src/utils/isAllowedByRBAC";

import { Column, InfoCardContainer } from "../InfoCard/InfoCard";
import AwsLogo from "../Logos/AwsLogo/AwsLogo";
import GcpLogo from "../Logos/GcpLogo/GcpLogo";

import formatDateLocal from "../../utils/formatDateLocal";
import { Fragment } from "react";

const CLOUD_PROVIDERS_MAP = {
  aws: <AwsLogo />,
  gcp: <GcpLogo />,
};

function AccessHeaderCard(props) {
  const { serviceName, productTierName, currentSubscription, cloudProviders } =
    props;

  // const selectUser = useSelector(selectUserrootData);
  const role = getEnumFromUserRoleString(currentSubscription?.roleType);

  return (
    <InfoCardContainer sx={{ marginTop: "32px" }}>
      <Column title="Service Name">
        <Box component="span" fontWeight={500} color="#101828">
          {serviceName}
        </Box>
      </Column>
      <Column title="Tier Name">
        <Box component="span" fontWeight={500} color="#101828">
          {productTierName}
        </Box>
      </Column>
      {role?.length && (
        <Column title="Role">
          <Box component="span" fontWeight={500} color="#101828">
            {role[0].toUpperCase() + role.slice(1)}
          </Box>
        </Column>
      )}

      <Column title="Supported Cloud">
        <Stack direction="row" alignItems="center" gap={"15px"}>
          {cloudProviders?.map((provider, i) => {
            return <Fragment key={i}>{CLOUD_PROVIDERS_MAP[provider]}</Fragment>;
          })}
        </Stack>
      </Column>
    </InfoCardContainer>
  );
}

export default AccessHeaderCard;
