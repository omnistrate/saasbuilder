import { getProviderOrgDetails } from "src/server/api/customer-user";

export default async function handleGetProviderDetails(
  nextRequest,
  nextResponse
) {
  if (nextRequest.method === "GET") {
    try {
      const response = await getProviderOrgDetails();
      nextResponse.status(200).send({ ...response.data });
    } catch (error) {
      console.error(error);
      let defaultErrorMessage = "Something went wrong. Please retry";

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
