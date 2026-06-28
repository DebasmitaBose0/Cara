;(function () {
  'use strict'

  var BASE_URL = (window.CaraConfig && window.CaraConfig.API_BASE) || ''

  function request(method, path, options) {
    options = options || {}
    var url = BASE_URL + path
    var fetchOptions = {
      method: method,
      headers: {
        'Accept': 'application/json'
      }
    }

    if (options.body) {
      fetchOptions.headers['Content-Type'] = 'application/json'
      fetchOptions.body = JSON.stringify(options.body)
    }

    var token = options.token || getToken()
    if (token) {
      fetchOptions.headers['Authorization'] = 'Bearer ' + token
    }

    if (options.signal) {
      fetchOptions.signal = options.signal
    }

    var timeout = options.timeout || 10000
    var controller = new AbortController()
    var timeoutId = setTimeout(function () { controller.abort() }, timeout)
    if (!fetchOptions.signal) {
      fetchOptions.signal = controller.signal
    }

    return fetch(url, fetchOptions)
      .then(function (response) {
        clearTimeout(timeoutId)
        if (!response.ok) {
          return response.json().then(function (err) {
            var error = new Error(err.detail || err.message || 'Request failed')
            error.status = response.status
            error.data = err
            throw error
          }, function () {
            var error = new Error('HTTP ' + response.status)
            error.status = response.status
            throw error
          })
        }
        return response.json()
      })
      .catch(function (err) {
        clearTimeout(timeoutId)
        if (err.name === 'AbortError') {
          var timeoutErr = new Error('Request timed out')
          timeoutErr.code = 'TIMEOUT'
          throw timeoutErr
        }
        throw err
      })
  }

  function getToken() {
    try {
      return localStorage.getItem('access_token') || null
    } catch (e) {
      return null
    }
  }

  var ApiClient = {
    get: function (path, options) {
      return request('GET', path, options)
    },

    post: function (path, body, options) {
      options = options || {}
      options.body = body
      return request('POST', path, options)
    },

    put: function (path, body, options) {
      options = options || {}
      options.body = body
      return request('PUT', path, options)
    },

    del: function (path, options) {
      return request('DELETE', path, options)
    },

    setBaseUrl: function (url) {
      BASE_URL = url
    }
  }

  window.CaraAPI = ApiClient
})()
