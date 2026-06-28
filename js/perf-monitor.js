;(function () {
  'use strict'

  var STORAGE_KEY = 'cara_perf_metrics'
  var MAX_ENTRIES = 100

  function captureWebVitals() {
    if (typeof PerformanceObserver === 'undefined') return

    try {
      var observer = new PerformanceObserver(function (list) {
        var entries = list.getEntries()
        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i]
          save({
            name: entry.name || entry.entryType,
            type: entry.entryType,
            value: entry.startTime || entry.duration || entry.processingStart || 0,
            rating: entry.entryType === 'largest-contentful-paint' ? (entry.startTime < 2500 ? 'good' : entry.startTime < 4000 ? 'needs-improvement' : 'poor') : '',
            time: Date.now()
          })
        }
      })
      observer.observe({ type: 'largest-contentful-paint', buffered: true })
    } catch (e) {}

    try {
      var clsObserver = new PerformanceObserver(function (list) {
        var entries = list.getEntries()
        var clsValue = 0
        for (var i = 0; i < entries.length; i++) {
          if (!entries[i].hadRecentInput) clsValue += entries[i].value
        }
        save({
          name: 'Cumulative Layout Shift',
          type: 'layout-shift',
          value: clsValue,
          rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor',
          time: Date.now()
        })
      })
      clsObserver.observe({ type: 'layout-shift', buffered: true })
    } catch (e) {}

    try {
      var fidObserver = new PerformanceObserver(function (list) {
        var entries = list.getEntries()
        for (var i = 0; i < entries.length; i++) {
          save({
            name: 'First Input Delay',
            type: 'first-input',
            value: entries[i].processingStart - entries[i].startTime,
            rating: (entries[i].processingStart - entries[i].startTime) < 100 ? 'good' : (entries[i].processingStart - entries[i].startTime) < 300 ? 'needs-improvement' : 'poor',
            time: Date.now()
          })
        }
      })
      fidObserver.observe({ type: 'first-input', buffered: true })
    } catch (e) {}
  }

  function captureNavigationTiming() {
    if (typeof performance === 'undefined' || !performance.timing) return
    try {
      var t = performance.timing
      var timing = {
        name: 'Page Load',
        type: 'navigation',
        value: t.loadEventEnd - t.navigationStart,
        detail: {
          dns: t.domainLookupEnd - t.domainLookupStart,
          tcp: t.connectEnd - t.connectStart,
          ttfb: t.responseStart - t.navigationStart,
          domContentLoaded: t.domContentLoadedEventEnd - t.navigationStart,
          domInteractive: t.domInteractive - t.navigationStart
        },
        time: Date.now()
      }
      save(timing)
    } catch (e) {}
  }

  function save(metric) {
    try {
      var metrics = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      metrics.push(metric)
      if (metrics.length > MAX_ENTRIES) metrics = metrics.slice(-MAX_ENTRIES)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics))
    } catch (e) {}
  }

  function getMetrics() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch (e) {
      return []
    }
  }

  function clearMetrics() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {}
  }

  function getSummary() {
    var metrics = getMetrics()
    var summary = { total: metrics.length, lcp: null, cls: null, fid: null, pages: 0 }
    for (var i = 0; i < metrics.length; i++) {
      var m = metrics[i]
      if (m.type === 'largest-contentful-paint') summary.lcp = m
      if (m.type === 'layout-shift') summary.cls = m
      if (m.type === 'first-input') summary.fid = m
      if (m.type === 'navigation') summary.pages++
    }
    return summary
  }

  function init() {
    if (document.readyState === 'complete') {
      captureNavigationTiming()
    } else {
      window.addEventListener('load', captureNavigationTiming)
    }
    captureWebVitals()
  }

  if (document.readyState !== 'loading') {
    init()
  } else {
    document.addEventListener('DOMContentLoaded', init)
  }

  window.CaraPerf = {
    getMetrics: getMetrics,
    clearMetrics: clearMetrics,
    getSummary: getSummary
  }
})()
