import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updatePost } from '@/app/actions/posts'

async function getPost(id: string) {
  const supabase = await createClient()
  let user = null
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser
  } catch (error) {
    console.error('Error getting user in getPost (edit):', error)
    redirect('/login')
  }

  if (!user) {
    redirect('/login')
  }

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !post) {
    return null
  }

  return post
}

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-[#272729] rounded-lg p-6 border border-[#343536]">
        <h1 className="text-2xl font-bold mb-6 text-white">게시글 수정</h1>
        <form action={updatePost.bind(null, post.id)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={post.title}
              className="w-full px-4 py-2 bg-[#1a1a1b] border border-[#343536] rounded text-white focus:outline-none focus:border-[#ff4500]"
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
              defaultValue={post.content}
              className="w-full px-4 py-2 bg-[#1a1a1b] border border-[#343536] rounded text-white focus:outline-none focus:border-[#ff4500] resize-none"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <a
              href={`/post/${post.id}`}
              className="px-4 py-2 bg-[#343536] hover:bg-[#3d3d3e] text-white rounded font-semibold transition-colors"
            >
              취소
            </a>
            <button
              type="submit"
              className="px-4 py-2 bg-[#ff4500] hover:bg-[#ff5714] text-white rounded font-semibold transition-colors"
            >
              수정하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


