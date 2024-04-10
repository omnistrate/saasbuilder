import { getProviderOrgDetails } from "src/server/api/customer-user";

export default async function handleGetProviderDetails(
  nextRequest,
  nextResponse
) {
  if (nextRequest.method === "GET") {
    try {
      const response = await getProviderOrgDetails();

      const faviconURL = response?.data?.orgFavIconURL;
      return nextResponse.status(200).send({ providerOrgFaviconURL: faviconURL });
    } catch (error) {
      let defaultErrorMessage = "Something went wrong. Please retry";

      if (
        error.name === "ProviderAuthError" ||
        error?.response?.status === undefined
      ) {
        return nextResponse.status(500).send({
          message: defaultErrorMessage,
        });
      } else {
        return nextResponse.status(error.response?.status || 500).send({
          message: error.response?.data?.message || defaultErrorMessage,
        });
      }
    }
  } else {
    return nextResponse.status(404).json({
      message: "Endpoint not found",
    });
  }
}
