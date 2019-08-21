const mongoose = require("mongoose");
const dbCollectionName = require("config").get("dbCollectionName");

const Schema = mongoose.Schema;

const pdfSchema = new Schema(
  {
    _id: {
      type: String
    },
    fileName: {
      type: String
    },
    fileSize: {
      type: String
    },
    numberOfPages: {
      type: Number
    },
    processStatus: {
      type: String
    },
    pics: {
      type: Array,
      of: String
    }
  },
  {
    timestamps: {
      created_at: "created_at"
    }
  }
);

const pdfModel = mongoose.model("pdfModel", pdfSchema, dbCollectionName);

module.exports = pdfModel;
