const express = require("express");
const cors = require("cors");
const s3 = require("./src/helpers/s3");
const readAndUpload = require("./src/services/readAndUpload");
const saveAndConvert = require("./src/services/saveAndConvert");

const port = require("config").get("port");

const listener = s3.listenBucketNotification(
  "4327yfobqzzatgdnrr6ppf5ms8klcspl",
  "",
  ".pdf",
  ["s3:ObjectCreated:*"]
);

listener.on("notification", async record => {
  console.log(record.s3.object.key);
  await saveAndConvert(record.s3.object.key);
  readAndUpload();
  listener.stop();
});

const service = express()
  .use("/meta/health", (req, res) => res.sendStatus(200))
  .use(cors())
  .use(express.json())
  .listen(port, () => {
    console.log(`Listening on :${port}`);
  });

module.exports = { service };
