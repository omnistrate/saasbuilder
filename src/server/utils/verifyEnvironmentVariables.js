const { setProviderToken } = require("../providerToken");
const { fetchProviderAuthToken } = require("./fetchProviderAuthToken");
const nodemailer = require("nodemailer");

//Checks if all environment variables are configured
//Verifies provider auth credentials by attempting a signin
//Verfied mail credentials by attempting a signin
//Returns an array of objects where each object contains 1) env variable name 2) env variable status

const environmentVariableStatuses = {
  NotDefined: "Not Defined",
  Unverified: "Unverified",
  Verified: "Verified",
  Invalid: "Invalid",
};

async function verifyEnvrionmentVariables() {
  let areProviderCredentialsVerified = false;
  let areMailCredentialsVerified = false;

  const envVariablesStatus = {
    PROVIDER_EMAIL: environmentVariableStatuses.NotDefined,
    PROVIDER_HASHED_PASS: environmentVariableStatuses.NotDefined,
    YOUR_SAAS_DOMAIN_URL: environmentVariableStatuses.NotDefined,
    MAIL_USER_EMAIL: environmentVariableStatuses.NotDefined,
    MAIL_USER_PASSWORD: environmentVariableStatuses.NotDefined,
  };

  const requiredEnvironmentVariables = Object.keys(envVariablesStatus);

  const undefinedEnvironmentVariables = requiredEnvironmentVariables.filter(
    (envVariableName) => {
      if (process.env[envVariableName] === undefined) {
        return true;
      } else {
        envVariablesStatus[envVariableName] =
          environmentVariableStatuses.Unverified;
        return false;
      }
    }
  );

  if (undefinedEnvironmentVariables.length === 0) {
    console.log("All environment variables are available");
  } else {
    console.log(
      "Undefined environment variables",
      undefinedEnvironmentVariables
    );
  }

  const providerEmail = process.env.PROVIDER_EMAIL;
  const providerHashedPassword = process.env.PROVIDER_HASHED_PASS;
  const saasURL = process.env.YOUR_SAAS_DOMAIN_URL;
  const mailUserEmail = process.env.MAIL_USER_EMAIL;
  const mailUserPassword = process.env.MAIL_USER_PASSWORD;

  if (providerEmail && providerHashedPassword) {
    try {
      const authTokenResponse = await fetchProviderAuthToken();
      const token = authTokenResponse.data.jwtToken;
      setProviderToken(token);
      areProviderCredentialsVerified = true;

      envVariablesStatus["PROVIDER_EMAIL"] =
        environmentVariableStatuses.Verified;
      envVariablesStatus["PROVIDER_HASHED_PASS"] =
        environmentVariableStatuses.Verified;

      console.log("Provider credentials verification success");
    } catch (error) {
      envVariablesStatus["PROVIDER_EMAIL"] =
        environmentVariableStatuses.Invalid;
      envVariablesStatus["PROVIDER_HASHED_PASS"] =
        environmentVariableStatuses.Invalid;

      console.log("Provider credentials verification failure");
    }
  }

  if (mailUserEmail && mailUserPassword) {
    try {
      const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER_EMAIL,
          pass: process.env.MAIL_USER_PASSWORD,
        },
      });
      await mailTransporter.verify();
      areMailCredentialsVerified = true;
      mailTransporter.close();
      envVariablesStatus["MAIL_USER_EMAIL"] =
        environmentVariableStatuses.Verified;
      envVariablesStatus["MAIL_USER_PASSWORD"] =
        environmentVariableStatuses.Verified;

      console.log("Mail credentials verification success");
    } catch (error) {
      envVariablesStatus["MAIL_USER_EMAIL"] =
        environmentVariableStatuses.Invalid;
      envVariablesStatus["MAIL_USER_PASSWORD"] =
        environmentVariableStatuses.Invalid;

      console.log("Mail credentials verification failure");
    }
  }

  envVariablesStatus["YOUR_SAAS_DOMAIN_URL"] =
    environmentVariableStatuses.Verified;

  return {
    isVerified: areMailCredentialsVerified && areProviderCredentialsVerified,
    envVariablesStatus: Object.entries(envVariablesStatus).map(
      ([envVarName, envVarStatus]) => ({
        name: envVarName,
        status: envVarStatus,
      })
    ),
  };
}

module.exports = verifyEnvrionmentVariables;
