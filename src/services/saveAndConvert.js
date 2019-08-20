const fs = require("fs");
const s3 = require("../helpers/s3");
const path = require("path");
const fileDest = name => path.join(__dirname, `../tmp/${name}`);
const folderName = path.join(__dirname, `../images`);
const PDF2Pic = require("pdf2pic");
const downloadBucket = require("config").get("downloadBucket");
const pdf = require("pdf-parse");

const saveAndConvert = file => {
  return new Promise(async (res, rej) => {
    const fileName = fileDest(file);

    await s3.fGetObject(downloadBucket, file, fileName);

    const dataBuffer = fs.readFileSync(fileName);

    pdf(dataBuffer).then(function(data) {
      console.log(data.numpages);
    });

    const pdf2pic = new PDF2Pic({
      density: 100,
      savename: file,
      savedir: folderName,
      format: "png",
      size: "600x600"
    });

    pdf2pic.convertBulk(fileName, -1).then(resolve => {
      res();
      return resolve;
    });
  });
};

module.exports = saveAndConvert;
