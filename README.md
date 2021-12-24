# babel-plugin-canyon


配合babel-plugin-istanbul使用，
进行上传代码覆盖率必要参数配置，
构建后会在window上添加__canyon__对象和reportCoverage方法。

```js
let babelConfig = {
  plugins: [
    "istanbul",
    [
      'canyon',
      {
        dsn: 'http://xxx/coverage/client', //必填 覆盖率上报地址
        reporter: '覆盖率平台的token', //必填 识别上报人
        repoId: '仓库ID', //可选 不填会自动读取环境变量
        commitSha: 'commitSha', //可选 不填会自动读取环境变量
        codeHouseId: '源ID', //可选 默认 1
      }
    ]
  ]
}
```

配置优先级: reportCoverage() > 环境变量 > 项目内配置
