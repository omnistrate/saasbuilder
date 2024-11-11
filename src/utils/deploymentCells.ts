export const CLOUD_ACCOUNT_ID_FIELD_MAP = {
  aws: "awsAccountID",
  gcp: "gcpProjectID",
};

export const omnstrateDomainRegex = /omnistrate\.com$/;

export const hideDashboardEndpoint = (accountID: string, email: string) => {
  return accountID === "OMNISTRATE_HOSTED" && !omnstrateDomainRegex.test(email);
};
