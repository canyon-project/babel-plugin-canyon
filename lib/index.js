const { template } = require('@babel/core');
let off = true
const canyonTemplate = template(`
        window.__canyon__ = {
        commitSha: 'COMMIT_SHA',
        projectId: 'PROJECT_ID',
        dsn: 'DSN',
        processCwd: 'PROCESS_CWD'
        }
`);
const consoleLogCanyonTemplate = template(`
        console.log(window.__canyon__)
`);

module.exports = function({ types: babelTypes }, config) {
    return {
        name: "babel-plugin-canyon",
        visitor: {
            Program:{
                exit(path) {
                    if (off){
                        const canyon = canyonTemplate({
                            COMMIT_SHA:config.commitSha,
                            PROJECT_ID: String(config.projectId),
                            DSN: config.dsn,
                            PROCESS_CWD: process.cwd()
                        });
                        const consoleLogCanyon = consoleLogCanyonTemplate();
                        path.node.body.unshift(canyon)
                        path.node.body.unshift(consoleLogCanyon)
                        off = false
                    }
                }
            }
        }
    };
};
