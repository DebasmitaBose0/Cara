;(function () {
  'use strict'

  var COOKIE_CONSENT_KEY = 'cara_cookie_consent'
  var STYLES_ID = 'cara-cookie-consent-styles'

  var defaultPreferences = {
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  }

  function injectStyles() {
    if (document.getElementById(STYLES_ID)) return
    var css = document.createElement('style')
    css.id = STYLES_ID
    css.textContent = [
      '#cara-cookie-banner { position: fixed; bottom: 0; left: 0; right: 0; background: #1a1a1a; color: #e0e0e0; padding: 20px 24px; z-index: 10000; box-shadow: 0 -4px 20px rgba(0,0,0,0.3); transform: translateY(100%); transition: transform 0.4s ease; font-family: system-ui, sans-serif; }',
      '#cara-cookie-banner.show { transform: translateY(0); }',
      '#cara-cookie-banner .cookie-content { max-width: 1100px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }',
      '#cara-cookie-banner .cookie-text { flex: 1; min-width: 240px; font-size: 14px; line-height: 1.5; }',
      '#cara-cookie-banner .cookie-text a { color: #4caf50; text-decoration: underline; }',
      '#cara-cookie-banner .cookie-actions { display: flex; gap: 10px; flex-wrap: wrap; }',
      '#cara-cookie-banner .cookie-btn { padding: 10px 22px; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }',
      '#cara-cookie-banner .cookie-btn:hover { opacity: 0.85; }',
      '#cara-cookie-banner .cookie-btn-accept { background: #088178; color: #fff; }',
      '#cara-cookie-banner .cookie-btn-decline { background: #444; color: #e0e0e0; }',
      '#cara-cookie-banner .cookie-btn-customize { background: transparent; color: #aaa; border: 1px solid #555; }',
      '#cara-cookie-consent-modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 10001; align-items: center; justify-content: center; }',
      '#cara-cookie-consent-modal.show { display: flex; }',
      '#cara-cookie-consent-modal .modal-card { background: #fff; border-radius: 12px; padding: 32px; max-width: 480px; width: 90%; max-height: 80vh; overflow-y: auto; color: #333; }',
      'body.dark #cara-cookie-consent-modal .modal-card { background: #2a2a2a; color: #e0e0e0; }',
      '#cara-cookie-consent-modal .modal-card h3 { margin: 0 0 20px; font-size: 20px; }',
      '#cara-cookie-consent-modal .cookie-preference { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee; }',
      'body.dark #cara-cookie-consent-modal .cookie-preference { border-bottom-color: #444; }',
      '#cara-cookie-consent-modal .cookie-preference label { font-size: 14px; }',
      '#cara-cookie-consent-modal .cookie-preference .desc { font-size: 12px; color: #888; display: block; margin-top: 2px; }',
      '#cara-cookie-consent-modal .modal-actions { margin-top: 24px; display: flex; gap: 10px; justify-content: flex-end; }',
      '.cookie-toggle { position: relative; width: 44px; height: 24px; flex-shrink: 0; }',
      '.cookie-toggle input { display: none; }',
      '.cookie-toggle .slider { position: absolute; inset: 0; background: #ccc; border-radius: 12px; cursor: pointer; transition: background 0.2s; }',
      '.cookie-toggle .slider::after { content: ""; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; background: #fff; border-radius: 50%; transition: transform 0.2s; }',
      '.cookie-toggle input:checked + .slider { background: #088178; }',
      '.cookie-toggle input:checked + .slider::after { transform: translateX(20px); }',
      '#cara-cookie-banner .cookie-btn-save { background: #088178; color: #fff; }'
    ].join('')
    document.head.appendChild(css)
  }

  function getConsent() {
    try {
      var saved = localStorage.getItem(COOKIE_CONSENT_KEY)
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return null
  }

  function saveConsent(preferences) {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences))
    } catch (e) {}
  }

  function showBanner() {
    var banner = document.createElement('div')
    banner.id = 'cara-cookie-banner'
    banner.innerHTML = [
      '<div class="cookie-content">',
      '<div class="cookie-text">We use cookies to enhance your experience. By continuing, you agree to our <a href="privacy.html" target="_blank">Privacy Policy</a>.</div>',
      '<div class="cookie-actions">',
      '<button class="cookie-btn cookie-btn-customize" id="cookie-customize">Customize</button>',
      '<button class="cookie-btn cookie-btn-decline" id="cookie-decline">Decline All</button>',
      '<button class="cookie-btn cookie-btn-accept" id="cookie-accept">Accept All</button>',
      '</div></div>'
    ].join('')
    document.body.appendChild(banner)

    requestAnimationFrame(function () {
      banner.classList.add('show')
    })

    document.getElementById('cookie-accept').addEventListener('click', function () {
      saveConsent({ necessary: true, analytics: true, marketing: true, functional: true })
      hideBanner()
      applyPreferences()
    })

    document.getElementById('cookie-decline').addEventListener('click', function () {
      saveConsent(defaultPreferences)
      hideBanner()
      applyPreferences()
    })

    document.getElementById('cookie-customize').addEventListener('click', function () {
      showCustomizeModal()
    })
  }

  function hideBanner() {
    var banner = document.getElementById('cara-cookie-banner')
    if (banner) {
      banner.classList.remove('show')
      setTimeout(function () { banner.remove() }, 400)
    }
  }

  function showCustomizeModal() {
    var existing = document.getElementById('cara-cookie-consent-modal')
    if (existing) existing.remove()

    var current = getConsent() || defaultPreferences

    var modal = document.createElement('div')
    modal.id = 'cara-cookie-consent-modal'
    modal.innerHTML = [
      '<div class="modal-card">',
      '<h3>Cookie Preferences</h3>',
      '<div class="cookie-preference"><div><label>Necessary</label><span class="desc">Required for site functionality</span></div><div class="cookie-toggle"><input type="checkbox" id="pref-necessary" checked disabled><label class="slider" for="pref-necessary"></label></div></div>',
      '<div class="cookie-preference"><div><label>Analytics</label><span class="desc">Help us improve with usage data</span></div><div class="cookie-toggle"><input type="checkbox" id="pref-analytics"' + (current.analytics ? ' checked' : '') + '><label class="slider" for="pref-analytics"></label></div></div>',
      '<div class="cookie-preference"><div><label>Marketing</label><span class="desc">Personalized ads and offers</span></div><div class="cookie-toggle"><input type="checkbox" id="pref-marketing"' + (current.marketing ? ' checked' : '') + '><label class="slider" for="pref-marketing"></label></div></div>',
      '<div class="cookie-preference"><div><label>Functional</label><span class="desc">Enhanced features and settings</span></div><div class="cookie-toggle"><input type="checkbox" id="pref-functional"' + (current.functional ? ' checked' : '') + '><label class="slider" for="pref-functional"></label></div></div>',
      '<div class="modal-actions">',
      '<button class="cookie-btn cookie-btn-decline" id="cookie-cancel-prefs">Cancel</button>',
      '<button class="cookie-btn cookie-btn-save" id="cookie-save-prefs">Save Preferences</button>',
      '</div></div>'
    ].join('')
    document.body.appendChild(modal)

    requestAnimationFrame(function () {
      modal.classList.add('show')
    })

    document.getElementById('cookie-cancel-prefs').addEventListener('click', function () { modal.remove() })
    document.getElementById('cookie-save-prefs').addEventListener('click', function () {
      var prefs = {
        necessary: true,
        analytics: document.getElementById('pref-analytics').checked,
        marketing: document.getElementById('pref-marketing').checked,
        functional: document.getElementById('pref-functional').checked
      }
      saveConsent(prefs)
      modal.remove()
      hideBanner()
      applyPreferences()
    })

    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.remove()
    })
  }

  function applyPreferences() {
    var prefs = getConsent()
    if (!prefs) return

    if (!prefs.analytics) {
      // Disable analytics by removing any analytics scripts
      var ga = document.querySelectorAll('script[src*="google-analytics"], script[src*="gtag"]')
      for (var i = 0; i < ga.length; i++) ga[i].remove()
    }

    if (!prefs.marketing) {
      var fb = document.querySelectorAll('script[src*="facebook"], script[src*="fbq"]')
      for (var j = 0; j < fb.length; j++) fb[j].remove()
    }

    var event = new CustomEvent('cookieConsentUpdate', { detail: prefs })
    document.dispatchEvent(event)
  }

  function init() {
    injectStyles()

    var consent = getConsent()
    if (!consent) {
      if (document.readyState !== 'loading') {
        showBanner()
      } else {
        document.addEventListener('DOMContentLoaded', showBanner)
      }
    } else {
      applyPreferences()
    }
  }

  init()

  window.CaraCookieConsent = {
    getConsent: getConsent,
    saveConsent: saveConsent,
    showPreferences: showCustomizeModal
  }
})()
