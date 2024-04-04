const dotenv = require("dotenv");
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env.local",
});
const { startMailServiceCron } = require("./src/server/mail-service/mail-cron");
const verifyEnvironmentVariables = require("./src/server/utils/verifyEnvironmentVariables");

(async () => {

  const { areMailCredentialsVerified, envVariablesStatus } = await verifyEnvironmentVariables();
  
  console.log("Environment variables status", envVariablesStatus);
  if (areMailCredentialsVerified) {
    startMailServiceCron();
  }

})();