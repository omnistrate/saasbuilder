import { Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";

import { getTerraformKit, getTerraformKitURL } from "src/api/resourceInstance";

import { Text } from "components/Typography/Typography";
import LoadingSpinnerSmall from "components/CircularProgress/CircularProgress";
import CopyButton from "src/components/Button/CopyButton";

const TerraformDownloadURL = ({
  serviceOffering,
  subscriptionId,
  cloud_provider,
}) => {
  const terraformURL = getTerraformKitURL(
    serviceOffering?.serviceProviderId,
    serviceOffering?.serviceURLKey,
    serviceOffering?.serviceAPIVersion,
    serviceOffering?.serviceEnvironmentURLKey,
    serviceOffering?.serviceModelURLKey,
    subscriptionId,
    cloud_provider
  );

  const downloadTerraformKitMutation = useMutation(
    () =>
      getTerraformKit(
        serviceOffering?.serviceProviderId,
        serviceOffering?.serviceURLKey,
        serviceOffering?.serviceAPIVersion,
        serviceOffering?.serviceEnvironmentURLKey,
        serviceOffering?.serviceModelURLKey,
        subscriptionId,
        cloud_provider
      ),
    {
      onSuccess: (response) => {
        const href = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "terraformkit.tar");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      },
    }
  );

  return (
    <Stack
      width="100%"
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      gap="4px"
    >
      <LoadingSpinnerSmall
        sx={{
          flexShrink: "0",
          visibility: downloadTerraformKitMutation.isLoading
            ? "visible"
            : "hidden",
          mr: "12px",
        }}
      />
      <Text
        size="small"
        color="#7F56D9"
        sx={{ cursor: "pointer" }}
        onClick={() => downloadTerraformKitMutation.mutate()}
      >
        Download Terraform Kit
      </Text>

      {/* Show Spinner when Loading */}
      <CopyButton
        text={terraformURL}
        iconProps={{ color: "#6941C6", width: 20, height: 20 }}
        iconStyle={{ flexShrink: 0 }}
      />
    </Stack>
  );
};

export default TerraformDownloadURL;
