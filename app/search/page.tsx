import { createClient } from '@/lib/supabase/server'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import Link from 'next/link'
import SearchForm from '@/components/SearchForm'

async function searchPosts(searchTerm: string) {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      post_reactions (
        reaction_type
      ),
      comments (id)
    `)
    .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error searching posts:', error)
    return []
  }

  // posts를 가져온 후 profiles를 별도로 조회하여 매핑
  if (posts && posts.length > 0) {
    const userIds = [...new Set(posts.map((p: any) => p.user_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', userIds)
    
    const profilesMap = new Map(profiles?.map((p: any) => [p.id, p]) || [])
    
    return posts.map((post: any) => ({
      ...post,
      profiles: profilesMap.get(post.user_id) || null,
    }))
  }

  return posts || []
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const searchTerm = searchParams.q || ''
  const posts = searchTerm ? await searchPosts(searchTerm) : []

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-4">검색</h1>
        <SearchForm initialValue={searchTerm} />
      </div>

      {searchTerm && (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-[#272729] rounded-lg p-8 text-center border border-[#343536]">
              <p className="text-[#818384]">검색 결과가 없습니다.</p>
            </div>
          ) : (
            posts.map((post: any) => {
              const likes = post.post_reactions?.filter((r: any) => r.reaction_type === 'like').length || 0
              const dislikes = post.post_reactions?.filter((r: any) => r.reaction_type === 'dislike').length || 0
              const commentCount = post.comments?.length || 0

              return (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="block bg-[#272729] rounded-lg p-4 border border-[#343536] hover:border-[#818384] transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-[#818384]">▲</span>
                      <span className="text-sm font-semibold text-[#d7dadc]">
                        {likes - dislikes}
                      </span>
                      <span className="text-[#818384]">▼</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-white mb-2 hover:text-[#ff4500] transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-[#d7dadc] text-sm mb-3 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-[#818384]">
                        <span>u/{post.profiles?.username || '익명'}</span>
                        <span>
                          {formatDistanceToNow(new Date(post.created_at), {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </span>
                        <span>{commentCount} 댓글</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}


