'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!title || !content) {
    return { error: '제목과 내용을 입력해주세요.' }
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      title,
      content,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating post:', {
      message: error.message,
      code: error.code,
      details: error.details,
    })
    return { error: error.message }
  }

  if (!data || !data.id) {
    console.error('Post created but no data returned')
    return { error: '게시글이 생성되었지만 데이터를 가져올 수 없습니다.' }
  }

  // 홈 페이지 revalidate (게시글 목록 갱신)
  revalidatePath('/')
  revalidatePath(`/post/${data.id}`)
  
  // 대시보드(홈 페이지)로 리다이렉트
  redirect('/')
}

export async function updatePost(postId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  const { error } = await supabase
    .from('posts')
    .update({ title, content })
    .eq('id', postId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/post/${postId}`)
  revalidatePath('/')
  redirect(`/post/${postId}`)
}

export async function deletePost(postId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath(`/post/${postId}`)
  return { success: true }
}


