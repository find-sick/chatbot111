'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { signOut } from '@/utils/auth';

export default function GoogleSignIn() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google 登录失败:', error);
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Google 登录错误:', error);
      alert('Google 登录失败，请重试');
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="google-btn"
    >
      <img
        src="/google-icon.svg"
        alt="Google登录"
        width={20}
        height={20}
        className="mr-3"
      />
      使用Google登录
    </button>
  );
} 