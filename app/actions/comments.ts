'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createComment(postId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const content = formData.get('content') as string

  if (!content) {
    return { error: '댓글 내용을 입력해주세요.' }
  }

  const { error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      content,
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/post/${postId}`)
  return { success: true }
}

export async function updateComment(commentId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const content = formData.get('content') as string

  const { data: comment } = await supabase
    .from('comments')
    .select('post_id')
    .eq('id', commentId)
    .single()

  const { error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', commentId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  if (comment) {
    revalidatePath(`/post/${comment.post_id}`)
  }
  return { success: true }
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const { data: comment } = await supabase
    .from('comments')
    .select('post_id')
    .eq('id', commentId)
    .single()

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  if (comment) {
    revalidatePath(`/post/${comment.post_id}`)
  }
  return { success: true }
}



