const path = require("path");
const dotenv = require("dotenv");
dotenv.config({
  path: path.resolve(process.cwd(), process.env.NODE_ENV === "production" ? ".env.production" : ".env.local"),
});
const { startMailServiceCron } = require("./src/server/mail-service/mail-cron");
const verifyEnvironmentVariables = require("./src/server/utils/verifyEnvironmentVariables");

(async () => {

  const { isVerified, envVariablesStatus } = await verifyEnvironmentVariables();

  console.log("Environment variables status", envVariablesStatus);
  if (isVerified) {
    startMailServiceCron();
  } else {
    console.error("Mail service cron not started");
  }

})();