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
    process.env.BRANCHNAME === 'test-coverage'? ['istanbul', 'canyon']:[]
}
```
