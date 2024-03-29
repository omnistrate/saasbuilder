import { customerUserResetPassword } from "src/server/api/customer-user";

export default async function handleResetPassword(nextRequest, nextResponse) {
  if (nextRequest.method === "POST") {
    try {
      const response = await customerUserResetPassword(nextRequest.body);
      nextResponse.status(200).send();
    } catch (error) {
      let defaultErrorMessage = "Something went wrong. Please retry";

      if (
        error.name === "ProviderAuthError" ||
        error?.response?.status === undefined
      ) {
        nextResponse.status(500).send({
          message: defaultErrorMessage,
        });
      } else {
        let responseErrorMessage = error.response?.data?.message;

        if (responseErrorMessage === "user not found: record not found") {
            nextResponse.status(200).send()
        }

        nextResponse.status(error.response?.status || 500).send({
          message: responseErrorMessage || defaultErrorMessage,
        });
      }
    }
  } else {
    nextResponse.status(404).json({
      message: "Endpoint not found",
    });
  }
}
