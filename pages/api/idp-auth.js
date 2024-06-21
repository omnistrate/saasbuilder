import { customerSignInWithIdentityProvider } from "src/server/api/customer-user";

export default async function handleAuth(nextRequest, nextResponse) {
  if (nextRequest.method === "GET") {
    const { state, code } = nextRequest.query;

    let authRequestPayload = null;

    if (state === "google-auth" && code) {
      const authorizationCode = code;
      authRequestPayload = {
        authorizationCode,
        identityProviderName: "Google",
        redirectUri: `${process.env.YOUR_SAAS_DOMAIN_URL}/api/idp-auth`,
      };
    } else if (state === "github-auth" && code) {
      const authorizationCode = code;
      authRequestPayload = {
        authorizationCode,
        identityProviderName: "GitHub",
      };
    }

    if (authRequestPayload) {
      try {
        const response =
          await customerSignInWithIdentityProvider(authRequestPayload);
        const jwtToken = response.data.jwtToken;
        nextResponse.setHeader("Set-Cookie", `token=${jwtToken}; Path=/`);
        nextResponse.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
        nextResponse.redirect(307, "/signin");
      } catch (err) {
        console.log("IDP AUTH err", err);
      }
    }
  }

  //something went wrong, redirect to signin page with 
  nextResponse.redirect(307, "/signin?redirect_reason=idp_auth_error");
}
