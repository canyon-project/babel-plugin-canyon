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
const reportCoverageTemplate = template(`window.reportCoverage = function (config={}) {
    let {
        repoId,
        instrumentCwd,
        codeHouseId,
        commitSha,
        dsn,
        reporter
    } = window.__canyon__
    if(config.repoId){repoId = config.repoId}
    if(config.codeHouseId){codeHouseId = config.codeHouseId}
    if(config.commitSha){commitSha = config.commitSha}
    if(config.dsn){dsn = config.dsn}
    if(config.reporter){reporter = config.reporter}
    fetch(dsn, {
        method: 'POST',
        headers: {'content-type': 'application/json', 'Authorization': 'Bearer ' + reporter},
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

function convertConfig(config) {
    let defaultCiField = {
        repoId: 'CI_PROJECT_ID',
        commitSha: 'CI_COMMIT_SHA'
    }
    let data = {}
    for (const ciFieldKey in defaultCiField) {
         data[ciFieldKey]  = process.env[defaultCiField[ciFieldKey]] || config[ciFieldKey]
    }
    return {
        ...config,
        ...data
    }
}

module.exports = function({ types: babelTypes }, config) {
    return {
        name: "babel-plugin-canyon",
        visitor: {
            Program:{
                exit(path) {
                    if (off){
                        // 不能是空字符串！！！
                        config = convertConfig(config)
                        const canyon = canyonTemplate({
                            PROJECT_ID: String(config.repoId),
                            CODE_HOUSE_ID: String(config.codeHouseId || 1),
                            DSN: config.dsn,
                            REPORTER: config.reporter,
                            INSTRUMENT_CWD: process.cwd(),
                            COMMIT_SHA: config.commitSha
                        });
                        const reportCoverage = reportCoverageTemplate({
                            JSON:'JSON',
                            POST:'POST'
                        });
                        path.node.body.unshift(canyon)
                        path.node.body.unshift(reportCoverage)
                        // 将开关关闭
                        off = false
                    }
                }
            }
        }
    };
};
