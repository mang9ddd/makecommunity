# 로그인 문제 해결 가이드

## 문제: 회원가입은 성공했지만 로그인이 안 되는 경우

이 문제는 대부분 **이메일 확인 설정** 때문입니다.

## 해결 방법 1: Supabase 대시보드에서 이메일 확인 비활성화 (권장)

개발 환경에서는 이메일 확인을 비활성화하는 것이 가장 간단합니다.

1. **Supabase 대시보드** 접속
2. 왼쪽 사이드바에서 **"Authentication"** 클릭
3. **"Settings"** 탭 선택
4. **"Email Auth"** 섹션 찾기
5. **"Confirm email"** 토글을 **OFF**로 설정
6. 페이지 하단의 **"Save"** 버튼 클릭

이제 회원가입 후 바로 로그인할 수 있습니다.

## 해결 방법 2: 기존 사용자의 이메일 수동 확인

이미 회원가입한 계정이 있다면, Supabase 대시보드에서 직접 이메일을 확인 처리할 수 있습니다.

1. **Supabase 대시보드** 접속
2. 왼쪽 사이드바에서 **"Authentication"** 클릭
3. **"Users"** 탭 선택
4. 이메일로 사용자 검색: `kwonmingi74@gmail.com`
5. 사용자를 클릭하여 상세 정보 열기
6. **"Confirm email"** 버튼 클릭 (또는 "Actions" 메뉴에서 "Confirm user" 선택)
7. 이제 로그인 시도

## 해결 방법 3: SQL로 직접 이메일 확인 처리

Supabase SQL Editor에서 다음 SQL을 실행:

```sql
-- 사용자 이메일 확인 처리
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'kwonmingi74@gmail.com';
```

## 해결 방법 4: 비밀번호 재설정

비밀번호가 잘못 입력되었을 수도 있습니다.

1. Supabase 대시보드 → Authentication → Users
2. 사용자 찾기
3. "Actions" → "Reset password" 클릭
4. 이메일로 비밀번호 재설정 링크 전송

또는 SQL로 직접 비밀번호 변경:

```sql
-- 비밀번호를 'asdf1234'로 변경 (실제로는 해시된 값이 필요하므로 권장하지 않음)
-- 대신 Supabase 대시보드의 "Reset password" 기능 사용 권장
```

## 확인 사항

로그인 시도 후 브라우저 콘솔(F12)에서 다음 정보를 확인하세요:

1. **Network 탭**: `/auth/v1/token` 요청의 응답 확인
2. **Console 탭**: "Sign in error:" 메시지 확인
3. 에러 메시지의 `status`와 `message` 확인

## 추가 디버깅

로그인 페이지에서 로그인을 시도하면 서버 콘솔에 다음과 같은 정보가 출력됩니다:

```
Sign in error: {
  message: '...',
  status: 400,
  name: 'AuthApiError'
}
```

이 정보를 확인하여 정확한 원인을 파악할 수 있습니다.

