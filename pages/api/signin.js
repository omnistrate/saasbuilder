import _ from "lodash";

const { customerUserSignIn } = require("src/server/api/customer-user");
const { getEnvironmentType } = require("src/server/utils/getEnvironmentType");

export default async function handleSignIn(nextRequest, nextResponse) {

  if (nextRequest.method === "POST") {
    try {
      const environmentType = getEnvironmentType();
      const payload = {
        ...nextRequest.body,
        environmentType: environmentType,
      };
      //xForwardedForHeader has multiple IPs in the format <client>, <proxy1>, <proxy2>
      //get the first IP (client IP)
      const xForwardedForHeader = nextRequest.get("X-Forwarded-For") || "";
      const clientIP = xForwardedForHeader.split(",").shift().trim();
      const saasBuilderIP = process.env.POD_IP || "";

      const response = await customerUserSignIn(payload, {
        "Client-IP": clientIP,
        "SaaSBuilder-IP": saasBuilderIP,
      });
      const delayInMilliseconds = _.random(0, 60);

      //Wait for a random duration b/w 0ms and 60ms to mask the difference b/w response times of api when a user is present vs not present
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, delayInMilliseconds);
      });
      nextResponse.status(200).send({ ...response?.data });
    } catch (error) {
      let defaultErrorMessage =
        "Failed to sign in. Either the credentials are incorrect or the user does not exist";

      //Wait for a random duration b/w 0ms and 60ms to mask the difference b/w response times of api when a user is present vs not present
      const delayInMilliseconds = _.random(0, 60);
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, delayInMilliseconds);
      });

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
