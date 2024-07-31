if (typeof process !== 'undefined' && process.env) {
  function autoReport () {
    if (fetch&&window.__canyon__&&window.__coverage__) {
      console.log('auto report ing...')
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
      }).then(function () {
        console.log('auto report success')
      }).catch(function (err) {
        console.log('auto report error:', err)
      })
    }
  }
  autoReport()
  setInterval(autoReport, 1000 * 60 * 5)
}
