import SSOLoginButton from "./SSOLoginButton";
import Tooltip from "src/components/Tooltip/Tooltip";
import { Box } from "@mui/material";
import GithubLoginIcon from "src/components/Icons/GithubLogin/GithubLogin";
import { useRouter } from "next/router";

function GithubLogin(props) {
  const { disabled, githubClientID } = props;
  const router = useRouter();

  function handleGitHubLogin() {
    router.push(
      `https://github.com/login/oauth/authorize?client_id=${githubClientID}&scope=user:email&redirect_uri=${window.location.origin}/api/idp-auth&state=github-auth`
    );
  }

  return (
    <Tooltip
      isVisible={disabled}
      title="Temporarily Unavailable"
      placement="top"
    >
      <Box>
        <SSOLoginButton
          onClick={() => {
            handleGitHubLogin();
          }}
          disabled={disabled}
        >
          <GithubLoginIcon disabled={disabled} />
        </SSOLoginButton>
      </Box>
    </Tooltip>
  );
}

export default GithubLogin;
