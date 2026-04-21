import { redirect } from 'next/navigation'

export default function OldProfileRedirect() {
  redirect('/profile/@me')
}
