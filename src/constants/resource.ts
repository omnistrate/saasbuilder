export const RESOURCE_TYPES = {
  OperatorCRD: "OperatorCRD",
  Kustomize: "Kustomize",
  HelmChart: "HelmChart",
  Terraform: "Terraform",
};

export const CLI_MANAGED_RESOURCES = [
  RESOURCE_TYPES.OperatorCRD,
  RESOURCE_TYPES.HelmChart,
  RESOURCE_TYPES.Kustomize,
  RESOURCE_TYPES.Terraform,
];
