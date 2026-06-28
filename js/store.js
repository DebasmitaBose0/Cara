;(function () {
  'use strict'

  var STORE_KEY = 'cara_store'

  var state = {
    cart: [],
    wishlist: [],
    theme: 'light',
    cartCount: 0,
    wishlistCount: 0,
    user: null
  }

  var listeners = {}

  function load () {
    try {
      var saved = localStorage.getItem(STORE_KEY)
      if (saved) {
        var parsed = JSON.parse(saved)
        for (var key in parsed) {
          if (state.hasOwnProperty(key)) {
            state[key] = parsed[key]
          }
        }
      }
    } catch (_) {}
  }

  function persist () {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state))
    } catch (_) {}
  }

  function get (key) {
    return state[key]
  }

  function set (key, value) {
    var old = state[key]
    if (old === value) return
    state[key] = value
    persist()
    notify(key, value, old)
  }

  function on (event, fn) {
    if (!listeners[event]) listeners[event] = []
    listeners[event].push(fn)
    return function () {
      listeners[event] = listeners[event].filter(function (f) { return f !== fn })
    }
  }

  function notify (event, newVal, oldVal) {
    var fns = listeners[event] || []
    for (var i = 0; i < fns.length; i++) {
      try { fns[i](newVal, oldVal) } catch (e) {}
    }
    var allFns = listeners['*'] || []
    for (var j = 0; j < allFns.length; j++) {
      try { allFns[j](event, newVal, oldVal) } catch (e) {}
    }
  }

  function getCart () {
    return (state.cart || []).slice()
  }

  function getWishlist () {
    return (state.wishlist || []).slice()
  }

  function isInWishlist (productId) {
    return state.wishlist.some(function (item) {
      return item.id === productId || item.name === productId
    })
  }

  function setCart (items) {
    state.cart = items || []
    state.cartCount = state.cart.reduce(function (sum, item) { return sum + (item.quantity || 1) }, 0)
    persist()
    notify('cart', state.cart, [])
    notify('cartCount', state.cartCount, 0)
  }

  function setWishlist (items) {
    state.wishlist = items || []
    state.wishlistCount = state.wishlist.length
    persist()
    notify('wishlist', state.wishlist, [])
    notify('wishlistCount', state.wishlistCount, 0)
  }

  function toggleTheme () {
    var next = state.theme === 'dark' ? 'light' : 'dark'
    set('theme', next)
    document.documentElement.setAttribute('data-theme', next)
    return next
  }

  function initTheme () {
    var saved = state.theme || 'light'
    document.documentElement.setAttribute('data-theme', saved)
    var icon = document.getElementById('themeIcon')
    if (icon) {
      icon.className = saved === 'dark' ? 'ri-sun-line' : 'ri-moon-line'
    }
  }

  load()
  initTheme()

  window.CaraStore = {
    get: get,
    set: set,
    on: on,
    getCart: getCart,
    getWishlist: getWishlist,
    isInWishlist: isInWishlist,
    setCart: setCart,
    setWishlist: setWishlist,
    toggleTheme: toggleTheme,
    initTheme: initTheme
  }
})()
