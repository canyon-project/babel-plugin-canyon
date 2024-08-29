module.exports = function (api) {
  api.cache(true);
  const presets = [];
  const plugins = [
    'istanbul',
    ['./lib',
      {
        dsn: 'http://xxx.xxx/api/v1/coverage/client',
        reporter: "reporter",
      }]];
  process.env.NODE_ENV === 'production' && plugins.push('transform-remove-console');
  return {
    presets,
    plugins
  };
}
