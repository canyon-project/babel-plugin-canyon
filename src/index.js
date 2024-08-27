import { declare } from '@babel/helper-plugin-utils'
import {template} from "@babel/core";
import tep from './template'
import {generateInitialCoverage} from "./generate-initial-coverage";
const canyonTemplate = template(tep["templates/canyon.template.js"]);
const writeCanyonToLocalTemplate = template(tep["templates/write-canyon-to-local-template.js"])
import fs from 'fs'
let off = false

function convertConfig(config) {
  let defaultCiField = {
    projectID: 'CI_PROJECT_ID',
    buildID: 'CI_JOB_ID',
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

export default declare((api,config) => {
  api.assertVersion(7)

  const t = api.types


  return {
    visitor: {
      Program: {
        exit(path) {

          config = convertConfig(config)
          const __canyon__ = {
            PROJECT_ID: String(config.projectID) || '-',
            BUILD_ID: String(config.buildID) || '-',
            DSN: config.dsn || '-',
            REPORTER: config.reporter || '-',
            INSTRUMENT_CWD: config.instrumentCwd || process.cwd(),
            COMMIT_SHA: config.commitSha || '-',
            BRANCH: config.branch || '-',
            REPORT_ID: config.reportID || '-',
            COMPARE_TARGET: config.compareTarget || '-'
          }

          if (!off){
            // 如果.canyon_output不存在就创建
            const dir = './.canyon_output'
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, {recursive: true});
            }
            fs.writeFileSync('./.canyon_output/canyon.json', JSON.stringify({
                  "projectID": __canyon__.PROJECT_ID,
                  "buildID": __canyon__.BUILD_ID,
                  "dsn": __canyon__.DSN,
                  "reporter": __canyon__.REPORTER,
                  "sha": __canyon__.COMMIT_SHA,
                  "branch": __canyon__.BRANCH,
                  "compareTarget": __canyon__.COMPARE_TARGET,
                  "instrumentCwd": __canyon__.INSTRUMENT_CWD
                }
                ,null,2), 'utf-8')
            off = true
          }
          // 关键，会执行多次
          generateInitialCoverage(path)
          const canyon = canyonTemplate(__canyon__);
          path.node.body.unshift(canyon)
          path.node.body.unshift(writeCanyonToLocalTemplate({
            JSON: 'JSON'
          }))
        }
      }
    }
  }
})
