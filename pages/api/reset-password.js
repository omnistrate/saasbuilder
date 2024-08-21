import { customerUserResetPassword } from "src/server/api/customer-user";
import { verifyRecaptchaToken } from "src/server/utils/verifyRecaptchaToken";
import CaptchaVerificationError from "src/server/errors/CaptchaVerificationError";
import { checkReCaptchaSetup } from "src/server/utils/checkReCaptchaSetup";

export default async function handleResetPassword(nextRequest, nextResponse) {
  if (nextRequest.method === "POST") {
    try {
      const requestBody = nextRequest.body || {};
      const isReCaptchaSetup = checkReCaptchaSetup();

      if (isReCaptchaSetup) {
        const { reCaptchaToken } = requestBody;
        const isVerified = await verifyRecaptchaToken(reCaptchaToken);
        if (!isVerified) throw new CaptchaVerificationError();
      }

      await customerUserResetPassword(requestBody);
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
