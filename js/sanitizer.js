;(function () {
  'use strict'

  var Sanitizer = {
    stripTags: function (input) {
      if (typeof input !== 'string') return ''
      return input.replace(/<[^>]*>/g, '')
    },

    stripScript: function (input) {
      if (typeof input !== 'string') return ''
      return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*['"][^'"]*['"]/gi, '')
        .replace(/on\w+\s*=\s*\S+/gi, '')
        .replace(/javascript\s*:/gi, '')
    },

    trim: function (input) {
      if (typeof input !== 'string') return ''
      return input.trim()
    },

    stripExtraWhitespace: function (input) {
      if (typeof input !== 'string') return ''
      return input.replace(/\s+/g, ' ').trim()
    },

    email: function (input) {
      if (typeof input !== 'string') return ''
      var cleaned = this.stripTags(this.trim(input))
      var atIndex = cleaned.indexOf('@')
      if (atIndex === -1) return ''
      var local = cleaned.slice(0, atIndex).replace(/[^a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]/g, '')
      var domain = cleaned.slice(atIndex + 1).replace(/[^a-zA-Z0-9.-]/g, '')
      if (!domain.includes('.')) return ''
      return local + '@' + domain
    },

    phone: function (input) {
      if (typeof input !== 'string') return ''
      var digits = input.replace(/[^0-9+]/g, '')
      if (digits.length < 7 || digits.length > 15) return ''
      return digits
    },

    digitsOnly: function (input) {
      if (typeof input !== 'string') return ''
      return input.replace(/\D/g, '')
    },

    alphanumeric: function (input) {
      if (typeof input !== 'string') return ''
      return this.stripTags(this.trim(input)).replace(/[^a-zA-Z0-9\s-]/g, '')
    },

    name: function (input) {
      if (typeof input !== 'string') return ''
      return this.stripExtraWhitespace(this.stripTags(this.trim(input)))
        .replace(/[^a-zA-Z\s.'-]/g, '')
        .slice(0, 100)
    },

    text: function (input) {
      if (typeof input !== 'string') return ''
      return this.stripExtraWhitespace(this.stripScript(this.stripTags(this.trim(input))))
        .slice(0, 2000)
    },

    numeric: function (input) {
      if (typeof input !== 'string') return ''
      var cleaned = input.replace(/[^0-9.]/g, '')
      var parts = cleaned.split('.')
      if (parts.length > 2) return parts[0] + '.' + parts.slice(1).join('')
      return cleaned
    },

    sanitize: function (input, type) {
      if (typeof input !== 'string') return ''
      input = this.stripScript(input)
      input = this.stripTags(input)
      if (type === 'email') return this.email(input)
      if (type === 'phone') return this.phone(input)
      if (type === 'name') return this.name(input)
      if (type === 'text') return this.text(input)
      if (type === 'numeric') return this.numeric(input)
      if (type === 'digits') return this.digitsOnly(input)
      if (type === 'alphanumeric') return this.alphanumeric(input)
      return this.trim(input)
    },

    sanitizeForm: function (formEl, fieldTypes) {
      if (!formEl) return {}
      var result = {}
      for (var key in fieldTypes) {
        var input = formEl.querySelector('[name="' + key + '"]') || formEl.querySelector('#' + key)
        if (input) {
          var raw = input.value
          var clean = this.sanitize(raw, fieldTypes[key])
          input.value = clean
          result[key] = clean
        }
      }
      return result
    }
  }

  window.CaraSanitizer = Sanitizer
})()
