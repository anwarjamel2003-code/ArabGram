/**
 * ArabGram Service Worker
 * Handles background push notifications
 */

self.addEventListener('push', function (event) {
  if (event.data) {
    try {
      const data = event.data.json()
      const options = {
        body: data.body,
        icon: '/arabgram-logo.png',
        badge: '/arabgram-logo.png',
        vibrate: [100, 50, 100],
        data: {
          url: data.url || '/',
        },
        actions: [
          { action: 'open', title: 'فتح' },
          { action: 'close', title: 'إغلاق' },
        ],
        tag: data.tag || 'arabgram-notification',
        renotify: true,
      }

      event.waitUntil(
        self.registration.showNotification(data.title || 'ArabGram', options)
      )
    } catch (e) {
      console.error('Push event error:', e)
    }
  }
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()

  if (event.action === 'close') return

  const urlToOpen = event.notification.data.url

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})
