import { CloudProvider } from "./common/enums";

export type CustomNetwork = {
  cidr: string;
  cloudProviderName: CloudProvider;
  cloudProviderRegion: string;
  id: string;
  name: string;
};

export type CustomNetworkCreatePayload = {
  cidr: string;
  cloudProviderName: CloudProvider;
  cloudProviderRegion: string;
  name: string;
};
