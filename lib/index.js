const { template } = require('@babel/core');
let off = true
const canyonTemplate = template(`
        window.__canyon__ = {
        projectId: 'PROJECT_ID',
        dsn: 'DSN',
        processCwd: 'PROCESS_CWD',
        reporter: 'REPORTER'
        }
`);
const consoleLogCanyonTemplate = template(`window.reportCoverage = function () {fetch(window.__canyon__.dsn,{method:'POST', headers:{'content-type': 'application/json', 'token': window.__canyon__.reporter}, body:JSON.stringify({"canyon": window.__canyon__, "coverage": window.__coverage__})}).then(res=>{console.log(res)})}`);

module.exports = function({ types: babelTypes }, config) {
    return {
        name: "babel-plugin-canyon",
        visitor: {
            Program:{
                exit(path) {
                    if (off){
                        const canyon = canyonTemplate({
                            PROJECT_ID: String(config.projectId),
                            DSN: config.dsn,
                            REPORTER: config.reporter,
                            PROCESS_CWD: process.cwd()
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
