import styled from "@emotion/styled";
import errorImage from "../public/assets/images/error.png";
import Image from "next/image";
import { Box, Stack } from "@mui/material";
import Link from "next/link";
import { getProviderOrgDetails } from "src/server/api/customer-user";
import Button from "components/Button/Button";

export const getServerSideProps = async () => {
  try {
    const response = await getProviderOrgDetails();

    return {
      props: {
        orgSupportEmail: response.data.orgSupportEmail || response.data.email,
      },
    };
  } catch (error) {
    return {
      props: {
        orgSupportEmail: "",
      },
    };
  }
};

function Error(props) {
  const { orgSupportEmail } = props;
  return (
    <Stack direction="row" justifyContent="center">
      <Box textAlign="center">
        <ErrorImage src={errorImage} alt="error" priority />
        <Title>Something went wrong!</Title>
        <Description>
          Sorry about that! Please return to the home page and try again.{" "}
          {orgSupportEmail
            ? `If the issue persists please reach out at ${orgSupportEmail}`
            : ""}
        </Description>
        <Link href="/service-plans">
          <Button variant="contained" size="xlarge" sx={{ marginTop: "40px" }}>
            Go to Home
          </Button>
        </Link>
      </Box>
    </Stack>
  );
}

export default Error;

const ErrorImage = styled(Image)({
  width: "100%",
  maxWidth: "620px",
  height: "auto",
});

const Title = styled("h2")({
  fontSize: "36px",
  lineHeight: "44px",
  fontWeight: 700,
  marginTop: 36,
  textAlign: "center",
});

const Description = styled("p")({
  margin: 0,
  fontSize: "20px",
  lineHeight: "30px",
  color: "#475467",
  marginTop: 24,
  maxWidth: 600,
  textAlign: "center",
});
