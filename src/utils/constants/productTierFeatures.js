import CloudNative from "src/components/Icons/productTierFeatures/CloudNative";

export const INTEGRATION_PROVIDER_ICON_MAP = {
  native: <CloudNative />,
};

export const INTEGRATION_PROVIDERS = {
  native: "native",
};

export const PROVIDER_TOOLTIP_TEXT = {
  native: "Cloud Native",
};

export const INTEGRATIONS_TYPES = {
  LOGS: "LOGS",
  METRCIS: "METRICS",
};

//customer integration functions

export const checkCustomerOmnistrateLogsExist = (productTierFeatures = {}) => {
  const integrations = Object.keys(productTierFeatures);
  return integrations?.find(
    (item) => item === "LOGS" && !productTierFeatures[item]?.provider
  );
};

export const checkCustomerOmnistrateMetricsExist = (
  productTierFeatures = {}
) => {
  const integrations = Object.keys(productTierFeatures);
  return integrations?.find(
    (item) => item === "METRICS" && !productTierFeatures[item]?.provider
  );
};

export const getCustomerNonOmnistrateLogs = (productTierFeatures = {}) => {
  const result = [];
  const integrations = Object.keys(productTierFeatures);
  integrations?.forEach((item) => {
    const value = productTierFeatures[item];
    if (item === "LOGS" && ["native"].includes(value?.provider)) {
      result.push(value);
    }
  });
  return result;
};

export const getCustomerNonOmnistrateMetrics = (productTierFeatures = {}) => {
  const result = [];
  const integrations = Object.keys(productTierFeatures);
  integrations?.forEach((item) => {
    const value = productTierFeatures[item];
    if (item === "METRICS" && ["native"].includes(value?.provider)) {
      result.push(value);
    }
  });
  return result;
};
