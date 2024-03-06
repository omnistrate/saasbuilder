import { Box, Tooltip, styled } from "@mui/material";
import Link from "next/link";
import React, { Fragment } from "react";
import Card from "src/components/Card/Card";
import placeholderServiceIcon from "public/assets/images/dashboard/service/cloud-services-icon.svg";
import Image from "next/image";
import { Text } from "src/components/Typography/Typography";
import AwsLogo from "src/components/Logos/AwsLogo/AwsLogo";
import AzureLogo from "src/components/Logos/AzureLogo/AzureLogo";
import GcpLogo from "src/components/Logos/GcpLogo/GcpLogo";
import { SANDBOX_ORG_IDS } from "../constants";
import styles from "../styles.module.css";

const CLOUD_PROVIDERS_MAP = {
  aws: <AwsLogo />,
  gcp: <GcpLogo />,
  AZURE: <AzureLogo />,
};

function ServiceCard(props) {
  const { serviceData, link } = props;

  return (
    <Link href={link ?? ""} style={{ placeSelf: "stretch" }}>
      <Card
        sx={{
          Width: "100%",
          color: "#fff",
          padding: "20px",
          cursor: "pointer",
          borderRadius: "12px",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {SANDBOX_ORG_IDS.includes(serviceData?.serviceOrgId) && (
          <Box className={styles.ribbon}>Sandbox</Box>
        )}

        <Box
          height={"100%"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
          gap="16px"
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "16px",
              width: "100%",
            }}
          >
            <StyledLogo
              src={serviceData?.serviceLogoURL || placeholderServiceIcon}
              sx={{ objectFit: serviceData?.serviceLogoURL ? "cover" : "" }}
              height={40}
              width={40}
              alt="service-icon"
            />
          </Box>
          <Box sx={{ paddingRight: "30px" }}>
            <Text color="#33475B" size="large" weight="medium">
              {serviceData?.serviceName}
            </Text>
            <Text color="#33475B" size="small" weight="regular">
              Created By{" "}
              <Box component="span" sx={{ fontWeight: 600 }}>
                {serviceData?.serviceProviderName}
              </Box>
            </Text>
          </Box>

          <Box alignSelf={"flex-start"}>
            <Tooltip title={serviceData?.serviceDescription}>
              <Text size="small" weight="regular" color="#33475B">
                {serviceData?.serviceDescription?.length > 100
                  ? `${serviceData?.serviceDescription?.substring(0, 100)}...`
                  : serviceData?.serviceDescription}
              </Text>
            </Tooltip>
          </Box>

          <Box>
            <Text size="small" weight="regular" color="#33475B">
              Available in
            </Text>
            <CloudProvidersList>
              {serviceData?.cloudProviders?.map((provider, i) => {
                return (
                  <Fragment key={i}>{CLOUD_PROVIDERS_MAP[provider]}</Fragment>
                );
              })}
            </CloudProvidersList>
          </Box>
        </Box>
      </Card>
    </Link>
  );
}

export default ServiceCard;

const StyledLogo = styled(Image)({
  height: "40px",
});

const CloudProvidersList = styled(Box)({
  display: "flex",
  marginTop: "15px",
  gap: "10px",
});
