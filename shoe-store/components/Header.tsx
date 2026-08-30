// components/Header.tsx
import { getCurrentUser } from '@/lib/getCurrentUser'
import HeaderNav from './HeaderNav'

export default async function Header() {
  const user = await getCurrentUser()

  return (
    <HeaderNav
      user={user ? { name: user.name, email: user.email, role: user.role } : null}
    />
  )
}