# Supabase 설정 가이드

이 문서는 MakeCommunity 프로젝트를 위한 Supabase 설정 방법을 안내합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 로그인합니다.
2. "New Project" 버튼을 클릭합니다.
3. 프로젝트 정보를 입력합니다:
   - **Name**: 프로젝트 이름 (예: makecommunity)
   - **Database Password**: 강력한 비밀번호를 설정하고 기록해두세요
   - **Region**: 가장 가까운 리전 선택
4. "Create new project"를 클릭합니다.
5. 프로젝트 생성이 완료될 때까지 기다립니다 (약 2분 소요).

## 2. 프로젝트 정보 확인

1. 프로젝트 대시보드에서 왼쪽 사이드바의 "Settings" (⚙️)를 클릭합니다.
2. "API" 섹션으로 이동합니다.
3. 다음 정보를 복사합니다:
   - **Project URL**: `https://xxxxx.supabase.co` 형식
   - **anon public key**: `eyJ...`로 시작하는 긴 문자열

## 3. 환경 변수 설정

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=여기에_Project_URL_붙여넣기
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_anon_public_key_붙여넣기
```

예시:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

## 4. 데이터베이스 스키마 생성

1. Supabase 대시보드에서 왼쪽 사이드바의 "SQL Editor"를 클릭합니다.
2. "New query"를 클릭합니다.
3. 프로젝트의 `supabase/schema.sql` 파일을 열어 전체 내용을 복사합니다.
4. SQL Editor에 붙여넣습니다.
5. "Run" 버튼을 클릭하여 실행합니다.
6. 성공 메시지가 표시되면 완료입니다.

## 5. 인증 설정 확인 및 이메일 확인 비활성화 (개발 환경)

**중요**: 개발 환경에서는 이메일 확인을 비활성화하는 것이 좋습니다. 이렇게 하면 회원가입 후 바로 로그인할 수 있습니다.

1. 왼쪽 사이드바의 "Authentication"을 클릭합니다.
2. "Providers" 섹션에서 "Email"이 활성화되어 있는지 확인합니다.
3. "Settings" 탭으로 이동합니다.
4. "Email Auth" 섹션을 찾습니다.
5. **"Confirm email"** 옵션을 **비활성화**합니다 (토글을 OFF로 설정).
6. 변경사항을 저장합니다.

이제 회원가입 후 이메일 확인 없이 바로 로그인할 수 있습니다.

## 6. Row Level Security (RLS) 확인

스키마를 실행하면 자동으로 RLS 정책이 생성됩니다. 확인하려면:

1. 왼쪽 사이드바의 "Table Editor"를 클릭합니다.
2. 각 테이블(`profiles`, `posts`, `comments`, `post_reactions`)을 클릭합니다.
3. "RLS enabled"가 표시되어 있는지 확인합니다.

## 7. 테스트

1. 개발 서버를 실행합니다:
   ```bash
   npm run dev
   ```

2. 브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

3. 회원가입 페이지로 이동하여 테스트 계정을 생성합니다.

4. 게시글을 작성하고 기능을 테스트합니다.

## 문제 해결

### "Invalid API key" 오류
- `.env.local` 파일의 환경 변수가 올바른지 확인하세요.
- Supabase 대시보드에서 API 키를 다시 복사하세요.
- 개발 서버를 재시작하세요.

### "relation does not exist" 오류
- `supabase/schema.sql` 파일이 제대로 실행되었는지 확인하세요.
- SQL Editor에서 테이블이 생성되었는지 확인하세요.

### 인증 오류 / 로그인 실패
- Supabase 대시보드의 Authentication > Settings에서 "Enable email signup"이 활성화되어 있는지 확인하세요.
- **회원가입 후 로그인이 안 되는 경우**: Authentication > Settings에서 "Confirm email"을 비활성화하세요. (개발 환경 권장)
- 이메일 확인이 활성화되어 있으면 회원가입 후 이메일 인증 링크를 클릭해야 로그인할 수 있습니다.

## 추가 리소스

- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js + Supabase 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)


