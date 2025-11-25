'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function toggleReaction(postId: string, reactionType: 'like' | 'dislike') {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  // Check if user already has a reaction
  const { data: existingReaction } = await supabase
    .from('post_reactions')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()

  if (existingReaction) {
    if (existingReaction.reaction_type === reactionType) {
      // Remove reaction if clicking the same type
      const { error } = await supabase
        .from('post_reactions')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id)

      if (error) {
        return { error: error.message }
      }
    } else {
      // Update reaction type
      const { error } = await supabase
        .from('post_reactions')
        .update({ reaction_type: reactionType })
        .eq('post_id', postId)
        .eq('user_id', user.id)

      if (error) {
        return { error: error.message }
      }
    }
  } else {
    // Create new reaction
    const { error } = await supabase
      .from('post_reactions')
      .insert({
        post_id: postId,
        user_id: user.id,
        reaction_type: reactionType,
      })

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath(`/post/${postId}`)
  revalidatePath('/')
  return { success: true }
}


