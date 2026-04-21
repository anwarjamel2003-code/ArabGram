'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog" // Assume shadcn dialog exists, else use Modal
import { Edit3, X } from "lucide-react"

interface EditProfileModalProps {
  user: any
  onUpdate: () => void
}

export default function EditProfileModal({ user, onUpdate }: EditProfileModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    image: user.image || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        onUpdate()
        setOpen(false)
      }
    } catch (error) {
      console.error('Update failed', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Edit3 className="h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Bio</label>
            <Input 
              value={formData.bio} 
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Tell us about yourself"
              maxLength={150}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Profile Image URL</label>
            <Input 
              value={formData.image} 
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="https://image.url"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
