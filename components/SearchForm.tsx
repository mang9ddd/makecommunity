'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface SearchFormProps {
  initialValue?: string
}

export default function SearchForm({ initialValue = '' }: SearchFormProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="검색어를 입력하세요..."
        className="flex-1 px-4 py-2 bg-[#1a1a1b] border border-[#343536] rounded text-white focus:outline-none focus:border-[#ff4500]"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-[#ff4500] hover:bg-[#ff5714] text-white rounded font-semibold transition-colors"
      >
        검색
      </button>
    </form>
  )
}


