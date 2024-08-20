# babel-plugin-canyon

A Babel plugin that instruments your code with Istanbul coverage. It can instantly be used with karma-coverage and mocha on Node.js (through nyc).

__Note:__ To use this plugin, it is recommended to use a branch to determine whether it is in effect or not, as he is not available for production environments.

## Usage

Install it:

```sh
npm install --save-dev babel-plugin-istanbul
```

Add it to `babel.config.js` in test mode:

```js
module.exports = {
  plugins:
    process.env.CI_COMMIT_REF_NAME === 'test-coverage'? ['istanbul', 'canyon']:[]
}
```

## Configuration

babel.config.js

```js
module.exports = {
  plugins:[
    'istanbul',
    [
      'canyon',
      {
        dsn: 'http://yourdomain.com/coverage/client',
        reporter: 'your_token',
        projectID: '230614',
        sha: 'xxxxxxxxx',
        reportID: 'case_id',
        branch: 'master',
        compareTarget: 'develop',
      }
    ]
  ]
}
```

| Prop      | Description              | Usage                                     |
|-----------|--------------------------|-------------------------------------------------|
| dsn       | 上报的端点，建议直接通过流水线变量配置      | Required               |
| reporter  | 上报人，建议直接通过流水线变量配置        | Required               |
| projectID | 仓库ID，会侦测流水线的变量，通常不需要配置   | Required |
| sha       | sha，会侦测流水线的变量，通常不需要配置    | Required |
| instrumentCwd     | babel插桩路径，通常不需要配置        | Required               |
| reportID    | reportID，会侦测流水线的变量，通常不需要配置 | Optional          |
| branch    | branch，会侦测流水线的变量，通常不需要配置 | Optional          |
| compareTarget    | branch，会侦测流水线的变量，通常不需要配置 | Optional          |

