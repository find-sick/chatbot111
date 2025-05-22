'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  useEffect(() => {
    const supabase = createClientComponentClient()
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!error) {
          router.replace(next)
        } else {
          router.replace('/auth/auth-code-error')
        }
      })
    } else {
      router.replace('/auth/auth-code-error')
    }
  }, [code, next, router])

  return <div>正在登录中...</div>
}
