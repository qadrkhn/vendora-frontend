'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import useEnsureUser from "@/hooks/useEnsureUser"
import { useUserStore } from '@/stores/useUserStore'

export default function UserMenu() {
    const { logout, clearUser } = useUserStore()
    const { user, loading } = useEnsureUser()
    const [open, setOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            clearUser()
        }
    }, [user, clearUser])

    if (loading) return <p>Loading...</p>
    if (!user) return null

    const handleLogout = async () => {
        await logout()
        router.push('/sign-in')
    }

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center space-x-2 rounded-full bg-gray-100 px-3 py-1 hover:bg-gray-200"
            >
                <span className="font-medium text-sm">{user.name || user.email}</span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}
