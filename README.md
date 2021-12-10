# babel-plugin-canyon


配合babel-plugin-istanbul使用，会在window上挂在一个__canyon__对象，该插件会自动读取.git文件配置，获取当前构建时的commitSha，在babel.config.js还可进行上传代码覆盖率必要参数配置。
