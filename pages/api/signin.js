const { customerUserSignIn } = require("src/server/api/customer-user");
const { getEnvironmentType } = require("src/server/utils/getEnvironmentType");

export default async function handleSignIn(nextRequest, nextResponse) {
  if (nextRequest.method === "POST") {
    try {

      const environmentType = getEnvironmentType()
      const payload = {
        ...nextRequest.body,
        environmentType: environmentType,
      };
      const response = await customerUserSignIn(payload);
      nextResponse.status(200).send({ ...response.data });
    } catch (error) {
      let defaultErrorMessage =
        "Failed to sign in. Either the credentials are incorrect or the user does not exist";

      if (
        error.name === "ProviderAuthError" ||
        error?.response?.status === undefined
      ) {
        nextResponse.status(500).send({
          message: defaultErrorMessage,
        });
      } else if (
        error.response?.data?.message === "wrong user email or password"
      ) {
        nextResponse.status(400).send({
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
