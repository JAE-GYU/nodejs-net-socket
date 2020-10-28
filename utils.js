const fs = require('fs');

module.exports = {
  getFilesizeInBytes(filename) {
    const stats = fs.statSync(filename);
    const fileSizeInBytes = stats.size;
    return fileSizeInBytes;
  },
  remove_linebreaks(str) {
    return str.replace(/[\r\n]+/gm, "");
  }
}