'use client'

import { signUp } from '@/app/actions/auth'
import Link from 'next/link'
import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()
  const [state, formAction] = useActionState(signUp, null)

  useEffect(() => {
    if (state?.success) {
      // 성공 메시지를 잠시 표시한 후 리다이렉트
      setTimeout(() => {
        router.push('/')
      }, 1500)
    }
  }, [state, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1b]">
      <div className="w-full max-w-md">
        <div className="bg-[#272729] rounded-lg p-8 border border-[#343536]">
          <h1 className="text-2xl font-bold mb-6 text-white">회원가입</h1>
          {state?.error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="mb-4 p-3 bg-green-900/20 border border-green-500 rounded text-green-400 text-sm">
              회원가입이 완료되었습니다!
            </div>
          )}
          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                사용자 이름
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="w-full px-4 py-2 bg-[#1a1a1b] border border-[#343536] rounded text-white focus:outline-none focus:border-[#ff4500]"
                placeholder="사용자 이름을 입력하세요"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                이메일
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 bg-[#1a1a1b] border border-[#343536] rounded text-white focus:outline-none focus:border-[#ff4500]"
                placeholder="이메일을 입력하세요"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                className="w-full px-4 py-2 bg-[#1a1a1b] border border-[#343536] rounded text-white focus:outline-none focus:border-[#ff4500]"
                placeholder="비밀번호를 입력하세요 (최소 6자)"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#ff4500] hover:bg-[#ff5714] text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              회원가입
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-[#818384]">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-[#ff4500] hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


