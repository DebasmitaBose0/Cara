;(function () {
  'use strict'

  var ERROR_STYLES_ID = 'cara-error-boundary-styles'

  function injectStyles() {
    if (document.getElementById(ERROR_STYLES_ID)) return
    var css = document.createElement('style')
    css.id = ERROR_STYLES_ID
    css.textContent = [
      '.cara-error-boundary { padding: 32px 24px; margin: 16px 0; border: 1px solid #e74c3c; border-radius: 8px; background: #fff5f5; text-align: center; }',
      '.cara-error-boundary[data-theme="dark"] { background: #2d1b1b; border-color: #c0392b; }',
      '.cara-error-boundary h3 { margin: 0 0 8px; font-size: 18px; color: #c0392b; }',
      '.cara-error-boundary p { margin: 0 0 16px; font-size: 14px; color: #666; }',
      '.cara-error-boundary button { padding: 8px 20px; background: #e74c3c; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }',
      '.cara-error-boundary button:hover { background: #c0392b; }',
      '.cara-error-boundary .error-detail { font-size: 12px; color: #999; margin-top: 8px; cursor: pointer; }',
      '.cara-error-boundary .error-stack { display: none; margin-top: 8px; padding: 8px; background: #f9f9f9; border-radius: 4px; font-size: 11px; text-align: left; white-space: pre-wrap; color: #555; max-height: 120px; overflow: auto; }',
      '.cara-error-boundary .error-stack.open { display: block; }'
    ].join('')
    document.head.appendChild(css)
  }

  function wrap(elementId, fallbackHTML) {
    var el = document.getElementById(elementId)
    if (!el) return

    try {
      var originalHTML = el.innerHTML
      el.innerHTML = ''
      el.innerHTML = originalHTML
      var scripts = el.querySelectorAll('script')
      for (var i = 0; i < scripts.length; i++) {
        var newScript = document.createElement('script')
        if (scripts[i].src) {
          newScript.src = scripts[i].src
        } else {
          newScript.textContent = scripts[i].textContent
        }
        scripts[i].parentNode.replaceChild(newScript, scripts[i])
      }
    } catch (e) {
      showFallback(el, elementId, e, fallbackHTML)
    }
  }

  function showFallback(container, id, error, fallbackHTML) {
    var theme = document.documentElement.getAttribute('data-theme') || 'light'
    container.innerHTML = fallbackHTML || [
      '<div class="cara-error-boundary" data-theme="' + theme + '">',
      '<h3>Something went wrong</h3>',
      '<p>This section encountered an error. Please try reloading the page.</p>',
      '<button onclick="location.reload()">Reload Page</button>',
      '<div class="error-detail" onclick="this.nextElementSibling.classList.toggle(\'open\')">Show details</div>',
      '<div class="error-stack">[' + id + '] ' + (error && error.message ? error.message : 'Unknown error') + '</div>',
      '</div>'
    ].join('')
  }

  injectStyles()

  window.onerror = function (msg, source, line, col, error) {
    try {
      var logs = JSON.parse(localStorage.getItem('cara_error_log') || '[]')
      logs.push({ msg: msg, source: source, line: line, col: col, time: new Date().toISOString() })
      if (logs.length > 50) logs = logs.slice(-50)
      localStorage.setItem('cara_error_log', JSON.stringify(logs))
    } catch (e) {}
  }

  window.CaraErrorBoundary = {
    wrap: wrap,
    showFallback: showFallback
  }
})()
