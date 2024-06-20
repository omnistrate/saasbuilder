import { useRouter } from "next/router";
import { useEffect } from "react";
import { customerUserSigninWithIdentityProvider } from "src/api/customer-user";

function IDPAuthHandler(props) {
  const router = useRouter();
  const { state, code } = router.query;

  useEffect(() => {
    async function handleSSOLogin(authorizationCode, identityProviderName) {
      const payload = { authorizationCode, identityProviderName };
      try {
        const response = await customerUserSigninWithIdentityProvider(payload);
        const jwtToken = response.data.jwtToken;
        handleSignInSuccess(jwtToken);
      } catch (error) {
        console.error(error);
      }
    }
    if (code && state) {
      if (state === "google-auth") {
      }
    }
  }, [code, state]);

  return <div>Signing in...</div>;
}

export default IDPAuthHandler;
