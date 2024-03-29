const fs = require('fs')
const path = require('path');

function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath, {withFileTypes: true}).forEach(function (dirent) {
    const filePath = path.join(currentDirPath, dirent.name);
    if (dirent.isFile()) {
      callback(filePath, dirent);
    } else if (dirent.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}

let tmp = {}
walkSync('templates', function (filePath, stat) {
  const rs = fs.readFileSync(filePath, "utf8");
  const gl = fs.readFileSync('./window.js', "utf8");
  // tmp = Object.assign(tmp,rs)
  tmp[filePath] = rs.replaceAll('window', gl)
});

fs.writeFileSync('lib/template.js', `module.exports = ${JSON.stringify(tmp, null, 2)}`, "utf8")

