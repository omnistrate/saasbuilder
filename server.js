const next = require("next");
const express = require("express");
const path = require("path");
const verifyEnvironmentVariables = require("./src/server/utils/verifyEnvironmentVariables");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = dev ? 3000 : 8080;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
const expressApp = express();

app.prepare().then(async () => {
  //check if all required environment variables are available
  const { areProviderCredentialsVerified, envVariablesStatus } = await verifyEnvironmentVariables();
  console.log("Environment variables status", envVariablesStatus);

  expressApp.set("view engine", "ejs");
  expressApp.set("views", path.join(__dirname, "src/server/views"));
  expressApp.use(express.static(path.join(__dirname)));
  expressApp.use(async (request, response) => {
    try {
      if (!areProviderCredentialsVerified && process.env.NODE_ENV === "development") {
        response.render("pages/setup-error", {
          envVariablesStatus,
        });
      }
      await handle(request, response);
    } catch (error) {
      response.render("pages/error");
    }
  });

  expressApp.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
