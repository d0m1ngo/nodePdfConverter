const fs = require("fs");

const fileSize = path => {
  return new Promise((res, rej) => {
    fs.stat(path, function(err, stats) {
      if (err) rej();
      res(stats.size);
    });
  });
};

module.exports = fileSize;
