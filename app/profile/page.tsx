import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import Link from 'next/link'

async function getUserPosts(userId: string) {
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
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error fetching user posts:', error)
    return []
  }

  return posts || []
}

async function getUserProfile(userId: string) {
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', {
      message: error.message,
      code: error.code,
      details: error.details,
    })
    // 프로필이 없으면 null 반환 (나중에 auth.users 정보 사용)
    return null
  }

  return profile
}

export default async function ProfilePage() {
  let user = null
  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser
  } catch (error) {
    console.error('Error getting user in ProfilePage:', error)
    // 에러 발생 시 로그인 페이지로 리다이렉트
    redirect('/login')
  }

  if (!user) {
    redirect('/login')
  }

  const profile = await getUserProfile(user.id)
  const posts = await getUserPosts(user.id)

  // username이 없으면 이메일의 @ 앞부분 사용 또는 기본값
  const displayUsername = profile?.username || user.email?.split('@')[0] || '사용자'
  
  // 가입일은 프로필의 created_at 또는 auth.users의 created_at 사용
  const joinDate = profile?.created_at || user.created_at

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-[#272729] rounded-lg p-6 border border-[#343536] mb-6">
        <h1 className="text-2xl font-bold text-white mb-4">내 정보</h1>
        <div className="space-y-2">
          <div>
            <span className="text-[#818384]">사용자 이름: </span>
            <span className="text-white font-semibold">{displayUsername}</span>
            {!profile?.username && (
              <span className="text-xs text-[#818384] ml-2">(프로필이 생성되지 않았습니다)</span>
            )}
          </div>
          <div>
            <span className="text-[#818384]">이메일: </span>
            <span className="text-white">{user.email}</span>
          </div>
          <div>
            <span className="text-[#818384]">가입일: </span>
            <span className="text-white">
              {joinDate
                ? formatDistanceToNow(new Date(joinDate), {
                    addSuffix: true,
                    locale: ko,
                  })
                : '알 수 없음'}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">내 게시글</h2>
        {posts.length === 0 ? (
          <div className="bg-[#272729] rounded-lg p-8 text-center border border-[#343536]">
            <p className="text-[#818384]">작성한 게시글이 없습니다.</p>
            <Link
              href="/write"
              className="mt-4 inline-block px-4 py-2 bg-[#ff4500] hover:bg-[#ff5714] text-white rounded font-semibold transition-colors"
            >
              첫 게시글 작성하기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post: any) => {
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
                      <h3 className="text-lg font-semibold text-white mb-2 hover:text-[#ff4500] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-[#d7dadc] text-sm mb-3 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-[#818384]">
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
            })}
          </div>
        )}
      </div>
    </div>
  )
}


