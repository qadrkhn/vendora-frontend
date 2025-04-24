'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import useEnsureUser from '@/hooks/useEnsureUser'
import { useUserStore } from '@/stores/useUserStore'
import Loader from '@/components/ui/Loader'

export default function UserMenu() {
  const { logout, clearUser } = useUserStore()
  const { user, loading } = useEnsureUser()
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) clearUser()
  }, [user, clearUser])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) return <Loader className='w-7 h-7'/>
  if (!user) return null

  const handleLogout = async () => {
    await logout()
    router.push('/sign-in')
  }

  const profileImage = user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full px-3 py-1 bg-white shadow-sm hover:bg-gray-100 transition-all border border-gray-200"
      >
        <img
          src={profileImage}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="font-medium text-sm text-gray-700">{user.name || user.email}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl ring-1 ring-neutral-400 ring-opacity-5 z-50 animate-fade-in p-2">
          <div className="text-sm text-center px-2 py-0.5 text-gray-600 border-b-2">{user.email}</div>
          <button
            onClick={handleLogout}
            className="w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-gray-300 rounded-md transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
