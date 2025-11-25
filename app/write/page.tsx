import { createPost } from '@/app/actions/posts'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function WritePage() {
  let user = null
  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser
  } catch (error) {
    console.error('Error getting user in WritePage:', error)
    // 에러 발생 시 로그인 페이지로 리다이렉트
    redirect('/login')
  }

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-[#272729] rounded-lg p-6 border border-[#343536]">
        <h1 className="text-2xl font-bold mb-6 text-white">새 게시글 작성</h1>
        <form action={createPost} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-4 py-2 bg-[#1a1a1b] border border-[#343536] rounded text-white focus:outline-none focus:border-[#ff4500]"
              placeholder="제목을 입력하세요"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={15}
              className="w-full px-4 py-2 bg-[#1a1a1b] border border-[#343536] rounded text-white focus:outline-none focus:border-[#ff4500] resize-none"
              placeholder="내용을 입력하세요"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <a
              href="/"
              className="px-4 py-2 bg-[#343536] hover:bg-[#3d3d3e] text-white rounded font-semibold transition-colors"
            >
              취소
            </a>
            <button
              type="submit"
              className="px-4 py-2 bg-[#ff4500] hover:bg-[#ff5714] text-white rounded font-semibold transition-colors"
            >
              작성하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


