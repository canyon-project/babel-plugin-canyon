if (typeof process !== 'undefined' && process.env) {
  function autoReport() {
    try {
      if (fetch && window.__canyon__ && window.__coverage__ && window.__canyon__.dsn && window.__canyon__.reporter) {
        console.log('canyon: auto report ing...')
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
          console.log('canyon: auto report success')
        }).catch(function (err) {
          console.log('canyon: auto report error:', err)
        })
      }
    } catch (e) {

    }
  }

  autoReport()
  setInterval(autoReport, 1000 * 60 * 5)
}
