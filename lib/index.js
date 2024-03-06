const {template} = require('@babel/core');
const tep = require('./template');
const canyonTemplate = template(tep["templates/canyon.template.js"]);
const writeCanyonToLocalTemplate = template(tep["templates/write-canyon-to-local-template.js"])

function convertConfig(config) {
  let defaultCiField = {
    projectID: 'CI_PROJECT_ID',
    commitSha: 'CI_COMMIT_SHA',
    reporter: 'REPORTER',
    dsn: 'DSN',
    branch: 'CI_COMMIT_BRANCH'
  }
  let data = {}
  for (const ciFieldKey in defaultCiField) {
    data[ciFieldKey] = config[ciFieldKey] || process.env[defaultCiField[ciFieldKey]]
  }
  return {
    ...config,
    ...data
  }
}

module.exports = function ({types: babelTypes}, config) {
  return {
    name: "babel-plugin-canyon",
    visitor: {
      Program: {
        exit(path) {
          config = convertConfig(config)
          console.log(`${'babel-plugin-canyon'}> ${(`instrumented data: ${JSON.stringify(config)}`)}`);
          const canyon = canyonTemplate({
            PROJECT_ID: String(config.projectID) || '-',
            DSN: config.dsn || '-',
            REPORTER: config.reporter || '-',
            INSTRUMENT_CWD: config.instrumentCwd || process.cwd(),
            COMMIT_SHA: config.commitSha || '-',
            BRANCH: config.branch || '-',
            REPORT_ID: config.reportID || '-',
            COMPARE_TARGET: config.compareTarget || '-',
            ENV: JSON.stringify(process.env||{})
          });
          const writeCanyonToLocal = writeCanyonToLocalTemplate({
            JSON: 'JSON'
          })
          path.node.body.unshift(canyon)
          path.node.body.unshift(writeCanyonToLocal)
        }
      }
    }
  };
};
