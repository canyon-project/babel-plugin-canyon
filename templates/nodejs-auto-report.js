if (typeof process !== 'undefined' && process.env) {
  setInterval(function () {
    if (fetch) {
      fetch(window.__canyon__.dsn, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + window.__canyon__.reporter
        },
        body: JSON.stringify({
          coverage: window.__coverage__,
          ...window.__canyon__
        })
      })
    }
  }, 1000 * 60 * 5)
}
