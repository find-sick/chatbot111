import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function getCurrentUser() {
  const supabase = createClientComponentClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('获取会话失败:', error)
      return null
    }

    if (!session) {
      return null
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('获取用户信息失败:', userError)
      return null
    }

    return user
  } catch (error) {
    console.error('获取用户信息时发生错误:', error)
    return null
  }
}

export async function signOut() {
  const supabase = createClientComponentClient()
  
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('退出登录失败:', error)
      throw error
    }
    return true
  } catch (error) {
    console.error('退出登录时发生错误:', error)
    return false
  }
} 