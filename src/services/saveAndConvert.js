const fs = require("fs");
const s3 = require("../helpers/s3");
const path = require("path");
const fileDest = name => path.join(__dirname, `../tmp/${name}`);
const folderName = path.join(__dirname, `../images`);
const PDF2Pic = require("pdf2pic");
const downloadBucket = require("config").get("downloadBucket");
const pdf = require("pdf-parse");
const pdfModel = require("../models/pdfModel");
const mongoose = require("mongoose");
const getfileSize = require("../helpers/fileSize");

const saveAndConvert = file => {
  return new Promise(async (res, rej) => {
    const id = mongoose.Types.ObjectId();

    const fileName = fileDest(file);

    await s3.fGetObject(downloadBucket, file, fileName);

    const dataBuffer = fs.readFileSync(fileName);

    const fileSize = await getfileSize(fileName);

    const pdfMetadata = await pdf(dataBuffer);

    await pdfModel.create({ _id: id, fileName: file, fileSize, numberOfPages: pdfMetadata.numpages, processStatus: "new" });

    const pdf2pic = new PDF2Pic({
      density: 100,
      savename: file,
      savedir: folderName,
      format: "png",
      size: "600x600"
    });

    await pdfModel.updateOne({ _id: id }, { processStatus: "in progress" });

    const pics = await pdf2pic.convertBulk(fileName, -1);

    await pdfModel.updateOne({ _id: id }, { pics });

    res(id);
  });
};

module.exports = saveAndConvert;
