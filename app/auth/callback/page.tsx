'use client'
import { Suspense } from 'react'
import AuthCallback from '../_AuthCallback'

export default function Page() {
  return (
    <Suspense fallback={<div>正在登录中...</div>}>
      <AuthCallback />
    </Suspense>
  )
} 