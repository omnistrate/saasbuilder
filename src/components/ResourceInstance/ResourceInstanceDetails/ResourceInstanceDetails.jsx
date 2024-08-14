import { useMemo } from "react";
import { Box } from "@mui/material";
import capitalize from "lodash/capitalize";
import formatDateUTC from "src/utils/formatDateUTC";

import PropertyTable from "components/PropertyTable/PropertyTable";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import { PasswordWithOutBorderField } from "components/FormElementsv2/PasswordField/PasswordWithOutBorderField";

import TerraformDownloadURL from "./TerraformDownloadURL";
import NonOmnistrateIntegrationRow from "./NonOmnistrateIntegrationRow";
import { INTEGRATION_TYPE_LABEL_MAP } from "src/constants/productTierFeatures";

function ResourceInstanceDetails(props) {
  const {
    resourceInstanceId,
    resultParameters = {},
    isLoading,
    resultParametersSchema = [],
    createdAt,
    modifiedAt,
    subscriptionId,
    serviceOffering,
    nonOmnistrateInternalLogs,
    nonOmnistrateInternalMetrics,
  } = props;

  const isResourceBYOA =
    resultParameters.gcp_project_id || resultParameters.aws_account_id;

  const resultParametersWithDescription = useMemo(() => {
    const result = Object.keys(resultParameters)
      .map((key) => {
        const match = resultParametersSchema.find((param) => param.key === key);
        return {
          ...match,
          value: resultParameters[key],
          key,
        };
      })
      .filter((param) => {
        const filterArr = [
          "availability_zones",
          "cluster_endpoint",
          "node_endpoints",
          "private_network_cidr",
          "private_network_id",
        ];

        if (isResourceBYOA) {
          if (resultParameters.cloud_provider === "aws") {
            filterArr.push(
              ...[
                "gcp_project_id",
                "gcp_project_number",
                "gcp_service_account_email",
              ]
            );
          } else if (resultParameters.cloud_provider === "gcp") {
            filterArr.push(...["aws_account_id", "aws_bootstrap_role_arn"]);
          }

          if (resultParameters.account_configuration_method === "Terraform") {
            filterArr.push("cloudformation_url");
          }
        }

        return !filterArr.includes(param.key);
      });
    return result;
  }, [isResourceBYOA, resultParameters, resultParametersSchema]);

  const rows = useMemo(() => {
    const res = [
      {
        label: "Instance ID",
        value: resourceInstanceId,
      },
      {
        label: "Created at",
        value: formatDateUTC(createdAt),
      },
      {
        label: "Modified at",
        value: formatDateUTC(modifiedAt),
      },
    ];

    if (nonOmnistrateInternalMetrics?.Url) {
      res.push({
        label:
          INTEGRATION_TYPE_LABEL_MAP[nonOmnistrateInternalMetrics.featureName],
        value: (
          <NonOmnistrateIntegrationRow
            integration={nonOmnistrateInternalMetrics}
          />
        ),
        valueType: "custom",
      });
    }

    if (nonOmnistrateInternalLogs?.Url) {
      res.push({
        label:
          INTEGRATION_TYPE_LABEL_MAP[nonOmnistrateInternalLogs.featureName],
        value: (
          <NonOmnistrateIntegrationRow
            integration={nonOmnistrateInternalLogs}
          />
        ),
        valueType: "custom",
      });
    }

    resultParametersWithDescription.forEach((param) => {
      if (param.type === "Password") {
        res.push({
          label: param.displayName,
          description: param.description,
          value: (
            <PasswordWithOutBorderField>
              {param.value}
            </PasswordWithOutBorderField>
          ),
          valueType: "custom",
        });
      } else {
        res.push({
          label: param.displayName || param.key,
          description: param.description,
          value: param.value,
        });
      }
    });

    if (
      serviceOffering &&
      subscriptionId &&
      resultParameters.account_configuration_method === "Terraform"
    ) {
      res.push({
        label: "Terraform Download URL",
        description:
          "Terraform Kit URL to configure access to an AWS/GCP account",
        value: (
          <TerraformDownloadURL
            serviceOffering={serviceOffering}
            subscriptionId={subscriptionId}
            cloud_provider={resultParameters.aws_account_id ? "aws" : "gcp"}
          />
        ),
        valueType: "custom",
      });
    }

    return res;
  }, [
    resourceInstanceId,
    createdAt,
    modifiedAt,
    nonOmnistrateInternalMetrics,
    nonOmnistrateInternalLogs,
    resultParametersWithDescription,
    serviceOffering,
    subscriptionId,
    resultParameters,
  ]);

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          mt: "54px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <LoadingSpinner />
      </Box>
    );
  }

  return <PropertyTable rows={rows} />;
}

export default ResourceInstanceDetails;
