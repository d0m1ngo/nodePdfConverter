const express = require("express");
const s3 = require("../helpers/s3");
const PDFImage = require("pdf-image").PDFImage;
const path = require("path");
const fileName = name => path.join(__dirname, `../tmp/${name}.pdf`);

module.exports = () => {
  const postOffer = async (req, res) => {
    // // const stream = s3.listObjects("00test", "", true);
    // stream.on("data", function(obj) {
    //   console.log(obj);
    // });
    // s3.fGetObject("00test", "pdf.pdf", fileName('pdf'), function(err) {
    //   if (err) {
    //     return console.log(err);
    //   }

    //   console.log("success");

    // });

    var pdfImage = new PDFImage(path.join(__dirname, `../tmp/pdf.pdf`));
    console.log(pdfImage);
    pdfImage.convertPage(1).then(
      function(imagePath) {
        res.sendFile(imagePath);
      },
      function(err) {
        res.send(err, 500);
      }
    );
  };

  return express.Router().get("/", postOffer);
};
