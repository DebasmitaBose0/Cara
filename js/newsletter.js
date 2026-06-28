;(function () {
  'use strict'

  function init() {
    var forms = document.querySelectorAll('.newsletter-form')
    if (!forms.length) return

    for (var i = 0; i < forms.length; i++) {
      setupForm(forms[i])
    }
  }

  function setupForm(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault()

      var emailInput = form.querySelector('[type="email"], input[name="email"]')
      var nameInput = form.querySelector('[name="name"]')
      var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]')

      if (!emailInput || !emailInput.value) return

      var email = emailInput.value.trim()
      var name = nameInput ? nameInput.value.trim() : ''

      if (submitBtn) {
        submitBtn.disabled = true
        submitBtn.textContent = 'Subscribing...'
      }

      var payload = { email: email, name: name }

      function handleResult(data) {
        if (submitBtn) {
          submitBtn.disabled = false
          submitBtn.textContent = 'Subscribe'
        }
        showMessage(form, data.message || 'Subscribed successfully!', 'success')
        emailInput.value = ''
        if (nameInput) nameInput.value = ''
      }

      function handleError(err) {
        if (submitBtn) {
          submitBtn.disabled = false
          submitBtn.textContent = 'Subscribe'
        }
        showMessage(form, err.message || 'Subscription failed. Please try again.', 'error')
      }

      if (window.CaraAPI) {
        window.CaraAPI.post('/api/newsletter/subscribe', payload)
          .then(handleResult)
          .catch(handleError)
      } else {
        fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, body: data } }) })
          .then(function (res) {
            if (res.ok) handleResult(res.body)
            else handleError(new Error(res.body.detail || 'Subscription failed'))
          })
          .catch(handleError)
      }
    })
  }

  function showMessage(form, text, type) {
    var existing = form.querySelector('.newsletter-message')
    if (existing) existing.remove()

    var msg = document.createElement('div')
    msg.className = 'newsletter-message'
    msg.style.cssText = 'margin-top: 8px; font-size: 13px; padding: 6px 12px; border-radius: 4px;'
    msg.style.color = type === 'success' ? '#2e7d32' : '#c62828'
    msg.style.background = type === 'success' ? '#e8f5e9' : '#fbe9e7'
    msg.textContent = text
    form.appendChild(msg)

    setTimeout(function () { msg.remove() }, 4000)
  }

  if (document.readyState !== 'loading') {
    init()
  } else {
    document.addEventListener('DOMContentLoaded', init)
  }
})()
