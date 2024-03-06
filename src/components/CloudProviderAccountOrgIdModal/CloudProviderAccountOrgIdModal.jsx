import { Box, Dialog, IconButton, Stack, styled } from "@mui/material";
import React from "react";
import Button from "src/components/Button/Button";
import { Text } from "src/components/Typography/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import TextCopy from "src/components/FormElements/TextCopy/TextCopy";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import LoadingSpinnerSmall from "../CircularProgress/CircularProgress";

function CloudProviderAccountOrgIdModal(props) {
  const {
    open,
    handleClose,
    orgId,
    isAccountCreation,
    isAccessPage = false,
    downloadTerraformKitMutation,
  } = props;

  const TerraFormLink = isAccessPage ? (
    <>
      <Box
        sx={{
          textDecoration: "underline",
          color: "blue",
          cursor: "pointer",
        }}
        component="span"
        onClick={() => {
          downloadTerraformKitMutation.mutate();
        }}
      >
        link
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
      link
    </StyledLink>
  );

  const videoLink = isAccessPage ? (
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

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"tablet"}>
      <StyledContainer>
        <Header>
          <Stack direction="row" alignItems="center" gap="16px">
            <ChecklistOutlinedIcon />
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
            <Text size="medium" weight="normal">
              Your account details have been saved. Please run the Terraform
              scripts, if you haven't already, by following this {TerraFormLink}
              . Use the <b> Account Config Identity ID </b> displayed below
              during this process.
            </Text>
          ) : (
            <Text size="medium" weight="normal">
              To configure your account with Omnistrate, you may add your
              account details and run the Terraform scripts in either order.
              Please run the Terraform scripts by following this {TerraFormLink}
              . Use the <b> Account Config Identity ID</b> displayed below
              during this process.
            </Text>
          )}
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
                border: "1px solid #D0D5DD",
                borderRadius: "4px",
                padding: "8px",
                background: "#F9FAFB",
              }}
            >
              <TextCopy
                value={orgId}
                readonly
                disabled
                copyButton
                size="large"
                weights="semibold"
                sx={{ color: "#475467" }}
              />
            </Box>
          </Box>

          <Text size="medium" weight="normal" sx={{ marginTop: "16px" }}>
            For guidance, our instructional video is available {videoLink}.
          </Text>
        </Content>
        <Footer>
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
        </Footer>
      </StyledContainer>
    </Dialog>
  );
}

export default CloudProviderAccountOrgIdModal;

const StyledContainer = styled(Box)({
  width: "100%",
  padding: "24px",
  borderRadius: "12px",
});

const Header = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const Content = styled(Box)({
  marginTop: "24px",
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
  color: "blue",
});
