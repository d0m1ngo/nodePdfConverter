const s3 = require("../helpers/s3");
const path = require("path");
const folderName = path.join(__dirname, `../images`);
const readFiles = require("../helpers/readFolder");
const uploadBucket = require("config").get("uploadBucket");

const readAndUpload = () => {
  readFiles(folderName, (filePath, fileName) => {
    const metaData = {
      "Content-Type": "image/png"
    };

    s3.fPutObject(uploadBucket, fileName, filePath, metaData);
  });
};

module.exports = readAndUpload;
