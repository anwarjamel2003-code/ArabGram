'use client'

import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotifications } from '@/hooks/useNotifications'

export default function NotificationPrompt() {
  const { permission, subscribe, loading, isSupported } = useNotifications()
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Show prompt only if supported, not granted, not denied, and not previously dismissed
    if (isSupported && permission === 'default') {
      const dismissed = localStorage.getItem('arabgram_push_dismissed')
      if (!dismissed) {
        // Small delay to not overwhelm user immediately
        const timer = setTimeout(() => setShow(true), 3000)
        return () => clearTimeout(timer)
      }
    }
  }, [isSupported, permission])

  if (!show) return null

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem('arabgram_push_dismissed', 'true')
  }

  const handleSubscribe = async () => {
    await subscribe()
    setShow(false)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-indigo-100 p-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
          <Bell className="h-5 w-5 text-indigo-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">تفعيل الإشعارات</h3>
          <p className="text-sm text-gray-500 mb-4">
            احصل على تنبيهات فورية للرسائل والمكالمات والإعجابات الجديدة.
          </p>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSubscribe}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              {loading ? 'جاري التفعيل...' : 'تفعيل الآن'}
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="px-3"
            >
              لاحقاً
            </Button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
