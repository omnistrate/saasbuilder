import { Box, styled } from "@mui/material";
import React from "react";
import { DisplayText } from "src/components/Typography/Typography";
import FieldLabel from "src/components/FormElements/FieldLabel/FieldLabel";
import Image from "next/image";
import newserviceImg from "public/assets/images/dashboard/settings.jpg";
import SettingsTab from "./SettingsTab";

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
            border: "4px solid  #FFFFFF",
            padding: "43px 58px",
            borderRadius: "50%",
            background: "#F2F4F7",
          }}
        >
          <DisplayText size="xlarge" weight="medium">
            {selectUser.name.toUpperCase().charAt(0)}
          </DisplayText>
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

      <Box sx={{ marginBottom: "24px", marginTop: "48px" }}>
        <SettingsTab currentTab={currentTab} router={router} />
      </Box>
    </>
  );
}

export default UserInfoBanner;

const ServiceImageContainer = styled(Box)(() => ({
  background: "#F9F9F9",
  border: "1px solid #EFF0F0",
  borderRadius: "6px",
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
