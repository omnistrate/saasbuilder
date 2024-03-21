import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  getRegionById,
  getRegionIdsByCloudProviderWithParams,
} from "../api/region";
import {
  selectCloudProviderNames,
  selectProviderLoadingStatus,
} from "../slices/providerSlice";
import {
  setRegion,
  setRegionIds,
  setRegionIdsLoadingStatus,
  setRegionsLoadingStatus,
} from "../slices/regionSlice";
import loadingStatuses from "../utils/constants/loadingStatuses";

function useCloudProviderRegions(serviceId, serviceModelId) {
  const dispatch = useDispatch();
  const cloudProvidersLoadingStatus = useSelector(selectProviderLoadingStatus);
  const cloudProviders = useSelector(selectCloudProviderNames);
  const isCloudProviderDataLoaded =
    cloudProvidersLoadingStatus === loadingStatuses.success;
  const enabled = Boolean(
    isCloudProviderDataLoaded && serviceId && serviceModelId
  );

  useQuery(
    ["regions", cloudProviders],
    async () => {
      dispatch(setRegionIdsLoadingStatus(loadingStatuses.loading));
      dispatch(setRegionsLoadingStatus(loadingStatuses.loading));

      const allRegionIds = [];

      await Promise.all(
        cloudProviders.map((cloudProvider) => {
          return getRegionIdsByCloudProviderWithParams(
            cloudProvider,
            serviceId,
            serviceModelId
          ).then((response) => {
            const regionIds = response.data.ids;

            allRegionIds.push(...regionIds);
          });
        })
      );
      dispatch(setRegionIds(allRegionIds));
      dispatch(setRegionIdsLoadingStatus(loadingStatuses.success));

      const responses = await Promise.all(
        allRegionIds.map((regionId) => {
          return getRegionById(regionId).then((response) => {
            dispatch(setRegion(response.data));
          });
        })
      );
      dispatch(setRegionsLoadingStatus(loadingStatuses.success));

      return responses;
    },
    {
      enabled: enabled,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: async () => {},
      onError: (error) => {
        dispatch(setRegionsLoadingStatus(loadingStatuses.error));
        console.error(error?.response?.data);
      },
    }
  );
}

export default useCloudProviderRegions;
