const fs = require("fs");

const deleteFile = name => {
  return new Promise((res, rej) => {
    fs.unlink(name, err => {
      if (err) {
        rej();
        throw err;
      }
      res();
    });
  });
};

module.exports = deleteFile;
