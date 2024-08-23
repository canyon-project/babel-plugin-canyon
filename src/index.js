// import path from 'path'
// import { realpathSync } from 'fs'
// import { execFileSync } from 'child_process'
import { declare } from '@babel/helper-plugin-utils'
import {template} from "@babel/core";
const canyonTemplate = template(`
const a=1;
`);
export default declare(api => {
  api.assertVersion(7)

  const t = api.types
  // console.log(t)
  return {
    visitor: {
      Program: {
        exit(path) {
          const canyon = canyonTemplate();
          path.node.body.unshift(canyon)
        }
      }
    }
  }
})
