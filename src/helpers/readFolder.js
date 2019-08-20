const fs = require("fs");
const path = require("path");

const readFiles = (dir, processFile) => {
  fs.readdir(dir, (error, fileNames) => {
    if (error) throw error;

    fileNames.forEach(filename => {
      const name = path.parse(filename).name;
      const ext = path.parse(filename).ext;
      const filepath = path.resolve(dir, filename);

      fs.stat(filepath, function(error, stat) {
        if (error) throw error;
        const isFile = stat.isFile();

        if (isFile) {
          processFile(filepath, name, ext, stat);
        }
      });
    });
  });
};

module.exports = readFiles;
