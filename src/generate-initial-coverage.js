// import generate from '@babel/generator';
import fs from 'fs';
import path from 'path'
import {extractCoverageData} from "./helpers/extractCoverageData";


export const generateInitialCoverage = (paramsPath) => {
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
