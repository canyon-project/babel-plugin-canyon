const { template } = require('@babel/core');
let off = true
const canyonTemplate = template(`
        window.__canyon__ = {
        repoId: 'PROJECT_ID',
        codeHouseId: 'CODE_HOUSE_ID',
        dsn: 'DSN',
        instrumentCwd: 'INSTRUMENT_CWD',
        reporter: 'REPORTER',
        commitSha: 'COMMIT_SHA'
        }
`);
const consoleLogCanyonTemplate = template(`window.reportCoverage = function () {
    const {
        repoId,
        instrumentCwd,
        codeHouseId,
        commitSha,
        dsn,
        reporter
    } = window.__canyon__
    fetch(dsn, {
        method: 'POST',
        headers: {'content-type': 'application/json', 'Authentication': 'Bearer ' + reporter},
        body: JSON.stringify({
            "coverage": window.__coverage__,
            repoId,
            instrumentCwd,
            codeHouseId,
            commitSha
        })
    }).then(res => {
        console.log(res)
    })
}
`);

module.exports = function({ types: babelTypes }, config) {
    return {
        name: "babel-plugin-canyon",
        visitor: {
            Program:{
                exit(path) {
                    if (off){
                        const canyon = canyonTemplate({
                            PROJECT_ID: String(config.repoId),
                            CODE_HOUSE_ID: String(config.codeHouseId),
                            DSN: config.dsn,
                            REPORTER: config.reporter,
                            INSTRUMENT_CWD: process.cwd(),
                            COMMIT_SHA: config.commitSha
                        });
                        const consoleLogCanyon = consoleLogCanyonTemplate({
                            JSON:'JSON',
                            POST:'POST'
                        });
                        path.node.body.unshift(canyon)
                        path.node.body.unshift(consoleLogCanyon)
                        off = false
                    }
                }
            }
        }
    };
};
