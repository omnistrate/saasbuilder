import { customerUserSignUp } from "src/server/api/customer-user";

export default async function handleSignup(nextRequest, nextResponse) {
  if (nextRequest.method === "POST") {
    try {
      const response = await customerUserSignUp(nextRequest.body);
      return nextResponse.status(200).send();
    } catch (error) {
      console.error(error?.response?.data);
      let defaultErrorMessage = "Something went wrong. Please retry";

      if (
        error.name === "ProviderAuthError" ||
        error?.response?.status === undefined
      ) {
        return nextResponse.status(500).send({
          message: defaultErrorMessage,
        });
      } else {
        let responseErrorMessage = error.response?.data?.message;

        if (responseErrorMessage === "tenant already exists") {
          return nextResponse.status(200).send();
        }
        return nextResponse.status(error.response?.status || 500).send({
          message: responseErrorMessage || defaultErrorMessage,
        });
      }
    }
  } else {
    return nextResponse.status(404).json({
      message: "Endpoint not found",
    });
  }
}
