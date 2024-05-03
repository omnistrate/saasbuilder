import { Stack } from "@mui/material";
import Link from "next/link";
import React, { useMemo } from "react";
import Tooltip from "src/components/Tooltip/Tooltip";
import {
  INTEGRATION_PROVIDER_ICON_MAP,
  PROVIDER_TOOLTIP_TEXT,
  getCustomerNonOmnistrateMetrics,
} from "src/utils/constants/productTierFeatures";

function NonOmnistrateMetricsContainer({ productTierFeatures }) {
  const nonOmnistrateCustomerMetrics = useMemo(() => {
    if (productTierFeatures) {
      return getCustomerNonOmnistrateMetrics(productTierFeatures);
    }
  }, [productTierFeatures]);

  if (nonOmnistrateCustomerMetrics?.length) {
    return (
      <Stack
        direction={"row"}
        justifyContent={"flex-end"}
        alignItems={"center"}
        gap="6px"
        paddingTop={"16px"}
      >
        {nonOmnistrateCustomerMetrics?.map((item, i) => {
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

export default NonOmnistrateMetricsContainer;

const ProviderTooltipLink = ({ provider, url }) => {
  return (
    <Link href={url || ""} target="_blank">
      <Tooltip title={PROVIDER_TOOLTIP_TEXT[provider]}>
        <div>{INTEGRATION_PROVIDER_ICON_MAP[provider]}</div>
      </Tooltip>{" "}
    </Link>
  );
};
