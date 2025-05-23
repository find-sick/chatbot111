'use server';

import { supabaseServer } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';

// 注册用户
export async function signUpWithEmail(email: string, password: string) {
  if (!email || !password) throw new Error('邮箱和密码不能为空');
  
  // 调用 Supabase Auth 注册接口（自动处理密码哈希、邮箱验证邮件发送）
  const result = await supabaseServer.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`, // 邮箱验证重定向地址
    },
  });

  // if (result.error) throw result.error;
  return result ;
}

// 邮箱密码登录
export async function signInWithEmail(email: string, password: string) {
  const supabase = createServerActionClient({ cookies });
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  // 这里 supabase 会自动把 session 写入 cookies
  return { user: data.user, session: data.session, error };
}

// Google登录
export async function signInWithGoogle() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      skipBrowserRedirect: false
    },
  });

  if (error) throw error;
  return data;
}

