const fs = require('fs');
const path = require('path');

function extractCoverageData(scriptContent) {
  const reg0 = /var\s+coverageData\s*=\s*({[\s\S]*?});/;
  const reg1 = /var\s+(\w+)\s*=\s*function\s*\(\)\s*\{([\s\S]*?)\}\(\);/

  // 可能性一
  const match0 = reg0.exec(scriptContent);
  if (match0) {
    const objectString = match0[1];
    return new Function('return ' + objectString)();
  }

  // 可能性二
  const match1 = reg1.exec(scriptContent);
  if (match1) {
    const functionBody = match1[2];
    const func = new Function(functionBody + 'return coverageData;');
    const result = func();
    return result;
  }



  return null
}


module.exports  = {
  generateInitialCoverage:(paramsPath) => {
    const initialCoverageDataForTheCurrentFile = extractCoverageData(paramsPath)
    const filePath = './.canyon_output/coverage-final.json';
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true});
    }
    if (initialCoverageDataForTheCurrentFile) {
      fs.writeFileSync(`./.canyon_output/coverage-${Math.random()}.json`, JSON.stringify({
        [initialCoverageDataForTheCurrentFile.path]: initialCoverageDataForTheCurrentFile
      }, null, 2), 'utf-8');
    }
    return initialCoverageDataForTheCurrentFile;
  }
}
