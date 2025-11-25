# MakeCommunity

Reddit 스타일의 커뮤니티 게시판 프로젝트입니다.

## 기술 스택

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (PostgreSQL, 인증, RLS)

## 주요 기능

- ✅ 회원가입 / 로그인 / 로그아웃
- ✅ 게시글 작성 / 수정 / 삭제
- ✅ 댓글 작성 / 삭제
- ✅ 좋아요 / 싫어요
- ✅ 게시글 검색
- ✅ 프로필 페이지

## 시작하기

### 1. 프로젝트 클론 및 의존성 설치

```bash
npm install
```

### 2. Supabase 프로젝트 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트를 생성합니다.
2. 프로젝트 설정에서 다음 정보를 확인합니다:
   - Project URL
   - Anon public key

### 3. 데이터베이스 스키마 설정

1. Supabase 대시보드의 SQL Editor로 이동합니다.
2. `supabase/schema.sql` 파일의 내용을 복사하여 실행합니다.
3. 이 스크립트는 다음을 생성합니다:
   - `profiles` 테이블
   - `posts` 테이블
   - `comments` 테이블
   - `post_reactions` 테이블
   - 필요한 인덱스 및 RLS 정책

### 4. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## 프로젝트 구조

```
makecommunity/
├── app/
│   ├── actions/          # Server Actions
│   │   ├── auth.ts       # 인증 관련 액션
│   │   ├── posts.ts      # 게시글 관련 액션
│   │   ├── comments.ts   # 댓글 관련 액션
│   │   └── reactions.ts  # 좋아요/싫어요 액션
│   ├── login/            # 로그인 페이지
│   ├── signup/           # 회원가입 페이지
│   ├── write/            # 글쓰기 페이지
│   ├── post/[id]/        # 게시글 상세 페이지
│   ├── search/           # 검색 페이지
│   └── profile/          # 프로필 페이지
├── components/           # 재사용 컴포넌트
│   ├── Header.tsx
│   ├── PostActions.tsx
│   ├── CommentSection.tsx
│   └── SearchForm.tsx
├── lib/
│   └── supabase/         # Supabase 클라이언트 설정
├── supabase/
│   └── schema.sql        # 데이터베이스 스키마
└── middleware.ts         # 인증 미들웨어
```

## 주요 기능 설명

### 인증
- Supabase Auth를 사용한 이메일/비밀번호 인증
- 세션 관리는 Supabase SSR 패키지로 처리

### 게시글
- 제목과 내용으로 게시글 작성
- 작성자만 수정/삭제 가능 (RLS 정책)

### 댓글
- 게시글에 댓글 작성
- 작성자만 삭제 가능

### 좋아요/싫어요
- 각 게시글에 좋아요 또는 싫어요 가능
- 같은 버튼을 다시 클릭하면 취소
- 다른 버튼을 클릭하면 반응 변경

### 검색
- 게시글 제목과 내용에서 검색
- 대소문자 구분 없이 검색

## 스타일링

Reddit 스타일의 다크 테마를 적용했습니다:
- 배경: `#1a1a1b`
- 카드: `#272729`
- 테두리: `#343536`
- 강조 색상: `#ff4500` (Reddit 주황색)

## 라이선스

MIT
