import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'

export default async function Header() {
  let user = null
  
  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser
  } catch (error) {
    console.error('Error getting user in Header:', error)
    // 환경 변수가 없거나 Supabase 연결 실패 시에도 헤더는 표시
    user = null
  }

  return (
    <header className="bg-[#1a1a1b] border-b border-[#343536] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/comlogo.png"
            alt="MakeCommunity Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-2xl font-bold text-[#ff4500]">MakeCommunity</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            href="/search"
            className="text-[#d7dadc] hover:text-white transition-colors"
          >
            검색
          </Link>
          {user ? (
            <>
              <Link
                href="/write"
                className="px-4 py-2 bg-[#ff4500] hover:bg-[#ff5714] text-white rounded font-semibold transition-colors"
              >
                글쓰기
              </Link>
              <Link
                href="/profile"
                className="text-[#d7dadc] hover:text-white transition-colors"
              >
                내 정보
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-[#d7dadc] hover:text-white transition-colors"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[#d7dadc] hover:text-white transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-[#ff4500] hover:bg-[#ff5714] text-white rounded font-semibold transition-colors"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

