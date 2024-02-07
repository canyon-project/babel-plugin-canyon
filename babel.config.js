module.exports = function (api) {
  api.cache(true);
  const presets = [];
  const plugins = [
    ['./lib',
      {
        dsn: 'http://xxx.xxx/api/v1/coverage/client',
        reporter: "reporter",
      }]];
  return {
    presets,
    plugins
  };
}
