export const AWS_BOOTSTRAP_ROLE_ARN =
  "arn:aws:iam::<ACCOUNT_ID>:role/omnistrate-bootstrap-role";

export const GCP_SERVICE_ACCOUNT_EMAIL =
  "bootstrap-<ORG_ID>@<PROJECT_ID>.iam.gserviceaccount.com";

export const getAwsBootstrapArn = (awsAccountId) => {
  return AWS_BOOTSTRAP_ROLE_ARN.replace("<ACCOUNT_ID>", awsAccountId);
};

export const getGcpServiceEmail = (gcpProjectID, orgId) => {
  return GCP_SERVICE_ACCOUNT_EMAIL.replace(
    "<PROJECT_ID>",
    gcpProjectID
  ).replace("<ORG_ID>", orgId);
};
