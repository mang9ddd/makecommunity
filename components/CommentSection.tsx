'use client'

import { createComment, deleteComment } from '@/app/actions/comments'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useState } from 'react'

interface Comment {
  id: string
  content: string
  created_at: string
  updated_at: string
  profiles: {
    username: string
  } | null
  user_id?: string
}

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  isAuthenticated: boolean
  currentUserId?: string
}

export default function CommentSection({
  postId,
  comments: initialComments,
  isAuthenticated,
  currentUserId,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments)
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.')
      return
    }

    if (!content.trim()) {
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('content', content)

    const result = await createComment(postId, formData)
    if (result.success) {
      setContent('')
      // Reload page to get updated comments
      window.location.reload()
    } else if (result.error) {
      alert(result.error)
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return
    }

    const result = await deleteComment(commentId)
    if (result.success) {
      setComments(comments.filter((c) => c.id !== commentId))
    } else if (result.error) {
      alert(result.error)
    }
  }

  return (
    <div className="bg-[#272729] rounded-lg p-6 border border-[#343536]">
      <h2 className="text-xl font-semibold text-white mb-4">
        댓글 {comments.length}개
      </h2>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력하세요..."
            rows={4}
            className="w-full px-4 py-2 bg-[#1a1a1b] border border-[#343536] rounded text-white focus:outline-none focus:border-[#ff4500] resize-none mb-2"
          />
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-4 py-2 bg-[#ff4500] hover:bg-[#ff5714] text-white rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '작성 중...' : '댓글 작성'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-[#818384] text-center py-4">댓글이 없습니다.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-[#343536] pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 text-sm text-[#818384]">
                  <span>u/{comment.profiles?.username || '익명'}</span>
                  <span>
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </span>
                </div>
                {isAuthenticated && currentUserId === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                )}
              </div>
              <p className="text-[#d7dadc] whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

