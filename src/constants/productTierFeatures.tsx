import CloudNative from "src/components/Icons/productTierFeatures/CloudNative";
import Datadog from "src/components/Icons/productTierFeatures/Datadog";
import NewRelic from "src/components/Icons/productTierFeatures/NewRelic";
import Signoz from "src/components/Icons/productTierFeatures/Signoz";

export const INTEGRATION_SCOPES = {
  INTERNAL: "INTERNAL",
  CUSTOMER: "CUSTOMER",
};

export const INTEGRATION_PROVIDERS = {
  native: "native",
  signoz: "signoz",
  newRelic: "newRelic",
  datadog: "datadog",
};

export const INTEGRATIONS_TYPES = {
  LOGS: "LOGS",
  METRICS: "METRICS",
  BILLING: "BILLING",
  ALERTS: "ALERTS",
};

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

export const TAGS_CHIP_STYLES_MAP = {
  "Online Integration": {
    color: "#3538CD",
    bgColor: "#EEF4FF",
  },
  "Third-party charges": {
    color: "#C11574",
    bgColor: "#FDF2FA",
  },
  "Offline Integration": {
    color: "#344054",
    bgColor: "#F2F4F7",
  },
  "No extra charges": {
    color: "#027A48",
    bgColor: "#ECFDF3",
  },
};

export const INTEGRATION_PROVIDER_LABEL_MAP = {
  native: "Cloud Provider Native",
  signoz: "Signoz",
  newRelic: "New Relic",
  datadog: "Datadog",
};

export const DRAWER_TYPES = {
  create: "create",
  modify: "modify",
  view: "view",
};

export const customMetricsInitialObject = {
  serviceComponent: "",
  prometheusEndpoint: "",
  metrics: [{ name: "", value: "" }],
};

export const CREATE_SUCCESS_MODAL_TYPES = {
  STRIPE_CONFIGURE_WARNING: "stripeConfigureWarning",
  REQUEST_SUCCESS: "requestSuccess",
};
