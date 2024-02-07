# babel-plugin-canyon

配合babel-plugin-istanbul使用，
进行上传代码覆盖率必要参数配置，
构建后会在window上添加__canyon__对象

```js
let babelConfig = {
  plugins: [
    "istanbul",
    "canyon"
  ]
}
```
