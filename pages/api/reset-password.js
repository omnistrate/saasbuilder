import { customerUserResetPassword } from "src/server/api/customer-user";

export default async function handleResetPassword(nextRequest, nextResponse) {
  if (nextRequest.method === "POST") {
    try {
      const xForwardedForHeader = nextRequest.get("X-Forwarded-For") || "";
      //xForwardedForHeader has multiple IPs in the format <client>, <proxy1>, <proxy2>
      //get the first IP (client IP)
      const clientIP = xForwardedForHeader.split(",").shift().trim();
      const saasBuilderIP = process.env.POD_IP;

      await customerUserResetPassword(nextRequest.body, {
        'Client-IP': clientIP,
        'SaasBuilder-IP': saasBuilderIP,
      });

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
          nextResponse.status(200).send();
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
