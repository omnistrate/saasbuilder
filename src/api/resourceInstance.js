import axios from "../axios";

export const createResourceInstance = (payload) => {
  const queryParams = {};
  if (payload.subscriptionId) {
    queryParams.subscriptionId = payload.subscriptionId;
  }

  return axios.post(
    `/resource-instance/${payload.serviceProviderId}/${payload.serviceKey}/${payload.serviceAPIVersion}/${payload.serviceEnvironmentKey}/${payload.serviceModelKey}/${payload.productTierKey}/${payload.resourceKey}`,
    {
      cloud_provider: payload.cloud_provider,
      network_type: payload.network_type,
      region: payload.region,
      requestParams: payload.requestParams,
    },
    { params: queryParams }
  );
};

export const updateResourceInstance = (payload) => {
  const queryParams = {};
  if (payload.subscriptionId) {
    queryParams.subscriptionId = payload.subscriptionId;
  }

  return axios.put(
    `/resource-instance/${payload.serviceProviderId}/${payload.serviceKey}/${payload.serviceAPIVersion}/${payload.serviceEnvironmentKey}/${payload.serviceModelKey}/${payload.productTierKey}/${payload.resourceKey}/${payload.id}?subscriptionId=${payload.subscriptionId}`,
    {
      requestParams: payload.requestParams,
    },
    { params: queryParams }
  );
};

export const startResourceInstance = (payload) => {
  const queryParams = {};
  if (payload.subscriptionId) {
    queryParams.subscriptionId = payload.subscriptionId;
  }

  return axios.post(
    `/resource-instance/${payload.serviceProviderId}/${payload.serviceKey}/${payload.serviceAPIVersion}/${payload.serviceEnvironmentKey}/${payload.serviceModelKey}/${payload.productTierKey}/${payload.resourceKey}/${payload.id}/start`,
    {},
    { params: queryParams }
  );
};

export const stopResourceInstance = (payload) => {
  const queryParams = {};
  if (payload.subscriptionId) {
    queryParams.subscriptionId = payload.subscriptionId;
  }

  return axios.post(
    `/resource-instance/${payload.serviceProviderId}/${payload.serviceKey}/${payload.serviceAPIVersion}/${payload.serviceEnvironmentKey}/${payload.serviceModelKey}/${payload.productTierKey}/${payload.resourceKey}/${payload.id}/stop`,
    {},
    { params: queryParams }
  );
};

export const restartResourceInstance = (payload) => {
  const queryParams = {};
  if (payload.subscriptionId) {
    queryParams.subscriptionId = payload.subscriptionId;
  }

  return axios.post(
    `/resource-instance/${payload.serviceProviderId}/${payload.serviceKey}/${payload.serviceAPIVersion}/${payload.serviceEnvironmentKey}/${payload.serviceModelKey}/${payload.productTierKey}/${payload.resourceKey}/${payload.id}/restart`,
    {},
    { params: queryParams }
  );
};

export const getResourceInstanceIds = (
  serviceProviderId,
  serviceKey,
  serviceAPIVersion,
  serviceEnvironmentKey,
  serviceModelKey,
  productTierKey,
  resourceKey,
  subscriptionId
) => {
  const queryParams = {};

  if (subscriptionId) {
    queryParams.subscriptionId = subscriptionId;
  }

  return axios.get(
    `/resource-instance/${serviceProviderId}/${serviceKey}/${serviceAPIVersion}/${serviceEnvironmentKey}/${serviceModelKey}/${productTierKey}/${resourceKey}`,
    {
      params: queryParams,
    }
  );
};

export const getResourceInstanceDetails = (
  serviceProviderId,
  serviceKey,
  serviceAPIVersion,
  serviceEnvironmentKey,
  serviceModelKey,
  productTierKey,
  resourceKey,
  id,
  subscriptionId
) => {
  const queryParams = {};

  if (subscriptionId) {
    queryParams.subscriptionId = subscriptionId;
  }

  return axios.get(
    `/resource-instance/${serviceProviderId}/${serviceKey}/${serviceAPIVersion}/${serviceEnvironmentKey}/${serviceModelKey}/${productTierKey}/${resourceKey}/${id}`,
    {
      params: queryParams,
    }
  );
};

export const deleteResourceInstance = (payload) => {
  const queryParams = {};
  if (payload.subscriptionId) {
    queryParams.subscriptionId = payload.subscriptionId;
  }
  return axios.delete(
    `/resource-instance/${payload.serviceProviderId}/${payload.serviceKey}/${payload.serviceAPIVersion}/${payload.serviceEnvironmentKey}/${payload.serviceModelKey}/${payload.productTierKey}/${payload.resourceKey}/${payload.id}`,
    {
      params: queryParams,
    }
  );
};

export const getTerraformKit = (
  serviceProviderId,
  serviceKey,
  serviceAPIVersion,
  serviceEnvironmentKey,
  serviceModelKey,
  subscriptionId
) => {
  const queryParams = {};

  if (subscriptionId) {
    queryParams.subscriptionId = subscriptionId;
  }
  return axios.get(
    `/resource-instance/${serviceProviderId}/${serviceKey}/${serviceAPIVersion}/${serviceEnvironmentKey}/${serviceModelKey}/setup-kit`,
    {
      params: queryParams,
      responseType: "blob",
    }
  );
};

export const failoverResourceInstanceNode = (data) => {
  const {
    serviceProviderId,
    serviceKey,
    serviceAPIVersion,
    serviceEnvironmentKey,
    serviceModelKey,
    productTierKey,
    resourceKey,
    instanceId,
    failedReplicaId,
    failedReplicaAction = "FAILOVER_AND_RESTART",
    subscriptionId,
  } = data;
  const queryParams = {};

  if (subscriptionId) {
    queryParams.subscriptionId = subscriptionId;
  }

  return axios.post(
    `/resource-instance/${serviceProviderId}/${serviceKey}/${serviceAPIVersion}/${serviceEnvironmentKey}/${serviceModelKey}/${productTierKey}/${resourceKey}/${instanceId}/failover`,
    {
      failedReplicaId,
      failedReplicaAction,
    },
    { params: queryParams }
  );
};
