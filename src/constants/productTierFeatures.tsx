import CloudNative from "src/components/Icons/productTierFeatures/CloudNative";
import Datadog from "src/components/Icons/productTierFeatures/Datadog";
import NewRelic from "src/components/Icons/productTierFeatures/NewRelic";
import Signoz from "src/components/Icons/productTierFeatures/Signoz";

export const INTEGRATION_TYPE_LABEL_MAP = {
  LOGS: "Logs",
  METRICS: "Metrics",
};

export const PROVIDER_LOGO_ICON_MAP = {
  native: <CloudNative />,
  signoz: <Signoz />,
  newRelic: <NewRelic />,
  datadog: <Datadog />,
};
