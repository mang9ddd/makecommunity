'use client'

import { signIn } from '@/app/actions/auth'
import Link from 'next/link'
import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [state, formAction] = useActionState(signIn, null)

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
          <h1 className="text-2xl font-bold mb-6 text-white">로그인</h1>
          {state?.error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="mb-4 p-3 bg-green-900/20 border border-green-500 rounded text-green-400 text-sm">
              로그인 성공!
            </div>
          )}
          <form action={formAction} className="space-y-4">
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
                className="w-full px-4 py-2 bg-[#1a1a1b] border border-[#343536] rounded text-white focus:outline-none focus:border-[#ff4500]"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#ff4500] hover:bg-[#ff5714] text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              로그인
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-[#818384]">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="text-[#ff4500] hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


