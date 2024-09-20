import {
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  Stack,
  styled,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Button from "src/components/Button/Button";
import { Text } from "src/components/Typography/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import TextCopy from "src/components/FormElements/TextCopy/TextCopy";
import LoadingSpinnerSmall from "../CircularProgress/CircularProgress";
import InstructionsModalIcon from "../Icons/AccountConfig/InstructionsModalIcon";
import { getResourceInstanceDetails } from "src/api/resourceInstance";

const CloudFormationLink = ({ cloudFormationTemplateUrl }) => {
  const updateTemplateURL = (url) => {
    // Parse the base URL and hash part
    const [baseURL, hashPart] = url.split("#");
    if (!hashPart) {
      return url; // No hash part found, return the original URL
    }

    // Parse the hash part to get the path and query parameters
    const [basePath, queryParams] = hashPart.split("?");
    const basePaths = queryParams.replace(
      "account-config-setup-template.yaml",
      "account-config-setup-no-lb-policy.yaml"
    );

    const hashParams = new URLSearchParams(basePaths);

    // // Manually construct the query string to avoid encoding issues
    const newQueryParams = Array.from(hashParams.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    // Reconstruct the hash part with updated parameters
    const newHashPart = `${basePath}?${newQueryParams}`;

    return `${baseURL}#${newHashPart}`;
  };

  const updatedUrl = cloudFormationTemplateUrl
    ? updateTemplateURL(cloudFormationTemplateUrl)
    : "";

  return (
    <StyledLink href={updatedUrl} target="_blank" rel="noopener noreferrer">
      this
    </StyledLink>
  );
};

function CloudProviderAccountOrgIdModal(props) {
  const {
    open,
    handleClose,
    orgId,
    isAccountCreation,
    accountConfigMethod,
    cloudFormationTemplateUrl,
    cloudProvider,
    isAccessPage = false,
    downloadTerraformKitMutation,
    accountConfigStatus,
    accountConfigId,
    service,
    selectedResourceKey,
    subscriptionId,
    setCloudFormationTemplateUrl,
    setCloudFormationTemplateUrlNoLB,
    fetchResourceInstancesOfSelectedResource,
    cloudFormationTemplateUrlNoLB,
  } = props;

  const terraformlink = isAccessPage ? (
    <>
      <Box
        sx={{
          cursor: "pointer",
          textDecoration: "underline",
          color: "#7F56D9",
          fontWeight: 700,
          fontStyle: "italic",
        }}
        component="span"
        onClick={() => {
          downloadTerraformKitMutation.mutate();
        }}
      >
        here
      </Box>
      {downloadTerraformKitMutation.isLoading && (
        <LoadingSpinnerSmall sx={{ color: "black", ml: "16px" }} size={12} />
      )}
    </>
  ) : (
    <StyledLink
      href="https://github.com/omnistrate/account-setup"
      target="_blank"
      rel="noopener noreferrer"
    >
      here
    </StyledLink>
  );

  const cloudformationlink = (
    <StyledLink
      href={cloudFormationTemplateUrl ?? ""}
      target="_blank"
      rel="noopener noreferrer"
    >
      here
    </StyledLink>
  );

  const cloudFormationTemplateUrlNoLBLink = (
    <StyledLink
      href={cloudFormationTemplateUrlNoLB ?? ""}
      target="_blank"
      rel="noopener noreferrer"
    >
      this
    </StyledLink>
  );

  const terraformGuide = isAccessPage ? (
    <StyledLink
      href="https://youtu.be/l6lMEZdMMxs"
      target="_blank"
      rel="noopener noreferrer"
    >
      here
    </StyledLink>
  ) : (
    <StyledLink
      href="https://youtu.be/eKktc4QKgaA"
      target="_blank"
      rel="noopener noreferrer"
    >
      here
    </StyledLink>
  );

  const cloudFormationGuide = isAccessPage ? (
    <StyledLink
      href="https://youtu.be/c3HNnM8UJBE"
      target="_blank"
      rel="noopener noreferrer"
    >
      {isAccountCreation ? "here" : "guide"}
    </StyledLink>
  ) : (
    <StyledLink
      href="https://youtu.be/Mu-4jppldwk"
      target="_blank"
      rel="noopener noreferrer"
    >
      {isAccountCreation ? "here" : "guide"}
    </StyledLink>
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"tablet"}>
      <StyledContainer>
        <Header>
          <Stack direction="row" alignItems="center" gap="16px">
            <InstructionsModalIcon />
            <Text size="large" weight="bold">
              Account Configuration Instructions
            </Text>
          </Stack>
          <IconButton onClick={handleClose} sx={{ alignSelf: "flex-start" }}>
            <CloseIcon />
          </IconButton>
        </Header>
        <Content>
          {isAccountCreation ? (
            <CreationTimeInstructions
              accountConfigMethod={accountConfigMethod}
              cloudformationlink={cloudformationlink}
              terraformlink={terraformlink}
              cloudFormationGuide={cloudFormationGuide}
              terraformGuide={terraformGuide}
              orgId={orgId}
              accountConfigStatus={accountConfigStatus}
              accountConfigId={accountConfigId}
              cloudFormationTemplateUrl={cloudFormationTemplateUrl}
              setCloudFormationTemplateUrl={setCloudFormationTemplateUrl}
              setCloudFormationTemplateUrlNoLB={
                setCloudFormationTemplateUrlNoLB
              }
              service={service}
              selectedResourceKey={selectedResourceKey}
              subscriptionId={subscriptionId}
              fetchResourceInstancesOfSelectedResource={
                fetchResourceInstancesOfSelectedResource
              }
              cloudformationNoLBlink={
                cloudFormationTemplateUrlNoLB ? (
                  cloudFormationTemplateUrlNoLBLink
                ) : (
                  <CloudFormationLink
                    cloudFormationTemplateUrl={cloudFormationTemplateUrl}
                  />
                )
              }
            />
          ) : (
            <NonCreatationTimeInstructions
              accountConfigMethod={accountConfigMethod}
              cloudProvider={cloudProvider}
              cloudformationlink={cloudformationlink}
              terraformlink={terraformlink}
              cloudFormationGuide={cloudFormationGuide}
              terraformGuide={terraformGuide}
              orgId={orgId}
              cloudFormationTemplateUrl={cloudFormationTemplateUrl}
              cloudformationNoLBlink={
                cloudFormationTemplateUrlNoLB ? (
                  cloudFormationTemplateUrlNoLBLink
                ) : (
                  <CloudFormationLink
                    cloudFormationTemplateUrl={cloudFormationTemplateUrl}
                  />
                )
              }
            />
          )}
        </Content>
        <Footer>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
        </Footer>
      </StyledContainer>
    </Dialog>
  );
}

export default CloudProviderAccountOrgIdModal;

const CreationTimeInstructions = (props) => {
  const {
    accountConfigMethod,
    cloudformationlink,
    terraformlink,
    cloudFormationGuide,
    terraformGuide,
    orgId,
    accountConfigStatus,
    accountConfigId,
    setCloudFormationTemplateUrl,
    setCloudFormationTemplateUrlNoLB,
    cloudFormationTemplateUrl,
    service,
    selectedResourceKey,
    subscriptionId,
    fetchResourceInstancesOfSelectedResource,
    cloudformationNoLBlink,
  } = props;

  const [isPolling, setIsPolling] = useState(true);
  const [isTimeout, setIsTimeout] = useState(false);
  const pollCount = useRef(0);
  const pollTimerRef = useRef(null);
  const isMounted = useRef(true); //to track the component mount state and stop polling if component is unmounted

  const fetchAccountConfig = async () => {
    if (!isMounted.current) return;

    try {
      const res = await getResourceInstanceDetails(
        service.serviceProviderId,
        service.serviceURLKey,
        service.serviceAPIVersion,
        service.serviceEnvironmentURLKey,
        service.serviceModelURLKey,
        service.productTierURLKey,
        selectedResourceKey,
        accountConfigId,
        subscriptionId
      );
      if (!isMounted.current) return;

      const resourceInstance = res.data;
      const url = resourceInstance?.result_params?.cloudformation_url;
      if (url) {
        fetchResourceInstancesOfSelectedResource?.();
        setCloudFormationTemplateUrl(url);
        const urlNoLB =
          resourceInstance?.result_params?.cloudformation_url_no_lb;
        if (urlNoLB) {
          setCloudFormationTemplateUrlNoLB(urlNoLB);
        }
        setIsPolling(false);
      } else {
        if (pollCount.current < 10) {
          pollTimerRef.current = setTimeout(fetchAccountConfig, 3000); // check for every 3 sec
          pollCount.current += 1;
        } else {
          setIsTimeout(true);
          setIsPolling(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    //if method is cloud formation then clodformation url might not be returned immediately.If it
    //doesn't exist poll the api to check cloudformation template url for 30 seconds
    if (
      accountConfigId &&
      accountConfigMethod === "CloudFormation" &&
      !cloudFormationTemplateUrl
    ) {
      fetchAccountConfig();
    } else if (cloudFormationTemplateUrl) {
      setIsPolling(false);
    }
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      clearInterval(pollTimerRef.current);
    };
    /*eslint-disable-next-line react-hooks/exhaustive-deps  */
  }, []);

  if (accountConfigStatus === "FAILED") {
    return (
      <Text size="medium" weight="regular" color="#344054">
        The account configuration could not be saved because of system error.
        Please try again. If the issue continues, reach out to support for
        assistance.{" "}
      </Text>
    );
  }

  if (accountConfigMethod === "CloudFormation") {
    if (isPolling) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <CircularProgress size={16} />
          <Text size="medium" weight="regular" color="#344054">
            Your CloudFormation stack is being configured. Please wait for the
            detailed setup instructions.
          </Text>
        </Box>
      );
    }

    if (isTimeout) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            margintTop: "20px",
          }}
        >
          <Text size="medium" weight="regular" color="#344054">
            The configuration process is running a bit longer than usual. Please
            check back soon for detailed setup instructions.
          </Text>
        </Box>
      );
    }

    if (!cloudFormationTemplateUrl) {
      return (
        <Text size="medium" weight="regular" color="#344054">
          Your CloudFormation Stack is being configured. Please check back
          shortly for detailed setup instructions.
        </Text>
      );
    }

    return (
      <>
        <Text size="medium" weight="regular" color="#344054">
          Your account details have been saved. To complete the setup please
          create your CloudFormation Stack using the provided template{" "}
          {cloudformationlink}.
        </Text>

        <Text
          size="medium"
          weight="regular"
          color="#344054"
          sx={{ marginTop: "24px" }}
        >
          If an existing AWSLoadBalancerControllerIAMPolicy policy causes an
          error while creating the CloudFormation stack, use{" "}
          {cloudformationNoLBlink} CloudFormation template instead.
        </Text>
        <Text
          size="medium"
          weight="regualr"
          color="#344054"
          sx={{ marginTop: "24px" }}
        >
          For guidance, our instructional video is available{" "}
          {cloudFormationGuide}.
        </Text>
      </>
    );
  }

  return (
    <>
      <Text size="medium" weight="regular" color="#344054">
        Your account details have been saved. To complete the setup execute the
        Terraform scripts available {terraformlink}, by using the Account Config
        Identity ID below.
      </Text>
      <OrgIdContainer orgId={orgId} />

      <Text
        size="medium"
        weight="regualr"
        color="#344054"
        sx={{ marginTop: "24px" }}
      >
        For guidance, our instructional video is available {terraformGuide}.
      </Text>
    </>
  );
};

const NonCreatationTimeInstructions = (props) => {
  const {
    accountConfigMethod,
    terraformlink,
    cloudformationlink,
    cloudFormationGuide,
    terraformGuide,
    orgId,
    cloudFormationTemplateUrl,
    cloudformationNoLBlink,
  } = props;

  return (
    <>
      <Box width={"100%"} mb="30px">
        <Text size="medium" weight="semibold" color="#374151">
          To complete the account configuration setup -
        </Text>

        <List>
          {(!accountConfigMethod ||
            accountConfigMethod === "CloudFormation") && (
            <ListItem>
              <ListItemIcon>
                <ArrowBullet />
              </ListItemIcon>

              {cloudFormationTemplateUrl ? (
                <>
                  <Box display={"flex"} flexDirection={"column"} gap={"10px"}>
                    <Text size="medium" weight="regular" color="#374151">
                      <b>For AWS CloudFormation users:</b> Please create your
                      CloudFormation Stack using the provided template{" "}
                      {cloudformationlink}. Watch the CloudFormation{" "}
                      {cloudFormationGuide} for help.
                    </Text>
                    <Text size="medium" weight="regular" color="#374151">
                      If an existing AWSLoadBalancerControllerIAMPolicy policy
                      causes an error while creating the CloudFormation stack,
                      use {cloudformationNoLBlink} CloudFormation template
                      instead.
                    </Text>
                  </Box>
                </>
              ) : (
                <Text size="medium" weight="regular" color="#374151">
                  <b>For AWS CloudFormation users:</b> Your CloudFormation Stack
                  is being configured. Please check back shortly for detailed
                  setup instructions.
                </Text>
              )}
            </ListItem>
          )}
          {(!accountConfigMethod || accountConfigMethod === "Terraform") && (
            <ListItem>
              <ListItemIcon>
                <ArrowBullet />
              </ListItemIcon>

              <Text size="medium" weight="regular" color="#374151">
                <b>For AWS/GCP Terraform users:</b> Execute the Terraform
                scripts available {terraformlink}, by using the Account Config
                Identity ID below. For guidance our Terraform instructional
                video is {terraformGuide}.
              </Text>
            </ListItem>
          )}
        </List>
      </Box>

      <OrgIdContainer orgId={orgId} />
    </>
  );
};

const OrgIdContainer = (props) => {
  const { orgId } = props;
  return (
    <Box
      sx={{
        marginTop: "24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          padding: "10px 14px",
          background: "#F9FAFB",
          borderRadius: "8px",
          border: "1px solid #D0D5DD",
          background: "#F9FAFB",
          boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        }}
      >
        <TextCopy
          value={orgId}
          readonly
          disabled
          copyButton
          size="medium"
          weight="bold"
          sx={{ color: "#475467" }}
        />
      </Box>
    </Box>
  );
};

const StyledContainer = styled(Box)({
  position: "fixed",
  top: "0",
  right: "50%",
  transform: "translateX(50%)",
  background: "white",
  borderRadius: "12px",
  boxShadow:
    "0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)",
  padding: "24px",
  width: "100%",
  maxWidth: "550px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
});

const Header = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const Content = styled(Box)({
  marginTop: "20px",
  width: "100%",
});

const Footer = styled(Box)({
  marginTop: "24px",
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "16px",
});

const StyledLink = styled(Link)({
  textDecoration: "underline",
  color: "#7F56D9",
  fontWeight: 700,
  fontStyle: "italic",
});

const List = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginTop: "8px",
});

const ListItem = styled(Box)({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "12px",
});

const ListItemIcon = styled(Box)({
  flexShrink: 0,
});

const ArrowBullet = (props) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.7515 17.6485C8.28287 17.1799 8.28287 16.4201 8.7515 15.9515L12.703 12L8.7515 8.04853C8.28287 7.5799 8.28287 6.8201 8.7515 6.35147C9.22013 5.88284 9.97992 5.88284 10.4486 6.35147L15.2486 11.1515C15.7172 11.6201 15.7172 12.3799 15.2486 12.8485L10.4486 17.6485C9.97992 18.1172 9.22013 18.1172 8.7515 17.6485Z"
      fill="#344054"
    />
  </svg>
);
