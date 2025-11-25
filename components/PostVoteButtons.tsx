'use client'

interface PostVoteButtonsProps {
  score: number
}

export default function PostVoteButtons({ score }: PostVoteButtonsProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: 추천/비추천 기능 구현
  }

  return (
    <div className="flex flex-col items-center space-y-1">
      <button
        onClick={handleClick}
        className="text-[#818384] hover:text-[#ff4500] transition-colors"
      >
        ▲
      </button>
      <span className="text-sm font-semibold text-[#d7dadc]">
        {score}
      </span>
      <button
        onClick={handleClick}
        className="text-[#818384] hover:text-[#7193ff] transition-colors"
      >
        ▼
      </button>
    </div>
  )
}

