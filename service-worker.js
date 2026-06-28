var CACHE_NAME = 'cara-cache-v1'
var URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/shop.html',
  '/cart.html',
  '/checkout.html',
  '/contact.html',
  '/about.html',
  '/blog.html',
  '/login.html',
  '/register.html',
  '/wishlist.html',
  '/style.css',
  '/style.min.css',
  '/global.css',
  '/toast.css',
  '/app.js',
  '/navbar.js',
  '/products.js'
]

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(URLS_TO_CACHE)
    })
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE_NAME) return caches.delete(key)
        })
      )
    })
  )
})

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      var fetchPromise = fetch(event.request).then(function (response) {
        if (response && response.status === 200) {
          var clone = response.clone()
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, clone)
          })
        }
        return response
      }).catch(function () {
        return caches.match('/offline.html')
      })

      return cached || fetchPromise
    })
  )
})
