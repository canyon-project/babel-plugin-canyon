import generate from '@babel/generator';
import fs from 'fs';
import path from 'path'
import libCoverage from 'istanbul-lib-coverage'


function extractCoverageData(scriptContent) {
    const regex = /var\s+coverageData\s*=\s*({[\s\S]*?});/;
    const match = regex.exec(scriptContent);
    if (match) {
        const objectString = match[1];
        try {
            return new Function('return ' + objectString)();
        } catch (e) {
            console.error('Failed to parse object:', e);
            return null;
        }
    } else {
        return null;
    }
}

export const generateInitialCoverage = (paramsPath) => {
    const initialCoverageDataForTheCurrentFile = extractCoverageData(generate(paramsPath.node).code)
    const filePath = './.canyon_output/coverage-final.json';
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }
    if (initialCoverageDataForTheCurrentFile) {
        const fadata = {
            [initialCoverageDataForTheCurrentFile.path]: initialCoverageDataForTheCurrentFile
        }
        if (fs.existsSync(filePath)) {
            const oldData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
            const map = libCoverage.createCoverageMap(oldData);
            map.merge(libCoverage.createCoverageMap(fadata));
            fs.writeFileSync(filePath, JSON.stringify(map.toJSON(), null, 2), 'utf-8')
        } else {
            fs.writeFileSync(filePath, JSON.stringify(fadata, null, 2), 'utf-8')
        }
    }
}