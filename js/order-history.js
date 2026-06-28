;(function () {
  'use strict'

  var container = document.getElementById('order-list-container')
  if (!container) return

  function renderOrders(orders) {
    if (!orders || orders.length === 0) {
      container.innerHTML = [
        '<div class="no-orders">',
        '<i class="ri-shopping-bag-3-line"></i>',
        '<h3>No orders yet</h3>',
        '<p>You haven\'t placed any orders yet.</p>',
        '<a href="shop.html"><button class="btn btn-primary">Start Shopping</button></a>',
        '</div>'
      ].join('')
      return
    }

    var html = orders.map(function (order) {
      var statusClass = (order.status || 'pending').toLowerCase()
      var date = new Date(order.created_at).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric'
      })

      var itemsHtml = ''
      if (order.items && order.items.length) {
        itemsHtml = order.items.map(function (item) {
          return [
            '<div class="order-item-row">',
            '<span class="order-item-name">' + escapeHtml(item.product_name) + '</span>',
            '<span class="order-item-qty">x' + item.quantity + '</span>',
            '<span class="order-item-price">₹' + Number(item.price).toLocaleString('en-IN') + '</span>',
            '</div>'
          ].join('')
        }).join('')
      }

      return [
        '<div class="order-card">',
        '<div class="order-card-header">',
        '<span class="order-id">#CARA-' + String(order.id).padStart(8, '0') + '</span>',
        '<span class="order-date">' + date + '</span>',
        '<span class="order-status ' + statusClass + '">' + (order.status || 'Pending') + '</span>',
        '</div>',
        '<div class="order-card-body">',
        '<div class="order-items">' + itemsHtml + '</div>',
        '<div class="order-total-row">',
        '<span class="order-total-label">Total</span>',
        '<span class="order-total-value">₹' + Number(order.total_amount).toLocaleString('en-IN') + '</span>',
        '</div>',
        '</div>',
        '</div>'
      ].join('')
    }).join('')

    container.innerHTML = html
  }

  function escapeHtml(text) {
    if (!text) return ''
    var div = document.createElement('div')
    div.appendChild(document.createTextNode(text))
    return div.innerHTML
  }

  function loadOrders() {
    container.innerHTML = '<div class="no-orders"><i class="ri-loader-2-line" style="animation: spin 1s linear infinite;"></i><p>Loading orders...</p></div>'

    if (window.CaraAPI) {
      window.CaraAPI.get('/api/orders/')
        .then(function (orders) { renderOrders(orders) })
        .catch(function () {
          container.innerHTML = '<div class="no-orders"><i class="ri-error-warning-line"></i><h3>Could not load orders</h3><p>Please try again later.</p></div>'
        })
    } else {
      fetch('/api/orders/')
        .then(function (res) { return res.json() })
        .then(function (orders) { renderOrders(orders) })
        .catch(function () {
          container.innerHTML = '<div class="no-orders"><i class="ri-error-warning-line"></i><h3>Could not load orders</h3><p>Please try again later.</p></div>'
        })
    }
  }

  document.addEventListener('DOMContentLoaded', loadOrders)
})()
