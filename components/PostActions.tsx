'use client'

import { toggleReaction } from '@/app/actions/reactions'
import { useState } from 'react'

interface PostActionsProps {
  postId: string
  likes: number
  dislikes: number
  userReaction?: 'like' | 'dislike'
  isAuthenticated: boolean
}

export default function PostActions({
  postId,
  likes,
  dislikes,
  userReaction,
  isAuthenticated,
}: PostActionsProps) {
  const [currentReaction, setCurrentReaction] = useState(userReaction)
  const [likeCount, setLikeCount] = useState(likes)
  const [dislikeCount, setDislikeCount] = useState(dislikes)

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.')
      return
    }

    const previousReaction = currentReaction
    const previousLikeCount = likeCount
    const previousDislikeCount = dislikeCount

    // Optimistic update
    if (previousReaction === type) {
      setCurrentReaction(undefined)
      if (type === 'like') {
        setLikeCount(likeCount - 1)
      } else {
        setDislikeCount(dislikeCount - 1)
      }
    } else if (previousReaction) {
      setCurrentReaction(type)
      if (type === 'like') {
        setLikeCount(likeCount + 1)
        setDislikeCount(dislikeCount - 1)
      } else {
        setLikeCount(likeCount - 1)
        setDislikeCount(dislikeCount + 1)
      }
    } else {
      setCurrentReaction(type)
      if (type === 'like') {
        setLikeCount(likeCount + 1)
      } else {
        setDislikeCount(dislikeCount + 1)
      }
    }

    const result = await toggleReaction(postId, type)
    if (result.error) {
      // Revert on error
      setCurrentReaction(previousReaction)
      setLikeCount(previousLikeCount)
      setDislikeCount(previousDislikeCount)
      alert(result.error)
    }
  }

  const score = likeCount - dislikeCount

  return (
    <div className="flex flex-col items-center space-y-1 min-w-[40px]">
      <button
        onClick={() => handleReaction('like')}
        className={`text-2xl transition-colors ${
          currentReaction === 'like'
            ? 'text-[#ff4500]'
            : 'text-[#818384] hover:text-[#ff4500]'
        }`}
        disabled={!isAuthenticated}
      >
        ▲
      </button>
      <span className="text-sm font-semibold text-[#d7dadc]">{score}</span>
      <button
        onClick={() => handleReaction('dislike')}
        className={`text-2xl transition-colors ${
          currentReaction === 'dislike'
            ? 'text-[#7193ff]'
            : 'text-[#818384] hover:text-[#7193ff]'
        }`}
        disabled={!isAuthenticated}
      >
        ▼
      </button>
    </div>
  )
}



