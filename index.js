const express = require("express");
const cors = require("cors");
const s3 = require("./src/helpers/s3");
const mongoose = require("mongoose");
const port = require("config").get("port");
const dbPort = require("config").get("dbPort");
const dbHost = require("config").get("dbHost");
const dbName = require("config").get("dbName");

const readAndUpload = require("./src/services/readAndUpload");
const saveAndConvert = require("./src/services/saveAndConvert");
const downloadBucket = require("config").get("downloadBucket");
const path = require("path");
const deleteFile = require("./src/helpers/deleteFile");
const listener = s3.listenBucketNotification(downloadBucket, "", ".pdf", ["s3:ObjectCreated:*"]);
const pdfModel = require("./src/models/pdfModel");
const fileDest = name => path.join(__dirname, `./src/tmp/${name}`);

listener.on("notification", async record => {
  const id = await saveAndConvert(record.s3.object.key);
  readAndUpload();
  await pdfModel.updateOne({ _id: id }, { processStatus: "finished" });
  await deleteFile(fileDest(record.s3.object.key));
  listener.stop();
});

const service = () => {
  mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, { useNewUrlParser: true }, err => {
    if (err) return console.log(err);
    express()
      .use("/meta/health", (req, res) => res.sendStatus(200))
      .use(cors())
      .use(express.json())
      .listen(port, () => {
        console.log(`Listening on :${port}`);
      });
  });
};

module.exports = service();
