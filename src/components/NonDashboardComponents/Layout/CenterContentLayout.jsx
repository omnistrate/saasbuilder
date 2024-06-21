import Head from "next/head";
import { Box, Stack } from "@mui/material";
import Footer from "../Footer";
import Logo from "../Logo";
import BackgroundImg from "public/assets/images/non-dashboard/wave-background.svg";
import NoLogoImage from "public/assets/images/logos/no-logo.png";
import Image from "next/image";

const CenterContentLayout = ({
  orgName,
  orgLogoURL,
  showLogo,
  children,
  pageTitle,
}) => {
  return (
    <>
      {pageTitle && (
        <Head>
          <title>{pageTitle}</title>
        </Head>
      )}
      <Box
        height="100%"
        sx={{
          position: "relative", // For the Footer
          display: "grid",
          placeItems: "center",
          backgroundImage: `url(${BackgroundImg.src})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Stack gap="32px" maxWidth="480px">
          {showLogo && (
            <Box textAlign="center">
              {orgLogoURL ? (
                <Logo src={orgLogoURL} alt={orgName} />
              ) : (
                <Image src={NoLogoImage} />
              )}
            </Box>
          )}
          {children}
        </Stack>
        <Footer orgName={orgName} />
      </Box>
    </>
  );
};

export default CenterContentLayout;
