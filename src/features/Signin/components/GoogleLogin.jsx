import GoogleLoginIcon from "src/components/Icons/GoogleLogin/GoogleLogin";
import SSOLoginButton from "./SSOLoginButton";
import { useGoogleLogin } from "@react-oauth/google";
import Tooltip from "src/components/Tooltip/Tooltip";
import { Box } from "@mui/material";

function GoogleLogin(props) {
  const { disabled, saasBuilderBaseURL } = props;

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {},
    onError: (error) => {},
    onNonOAuthError: (error) => {},
    redirect_uri: `${saasBuilderBaseURL}/api/idp-auth`,
    ux_mode: "redirect",
    flow: "auth-code",
    state: "google-auth",
  });
  return (
    <Tooltip
      isVisible={disabled}
      title="Temporarily Unavailable"
      placement="top"
    >
      <Box>
        <SSOLoginButton
          onClick={() => {
            handleGoogleLogin();
          }}
          disabled={disabled}
        >
          <GoogleLoginIcon disabled={disabled} />
        </SSOLoginButton>
      </Box>
    </Tooltip>
  );
}

export default GoogleLogin;
