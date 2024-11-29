import { CloudProvider } from "./common/enums";

export type Subscription = {
  accountConfigIdentityId: string;
  cloudProviderNames: CloudProvider[];
  createdAt: string;
  defaultSubscription: boolean;
  id: string;
  productTierId: string;
  productTierName: string;
  roleType: string;
  rootUserId: string;
  serviceId: string;
  serviceLogoURL: string;
  serviceName: string;
  serviceOrgId: string;
  serviceOrgName: string;
  status: string;
  subscriptionOwnerName: string;
};
