import { Box, styled } from "@mui/material";
import React from "react";
import { DisplayText } from "src/components/Typography/Typography";
import FieldLabel from "src/components/FormElements/FieldLabel/FieldLabel";
import Image from "next/image";
import newserviceImg from "public/assets/images/dashboard/settings.jpg";
import SettingsTab from "./SettingsTab";
import LogoHeader from "src/components/Headers/LogoHeader";

function UserInfoBanner(props) {
  const { selectUser, currentTab, router } = props;

  return (
    <>
      <ServiceLogo sx={{ padding: 0 }} imgSrc={newserviceImg} alt="service" />

      <Box
        display="flex"
        alignItems="center"
        sx={{ marginTop: "-40px", marginLeft: "40px" }}
      >
        <Box
          sx={{
            border: "4px solid rgba(255, 255, 255, 1)",
            borderRadius: "100%",
            background: "#F2F4F7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)",
          }}
        >
          <Box
            sx={{
              border: "1px solid rgba(0, 0, 0, 0.08)",
              padding: "43px 52px",
              borderRadius: "100%",
              background: "#F2F4F7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DisplayText size="xlarge" weight="medium">
              {selectUser.name?.toUpperCase().charAt(0)}
            </DisplayText>
          </Box>
        </Box>

        <Box sx={{ marginLeft: "20px" }}>
          <FieldLabel
            sx={{
              fontWeight: 600,
              fontSize: "30px",
              lineHeight: "38px",
              color: "#101828",
            }}
          >
            {selectUser.name}
          </FieldLabel>
          <br />
          <FieldLabel>{selectUser.email}</FieldLabel>
        </Box>
      </Box>
      <Box
        display="flex"
        //@ts-ignore
        flexDirection="colunm"
        justifyContent="flex-start"
        paddingBottom={"24px"}
        marginLeft="22px"
        marginTop="48px"
      >
        <LogoHeader margin={0} title={"Settings"} desc="" />
      </Box>

      <Box sx={{ marginBottom: "24px", padding: "0px 32px" }}>
        <SettingsTab currentTab={currentTab} router={router} />
      </Box>
    </>
  );
}

export default UserInfoBanner;

const ServiceImageContainer = styled(Box)(() => ({
  background: "#F9F9F9",
}));

const ServiceImage = styled(Image)(() => ({
  height: "100%",
  width: "100%",
}));

export const ServiceLogo = (props) => {
  const { imgSrc, alt } = props;
  return (
    <ServiceImageContainer>
      <ServiceImage src={imgSrc} alt={alt} />
    </ServiceImageContainer>
  );
};
