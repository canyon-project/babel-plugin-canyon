import { declare } from '@babel/helper-plugin-utils'
import {template} from "@babel/core";
import tep from './template'
import generate from '@babel/generator';
import {generateInitialCoverage} from "./generate-initial-coverage";
const canyonTemplate = template(tep["templates/canyon.template.js"]);
const writeCanyonToLocalTemplate = template(tep["templates/write-canyon-to-local-template.js"])


// 转换配置，优先级：babel配置 > 环境变量
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
  return {
    visitor: {
      Program: {
        exit(path) {
          // 生成初始覆盖率数据
          generateInitialCoverage(generate(path.node).code)

          // 转换配置
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



          // 生成canyon代码
          const canyon = canyonTemplate(__canyon__);
          // TODO: 需要删除writeCanyonToLocal
          const writeCanyonToLocal = writeCanyonToLocalTemplate({
            JSON: 'JSON'
          })
          path.node.body.unshift(canyon)
          // TODO: 需要删除writeCanyonToLocal
          path.node.body.unshift(writeCanyonToLocal)

        }
      }
    }
  }
})
