import ResetPasswordPage from "src/features/ResetPassword/ResetPasswordPage";
import { getProviderOrgDetails } from "src/server/api/customer-user";

export const getServerSideProps = async () => {
  let orgName = "";
  let orgLogoURL = "";
  try {
    const response = await getProviderOrgDetails();
    orgName = response.data.orgName;
    orgLogoURL = response.data.orgLogoURL;
  } catch (err) {}

  return {
    props: {
      orgName: orgName,
      orgLogoURL: orgLogoURL,
      googleReCaptchaSiteKey: process.env.GOOGLE_RECAPTCHA_SITE_KEY || null,
      isReCaptchaSetup:
        Boolean(process.env.GOOGLE_RECAPTCHA_SITE_KEY) &&
        Boolean(process.env.GOOGLE_RECAPTCHA_SECRET_KEY),
    },
  };
};

export default ResetPasswordPage;
