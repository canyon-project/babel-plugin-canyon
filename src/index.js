// import path from 'path'
// import { realpathSync } from 'fs'
// import { execFileSync } from 'child_process'
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
            COMPARE_TARGET: config.compareTarget || '-',
            ENV: JSON.stringify(Object.keys(process.env||{}))
          }

          // 如果不存在canyon.json就创建
          if (!off){
            fs.writeFileSync('./.canyon_output/canyon.json', JSON.stringify(__canyon__,null,2), 'utf-8')
            off = true
          }
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
