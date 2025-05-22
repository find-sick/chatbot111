import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // 刷新会话（如果存在）
  const {
    data: { session },
  } = await supabase.auth.getSession()


  // 获取当前路径
  const path = req.nextUrl.pathname

  // 定义需要保护的路由
  const protectedRoutes = ['/']
  // 定义公开路由
  const publicRoutes = ['/login', '/auth/callback', '/auth/auth-code-error']

  // 如果是受保护的路由且用户未登录，重定向到登录页
  if (protectedRoutes.includes(path) && !session) {
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // 如果用户已登录且访问登录页，重定向到首页
  if (session && publicRoutes.includes(path)) {
    const redirectUrl = new URL('/', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// 配置需要进行中间件处理的路径
export const config = {
  matcher: ['/', '/login', '/auth/callback', '/auth/auth-code-error']
} 