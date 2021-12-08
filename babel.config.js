module.exports = function (api) {
    api.cache(true);
    const presets = [];
    const plugins = [['./lib', {projectId: 99999, dsn: 'http://xxx.xxx/api/v1/coverage/client',commitSha:'xxxxx'}]];
    return {
        presets,
        plugins
    };
}
