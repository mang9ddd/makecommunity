'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signUp(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    username: formData.get('username') as string,
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        username: data.username,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  // Profile will be created automatically by database trigger
  // The trigger uses raw_user_meta_data->>'username' which we set in options.data
  // No manual profile creation needed

  // If user is created but email confirmation is required, try to sign in automatically
  // This works if email confirmation is disabled in Supabase settings
  if (authData.user && !authData.session) {
    // Try to sign in immediately after signup
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    
    if (signInError) {
      // If sign in fails, it might be due to email confirmation requirement
      return { 
        error: '회원가입이 완료되었지만 이메일 확인이 필요할 수 있습니다. 이메일을 확인해주세요.',
        needsEmailConfirmation: true 
      }
    }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signIn(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    // Log detailed error for debugging
    console.error('Sign in error details:', {
      message: error.message,
      status: error.status,
      name: error.name,
      email: data.email,
      errorObject: JSON.stringify(error, null, 2),
    })
    
    // Provide more specific error messages
    let errorMessage = error.message
    
    // Supabase returns "Invalid login credentials" for both wrong password and unconfirmed email
    if (error.message === 'Invalid login credentials' || error.status === 400) {
      // Check if user exists by trying to reset password (this will fail if user doesn't exist)
      errorMessage = `로그인 실패: 이메일(${data.email}) 또는 비밀번호가 올바르지 않습니다. 
      
확인 사항:
1. Supabase 대시보드 > Authentication > Users에서 이메일이 존재하는지 확인
2. 비밀번호가 정확한지 확인
3. 이메일 확인이 OFF인지 다시 확인 (Authentication > Settings > Email Auth > Confirm email)
4. 서버 콘솔의 "Sign in error details" 로그 확인`
    } else if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
      errorMessage = '이메일 인증이 완료되지 않았습니다. Supabase 대시보드에서 이메일 확인을 비활성화하세요.'
    } else if (error.message.includes('User not found')) {
      errorMessage = `등록되지 않은 이메일입니다: ${data.email}`
    }
    
    return { error: errorMessage }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

// 디버깅용: 사용자 확인 함수
export async function checkUser(email: string) {
  const supabase = await createClient()
  
  // Note: This is a workaround - Supabase doesn't provide a direct way to check if user exists
  // without admin privileges. We'll try to reset password which will fail if user doesn't exist
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
  })
  
  if (error) {
    console.error('Check user error:', error.message)
    if (error.message.includes('not found') || error.message.includes('does not exist')) {
      return { exists: false, error: '사용자가 존재하지 않습니다.' }
    }
    return { exists: true, error: null } // If error is not "not found", user likely exists
  }
  
  return { exists: true, error: null }
}


