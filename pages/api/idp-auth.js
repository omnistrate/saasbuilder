import { customerSignInWithIdentityProvider } from "src/server/api/customer-user";

export default async function handleAuth(nextRequest, nextResponse) {
  if (nextRequest.method === "GET") {
    const { state } = nextRequest.query;

    let authRequestPayload = null;

    if (state === "google-auth") {
      const authorizationCode = nextRequest.query.code;
      authRequestPayload = {
        authorizationCode,
        identityProviderName: "Google",
        legalCompanyName: "Test",
      };
    } else if (state === "github-auth") {
      const authorizationCode = nextRequest.query.code;
      authRequestPayload = {
        authorizationCode,
        identityProviderName: "GitHub",
        legalCompanyName: "Test",
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
  nextResponse.redirect(307, "/signin");
}
