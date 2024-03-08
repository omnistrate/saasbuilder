const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { startMailServiceCron } = require("./src/server/mail-service/mail-cron");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = dev ? 3000 : 8080;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();


app.prepare().then(() => {

  //start the mail service cron job only if 
  //a)NODE_INDEX environment variable is not present
  //b)NODE_INDEX environment variable === 0
  if(process.env.NODE_INDEX === undefined || process.env.NODE_INDEX === 0 || process.env.NODE_INDEX === '0'){
    startMailServiceCron();
  }
 
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
