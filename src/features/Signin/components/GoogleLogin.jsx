import GoogleLoginIcon from "src/components/Icons/GoogleLogin/GoogleLogin";
import SSOLoginButton from "./SSOLoginButton";
import { useGoogleLogin } from "@react-oauth/google";
import Tooltip from "src/components/Tooltip/Tooltip";
import { Box } from "@mui/material";

function GoogleLogin(props) {
  const { handleSSOLogin, disabled } = props;

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      console.log("success", response);
      const code = response.code;
      handleSSOLogin(code, "Google");
    },
    onError: (error) => {
      console.log("Error", error);
    },
    onNonOAuthError: (error) => {
      console.log("Non Oauth Error", error);
    },
    //redirect_uri: "http://localhost:3000/api/idp-auth",
    //ux_mode: "redirect",
    flow: "auth-code",
    //state: "google-auth",
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
