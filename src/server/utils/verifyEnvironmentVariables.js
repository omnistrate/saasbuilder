const { setProviderToken } = require("../providerToken");
const { fetchProviderAuthToken } = require("./fetchProviderAuthToken");
const nodemailer = require("nodemailer");

//Checks if all environment variables are configured
//Verifies provider auth credentials by attempting a signin
//Verfied mail credentials by attempting a signin
//Returns true if all environment variables are configured and valid. Else returns false

async function verifyEnvrionmentVariables() {
  let areProviderCredentialsVerified = false;
  let areMailCredentialsVerified = false;

  const requiredEnvironmentVariables = [
    "PROVIDER_EMAIL",
    "PROVIDER_HASHED_PASS",
    "YOUR_SAAS_DOMAIN_URL",
    "MAIL_USER_EMAIL",
    "MAIL_USER_PASSWORD",
  ];

  const undefinedEnvironmentVariables = requiredEnvironmentVariables.filter(
    (envVariableName) => process.env[envVariableName] === undefined
  );

  if (undefinedEnvironmentVariables.length === 0) {
    console.log("All environment variables are available");
    //verify provider credentials and email credentials are valid
    try {
      const authTokenResponse = await fetchProviderAuthToken();
      const token = authTokenResponse.data.jwtToken;
      setProviderToken(token);
      areProviderCredentialsVerified = true;
      console.log("Provider credentials verification success");
    } catch (error) {
      console.log("Provider credentials verification failure");
    }

    //verify mail credentials
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
      console.log("Mail credentials verification success");
    } catch (error) {
      console.log("Mail credentials verification failure");
    }
  } else {
    console.log(
      "Undefined environment variables",
      undefinedEnvironmentVariables
    );
  }

  if (areProviderCredentialsVerified && areMailCredentialsVerified) return true;
  else return false;
}

module.exports = verifyEnvrionmentVariables;
