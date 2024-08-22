import { customerUserResetPassword } from "src/server/api/customer-user";
import { verifyRecaptchaToken } from "src/server/utils/verifyRecaptchaToken";
import CaptchaVerificationError from "src/server/errors/CaptchaVerificationError";

export default async function handleResetPassword(nextRequest, nextResponse) {
  if (nextRequest.method === "POST") {
    try {
      //xForwardedForHeader has multiple IPs in the format <client>, <proxy1>, <proxy2>
      //get the first IP (client IP)
      const xForwardedForHeader = nextRequest.get("X-Forwarded-For") || "";
      const clientIP = xForwardedForHeader.split(",").shift().trim();
      const saasBuilderIP = process.env.POD_IP || "";

      const requestBody = nextRequest.body || {};

      if (
        process.env.GOOGLE_RECAPTCHA_SECRET_KEY &&
        process.env.GOOGLE_RECAPTCHA_SITE_KEY
      ) {
        const { reCaptchaToken } = requestBody;
        const isVerified = await verifyRecaptchaToken(reCaptchaToken);
        if (!isVerified) throw new CaptchaVerificationError();
      }

      await customerUserResetPassword(requestBody, {
        "Client-IP": clientIP,
        "SaaSBuilder-IP": saasBuilderIP,
      });
      nextResponse.status(200).send();
    } catch (error) {
      const defaultErrorMessage = "Something went wrong. Please retry";

      if (
        error.name === "ProviderAuthError" ||
        error?.response?.status === undefined
      ) {
        nextResponse.status(500).send({
          message: defaultErrorMessage,
        });
      } else {
        const responseErrorMessage = error.response?.data?.message;

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
