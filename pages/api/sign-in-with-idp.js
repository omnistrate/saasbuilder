import { customerSignInWithIdentityProvider } from "src/server/api/customer-user";

export default async function handleSignIn(nextRequest, nextResponse) {
  if (nextRequest.method === "POST") {
    try {
      const requestBody = { ...nextRequest.body };
      
      requestBody.redirectUri = `${process.env.YOUR_SAAS_DOMAIN_URL}/idp-auth`;

      const response = await customerSignInWithIdentityProvider(requestBody);

      nextResponse.status(200).send({ ...response.data });
    } catch (error) {
      let defaultErrorMessage = "Someting went wrong. Please retry";

      if (
        error.name === "ProviderAuthError" ||
        error?.response?.status === undefined
      ) {
        nextResponse.status(500).send({
          message: defaultErrorMessage,
        });
      } else {
        nextResponse.status(error.response?.status || 500).send({
          message: error.response?.data?.message || defaultErrorMessage,
        });
      }
    }
  } else {
    nextResponse.status(404).json({
      message: "Endpoint not found",
    });
  }
}
