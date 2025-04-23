'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import API from '@/lib/api'
import apiRoutes from '@/constants/apiRoutes'

type Props = {
  email: string
}

export default function OtpVerificationForm({ email }: Props) {
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [resendMessage, setResendMessage] = useState('')
  const [resendError, setResendError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  const router = useRouter()
  const searchParams = useSearchParams()
  const shouldShowResend = searchParams.get('resend') === 'true'

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) clearInterval(timer)
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [resendCooldown])

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')
    setError('')

    try {
      await API.post(apiRoutes.auth.verifyOtp, { email, otp })
      setMessage('Email verified successfully. Logging in ....')

      const password = localStorage.getItem('temp_password')
      if (!password) {
        router.push('/sign-in')
        return
      }

      localStorage.removeItem('temp_password')
      await API.post(apiRoutes.auth.login, { email, password })

      setTimeout(() => router.push('/dashboard'), 1000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP')
    }
  }

  const handleResend = async () => {
    setResendMessage('')
    setResendError('')

    try {
      const res = await API.post(apiRoutes.auth.resendOtp, { email })
      setResendMessage(res.data.message)
      setResendCooldown(60) // lock for 60 seconds
    } catch (err: any) {
      setResendError(err.response?.data?.message || 'Failed to resend OTP')
    }
  }

  return (
    <form onSubmit={handleVerify}>
      <p>
        Enter the OTP sent to <strong>{email}</strong>
      </p>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        required
      />
      <button type="submit">Verify</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {shouldShowResend && (
        <div style={{ marginTop: '1rem' }}>
          <button type="button" onClick={handleResend} disabled={resendCooldown > 0}>
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
          </button>
          {resendMessage && <p style={{ color: 'green' }}>{resendMessage}</p>}
          {resendError && <p style={{ color: 'red' }}>{resendError}</p>}
        </div>
      )}
    </form>
  )
}
