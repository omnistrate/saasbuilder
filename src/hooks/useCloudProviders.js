import { useQuery } from "@tanstack/react-query";
import { getCloudProvider, getCloudProviderIds } from "../api/cloudProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  initialiseClouseProviders,
  selectCloudProviderNames,
  selectProviderLoadingStatus,
  setProvider,
  setProviderIds,
  setProviderIdsLoadingStatus,
  setProviderLoadingStatus,
} from "../slices/providerSlice";
import loadingStatuses from "../utils/constants/loadingStatuses";

export default function useCloudProviders(serviceId, serviceModelId) {
  const dispatch = useDispatch();
  const cloudProviders = useSelector(selectCloudProviderNames);
  const loadingStatus = useSelector(selectProviderLoadingStatus);
  const isLoading = loadingStatus === loadingStatuses.loading;

  let isQueryEnabled = false;
  if (serviceId || serviceModelId) {
    //either both serviceId and serviceModelId or none should be present for query to be enabled
    if (serviceId && serviceModelId) {
      isQueryEnabled = true;
    }
  } else {
    isQueryEnabled = true;
  }

  const query = useQuery(
    ["cloud-provider", serviceId, serviceModelId],
    () => {
      dispatch(initialiseClouseProviders());
      dispatch(setProviderIdsLoadingStatus(loadingStatuses.loading));
      dispatch(setProviderLoadingStatus(loadingStatuses.loading));
      return getCloudProviderIds(serviceId, serviceModelId);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      enabled: isQueryEnabled,
      onSuccess: (response) => {
        dispatch(setProviderIdsLoadingStatus(loadingStatuses.success));
        const providerIds = response.data.ids;
        dispatch(setProviderIds(providerIds));

        Promise.all(
          providerIds.map((providerId) => {
            return getCloudProvider(providerId).then((res) => {
              const { data } = res;
              dispatch(setProvider(data));
            });
          })
        ).then(() => {
          dispatch(setProviderLoadingStatus(loadingStatuses.success));
        });
      },
      onError: (error) => {
        dispatch(setProviderIdsLoadingStatus(loadingStatuses.error));
        dispatch(setProviderLoadingStatus(loadingStatuses.error));
        console.error(error?.response?.data);
      },
    }
  );

  return {
    cloudProviders,
    refetch: query.refetch,
    isLoading,
  };
}
