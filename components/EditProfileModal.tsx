'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit2, X } from 'lucide-react'

interface EditProfileModalProps {
  user: {
    name?: string
    bio?: string
    image?: string
  }
  onSave?: (data: any) => Promise<void>
  onUpdate?: () => Promise<void>
}

export default function EditProfileModal({ user, onSave }: EditProfileModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      if (onSave) {
        await onSave(formData)
      }
      setOpen(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" className="gap-2" onClick={() => setOpen(true)}>
        <Edit2 className="h-4 w-4" />
        تعديل الملف الشخصي
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">تعديل الملف الشخصي</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  الاسم
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="أدخل اسمك"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  السيرة الذاتية
                </label>
                <Input
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="أخبرنا عن نفسك"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-gradient-to-r from-indigo-500 to-purple-600"
              >
                {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
