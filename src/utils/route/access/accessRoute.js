export function getAccessRoute(serviceId, environmentId, productTierId) {
  if (serviceId && environmentId && productTierId)
    return `/access?serviceId=${serviceId}&environmentId=${environmentId}&productTierId=${productTierId}`;
  if (serviceId && environmentId)
    return `/access?serviceId=${serviceId}&environmentId=${environmentId}`;
  if (serviceId) return `/access?serviceId=${serviceId}`;
  return `/access`;
}

export function getMarketplaceProductTierRoute(
  serviceId,
  environmentId,
  serviceType
) {
  if (serviceId && environmentId && serviceType)
    return `/product-tiers?serviceId=${serviceId}&environmentId=${environmentId}&serviceType=${serviceType}`;
  if (serviceId && environmentId)
    return `/product-tiers?serviceId=${serviceId}&environmentId=${environmentId}`;
  if (serviceId) {
    return `/product-tiers?serviceId=${serviceId}`;
  }
}

export function getDashboardRoute(
  serviceId,
  environmentId,
  productTierId,
  currentSource = "marketplace",
  subscriptionId = ""
) {
  return `/access/${serviceId}/${environmentId}/dashboard?productTierId=${productTierId}&source=${currentSource}&subscriptionId=${subscriptionId}`;
}

export function getEventRoute(
  serviceId,
  environmentId,
  productTierId,
  currentSource = "marketplace",
  subscriptionId = ""
) {
  return `/access/${serviceId}/${environmentId}/events?productTierId=${productTierId}&source=${currentSource}&subscriptionId=${subscriptionId}`;
}
export function getAccessContorlRoute(
  serviceId,
  environmentId,
  productTierId,
  currentSource = "marketplace",
  subscriptionId = ""
) {
  return `/access/${serviceId}/${environmentId}/access-control?productTierId=${productTierId}&source=${currentSource}&subscriptionId=${subscriptionId}`;
}
export function getResourceRoute(
  serviceId,
  environmentId,
  productTierId,
  currentSource = "marketplace",
  subscriptionId
) {
  let url = `/access/service/${serviceId}?environmentId=${environmentId}&productTierId=${productTierId}&source=${currentSource}`;
  if (subscriptionId) {
    url += `&subscriptionId=${subscriptionId}`;
  }
  return url;
}

export function getResourceRouteWithoutEnv(
  serviceId,
  productTierId,
  currentSource = "marketplace",
  subscriptionId = ""
) {
  return `/access/service/${serviceId}?productTierId=${productTierId}&source=${currentSource}&subscriptionId=${subscriptionId}`;
}

export function getResourceInstancesRoute(
  serviceId,
  environmentId,
  productTierId,
  resourceId,
  currentSource = "marketplace",
  subscriptionId = ""
) {
  return `/access/service/${serviceId}?environmentId=${environmentId}&resourceId=${resourceId}&productTierId=${productTierId}&source=${currentSource}&subscriptionId=${subscriptionId}`;
}

export function getResourceInstancesDetailsRoute(
  serviceId,
  environmentId,
  productTierId,
  resourceId,
  resourceInstanceId,
  currentSource = "marketplace",
  subscriptionId = ""
) {
  return `/access/${serviceId}/${environmentId}/${resourceId}/${resourceInstanceId}?productTierId=${productTierId}&source=${currentSource}&subscriptionId=${subscriptionId}`;
}

export function getResourceInstancesDetailswithKeyRoute(
  serviceId,
  environmentId,
  productTierId,
  resourceId,
  resourceInstanceId,
  key,
  currentSource = "marketplace",
  subscriptionId = ""
) {
  return `/access/${serviceId}/${environmentId}/${resourceId}/${resourceInstanceId}?productTierId=${productTierId}&view=${key}&source=${currentSource}&subscriptionId=${subscriptionId}`;
}

export function getMarketplaceRoute(
  serviceId,
  environmentId,
  productTierId,
) {
  return `/product-tiers?serviceId=${serviceId}&environmentId=${environmentId}&productTierId=${productTierId}`;
}

export function getAPIDocsRoute(
  serviceId,
  environmentId,
  productTierId,
  currentSource = "marketplace",
  subscriptionId = ""
) {
  return `/access/api-document?serviceId=${serviceId}&environmentId=${environmentId}&productTierId=${productTierId}&source=${currentSource}&subscriptionId=${subscriptionId}`;
}
