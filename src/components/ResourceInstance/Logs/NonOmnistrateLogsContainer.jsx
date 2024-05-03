import { Stack } from "@mui/material";
import Link from "next/link";
import React, { useMemo } from "react";
import Tooltip from "src/components/Tooltip/Tooltip";
import {
  INTEGRATION_PROVIDER_ICON_MAP,
  PROVIDER_TOOLTIP_TEXT,
  getCustomerNonOmnistrateLogs,
} from "src/utils/constants/productTierFeatures";

function NonOmnistrateLogsContainer({ productTierFeatures }) {
  const nonOmnistrateCustomerLogs = useMemo(() => {
    if (productTierFeatures) {
      return getCustomerNonOmnistrateLogs(productTierFeatures);
    }
  }, [productTierFeatures]);

  if (nonOmnistrateCustomerLogs?.length) {
    return (
      <Stack
        direction={"row"}
        justifyContent={"flex-end"}
        alignItems={"center"}
        gap="6px"
        paddingTop={"16px"}
      >
        {nonOmnistrateCustomerLogs?.map((item, i) => {
          return (
            <ProviderTooltipLink
              provider={item?.provider}
              url={"http://endpoint.com"}
              key={i}
            />
          );
        })}
      </Stack>
    );
  }
}

export default NonOmnistrateLogsContainer;

const ProviderTooltipLink = ({ provider, url }) => {
  return (
    <Link href={url || ""} target="_blank">
      <Tooltip title={PROVIDER_TOOLTIP_TEXT[provider]}>
        <div>{INTEGRATION_PROVIDER_ICON_MAP[provider]}</div>
      </Tooltip>{" "}
    </Link>
  );
};
