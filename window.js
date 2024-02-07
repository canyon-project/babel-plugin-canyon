(function () {
    if (typeof window !== 'undefined') {
        return window;
    } else if (typeof global !== 'undefined') {
        return global;
    } else {
        throw new Error('Unable to determine global object');
    }
})()