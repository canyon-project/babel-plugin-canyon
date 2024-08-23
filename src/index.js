// import path from 'path'
// import { realpathSync } from 'fs'
// import { execFileSync } from 'child_process'
import { declare } from '@babel/helper-plugin-utils'
import {template} from "@babel/core";
import tep from './template'
const canyonTemplate = template(tep["templates/canyon.template.js"]);
const writeCanyonToLocalTemplate = template(tep["templates/write-canyon-to-local-template.js"])

export default declare(api => {
  api.assertVersion(7)

  const t = api.types
  // console.log(t)
  return {
    visitor: {
      Program: {
        exit(path) {
          const canyon = canyonTemplate({
            PROJECT_ID: 'PROJECT_ID',
            BUILD_ID: 'BUILD_ID',
            DSN: 'DSN',
            INSTRUMENT_CWD: 'INSTRUMENT_CWD',
            REPORTER: 'REPORTER',
            COMMIT_SHA: 'COMMIT_SHA',
            REPORT_ID: 'REPORT_ID',
            COMPARE_TARGET: 'COMPARE_TARGET',
            BRANCH: 'BRANCH',
            ENV: 'ENV'
          });
          path.node.body.unshift(canyon)
        }
      }
    }
  }
})
