module.exports = function (api) {
    api.cache(true);
    const presets = [];
    const plugins = [
        ['./lib',
            {
                repoId: 123,
                dsn: 'http://xxx.xxx/api/v1/coverage/client',
                reporter:"reporter",
                commitSha:"commitSha"
            }]];
    return {
        presets,
        plugins
    };
}
