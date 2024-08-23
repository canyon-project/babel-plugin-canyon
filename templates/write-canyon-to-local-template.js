if (window.isDocumentAddVisibilitychangeWriteCanyonToLocal) {
} else {
  window.isDocumentAddVisibilitychangeWriteCanyonToLocal = true
  if (window.document) {
    if (window.writeCanyonToLocal) {
      window.manualWriteCanyonToLocal = function () {
        window.writeCanyonToLocal(JSON.stringify({
          coverage: window.__coverage__,
          canyon: window.__canyon__
        }))
      }
    }
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        if (window.writeCanyonToLocal) {
          window.writeCanyonToLocal(JSON.stringify({
            coverage: window.__coverage__,
            canyon: window.__canyon__
          }))
        } else {
          console.log('no writeCanyonToLocal function')
        }
      }
    });
  }
}
