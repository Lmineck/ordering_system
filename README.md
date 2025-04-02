
# 웹 어드민 프로젝트

이 프로젝트는 Next.js 기반의 관리자 페이지이며, 사용자, 아이템, 주문 등을 관리하는 기능을 포함합니다. Firebase 인증, RESTful API, 모듈화된 구조를 바탕으로 구성되어 있습니다.

---

## 🛠️ 사용 기술

- **Next.js** (App Router 기반)
- **TypeScript**
- **Firebase Auth**
- **Tailwind CSS**
- **React Hook Form**, **Zustand** 등 상태관리 및 유틸리티 라이브러리

---

## 📁 디렉토리 구조

```
src/
├── app/                 # 페이지 및 라우팅 구성
│   ├── admin/           # 관리자 전용 페이지 (items, orders, users)
│   ├── api/             # API 라우트
│   ├── auth/            # 로그인/회원가입 페이지
│   └── branch/          # 지점 관련 페이지
├── components/          # 공통 컴포넌트
├── firebase/            # Firebase 설정
├── lib/                 # 라이브러리 유틸
├── modules/             # 도메인 비즈니스 로직
├── services/            # API 요청 정의
├── stores/              # Zustand 전역 상태관리
├── styles/              # 전역 스타일
├── types/               # TypeScript 타입 정의
└── utils/               # 유틸 함수 모음
```

---

## ⚙️ 설치 및 실행 방법

1. 저장소 클론
```bash
git clone https://github.com/your/repo.git
cd your-repo
```

2. 의존성 설치
```bash
npm install
```

3. 환경변수 설정 (`.env` 파일 생성)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
```

4. 개발 서버 실행
```bash
npm run dev
```

---

## ✅ 주요 기능

- 관리자 페이지를 통한 **아이템/주문/회원 관리**
- Firebase 기반 **로그인/회원가입 인증**
- RESTful API 기반의 데이터 통신
- 반응형 UI 및 다크모드 지원 (설정에 따라)

---

## 📌 기타

- Firebase를 사용하므로 사전에 Firebase 콘솔에 프로젝트를 만들어야 합니다.
- 프로젝트 실행을 위해 `.env` 파일을 반드시 구성해주세요.
