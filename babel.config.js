module.exports = function (api) {
    api.cache(true);
    const presets = [];
    const plugins = [
        ['./lib',
            {
                codeHouseId: 99999,
                repoId: 123,
                dsn: 'http://xxx.xxx/api/v1/coverage/client',
                reporter:"reporter",
                commitSha:"32c448f6af718759faa3327a6a65b34f760a2844"
            }]];
    return {
        presets,
        plugins
    };
}
