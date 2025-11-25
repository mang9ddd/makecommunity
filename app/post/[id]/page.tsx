import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import Link from 'next/link'
import { updatePost } from '@/app/actions/posts'
import { createComment, deleteComment } from '@/app/actions/comments'
import { toggleReaction } from '@/app/actions/reactions'
import PostActions from '@/components/PostActions'
import CommentSection from '@/components/CommentSection'
import DeletePostButton from '@/components/DeletePostButton'

async function getPost(id: string) {
  try {
    const supabase = await createClient()

    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_reactions (
          reaction_type,
          user_id
        ),
        comments (
          id,
          content,
          created_at,
          updated_at,
          user_id
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching post:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        postId: id,
      })
      return null
    }

    if (!post) {
      console.error('Post not found:', id)
      return null
    }

    // profiles를 별도로 조회하여 매핑
    const { data: postProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('id', post.user_id)
      .single()

    if (profileError) {
      console.error('Error fetching post profile:', {
        message: profileError.message,
        userId: post.user_id,
      })
      // 프로필 조회 실패해도 게시글은 표시
    }

    // comments의 profiles도 별도로 조회
    if (post.comments && post.comments.length > 0) {
      const commentUserIds = [...new Set(post.comments.map((c: any) => c.user_id))]
      const { data: commentProfiles, error: commentProfilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', commentUserIds)
      
      if (commentProfilesError) {
        console.error('Error fetching comment profiles:', commentProfilesError.message)
      }
      
      const commentProfilesMap = new Map(commentProfiles?.map((p: any) => [p.id, p]) || [])
      
      post.comments = post.comments.map((comment: any) => ({
        ...comment,
        profiles: commentProfilesMap.get(comment.user_id) || null,
      }))
    }

    return {
      ...post,
      profiles: postProfile || null,
    }
  } catch (err) {
    console.error('Unexpected error in getPost:', err)
    return null
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)
  
  let user = null
  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser
  } catch (error) {
    console.error('Error getting user in PostPage:', error)
    // 환경 변수가 없거나 Supabase 연결 실패 시에도 게시글은 표시
    user = null
  }

  if (!post) {
    notFound()
  }

  const likes = post.post_reactions?.filter((r: any) => r.reaction_type === 'like').length || 0
  const dislikes = post.post_reactions?.filter((r: any) => r.reaction_type === 'dislike').length || 0
  const userReaction = post.post_reactions?.find((r: any) => r.user_id === user?.id)
  const isOwner = user?.id === post.user_id

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-[#272729] rounded-lg p-6 border border-[#343536] mb-4">
        <div className="flex items-start space-x-3 mb-4">
          <PostActions
            postId={post.id}
            likes={likes}
            dislikes={dislikes}
            userReaction={userReaction?.reaction_type}
            isAuthenticated={!!user}
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">{post.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-[#818384] mb-4">
              <span>u/{post.profiles?.username || '익명'}</span>
              <span>
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                  locale: ko,
                })}
              </span>
              {isOwner && (
                <div className="flex space-x-2">
                  <Link
                    href={`/post/${post.id}/edit`}
                    className="text-[#ff4500] hover:underline"
                  >
                    수정
                  </Link>
                  <DeletePostButton postId={post.id} />
                </div>
              )}
            </div>
            <div className="text-[#d7dadc] whitespace-pre-wrap">{post.content}</div>
          </div>
        </div>
      </div>

      <CommentSection
        postId={post.id}
        comments={post.comments || []}
        isAuthenticated={!!user}
        currentUserId={user?.id}
      />
    </div>
  )
}

