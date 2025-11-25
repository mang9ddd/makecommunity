'use client'

import { deletePost } from '@/app/actions/posts'
import { useRouter } from 'next/navigation'

interface DeletePostButtonProps {
  postId: string
}

export default function DeletePostButton({ postId }: DeletePostButtonProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return
    }

    const result = await deletePost(postId)
    
    if (result?.error) {
      alert(result.error)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:underline"
    >
      삭제
    </button>
  )
}

