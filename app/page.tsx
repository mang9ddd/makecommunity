import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import PostVoteButtons from '@/components/PostVoteButtons'

export const dynamic = 'force-dynamic'

async function getPosts() {
  try {
    const supabase = await createClient()
    
    // posts.user_id와 profiles.id는 모두 auth.users(id)를 참조
    // PostgREST는 직접 외래 키가 없으면 자동 조인을 못하므로
    // 별도로 profiles를 조회하거나, 스키마에 외래 키를 추가해야 함
    // 일단 profiles 조인 없이 먼저 시도
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_reactions (
          reaction_type,
          user_id
        ),
        comments (id)
      `)
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (error) {
      // 에러 객체 전체를 먼저 로깅
      console.error('=== Error fetching posts ===')
      console.error('Full error object:', error)
      console.error('Error type:', typeof error)
      console.error('Error constructor:', error?.constructor?.name)
      console.error('Error instanceof Error:', error instanceof Error)
      
      // 에러 속성들을 개별적으로 로깅
      try {
        console.error('Error message:', error.message)
        console.error('Error code:', error.code)
        console.error('Error details:', error.details)
        console.error('Error hint:', error.hint)
        console.error('Error status:', (error as any)?.status)
        console.error('Error name:', (error as any)?.name)
      } catch (e) {
        console.error('Error accessing error properties:', e)
      }
      
      // 에러를 문자열로 변환 시도
      try {
        console.error('Error toString:', error.toString())
      } catch (e) {
        console.error('Cannot convert error to string')
      }
      
      console.error('================================')
      
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
  } catch (err) {
    console.error('Unexpected error in getPosts (catch block):', err)
    console.error('Error type:', typeof err)
    if (err instanceof Error) {
      console.error('Error message:', err.message)
      console.error('Error stack:', err.stack)
    }
    return []
  }
}

export default async function HomePage() {
  const posts = await getPosts()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {posts.length === 0 ? (
            <div className="bg-[#272729] rounded-lg p-8 text-center border border-[#343536]">
              <p className="text-[#818384]">아직 게시글이 없습니다.</p>
              {user && (
                <Link
                  href="/write"
                  className="mt-4 inline-block px-4 py-2 bg-[#ff4500] hover:bg-[#ff5714] text-white rounded font-semibold transition-colors"
                >
                  첫 게시글 작성하기
                </Link>
              )}
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
                    <PostVoteButtons score={likes - dislikes} />
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

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#272729] rounded-lg p-4 border border-[#343536] sticky top-20">
            <h3 className="text-lg font-semibold text-white mb-4">커뮤니티 정보</h3>
            <p className="text-sm text-[#d7dadc] mb-4">
              MakeCommunity에 오신 것을 환영합니다!
            </p>
            {!user && (
              <Link
                href="/signup"
                className="block w-full text-center px-4 py-2 bg-[#ff4500] hover:bg-[#ff5714] text-white rounded font-semibold transition-colors"
              >
                회원가입
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
