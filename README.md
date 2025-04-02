
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

### ✅ 주요 기능

- **👤 사용자 관리**
  - 사용자 목록 조회 및 검색
  - 사용자 상세 정보 확인
  - 사용자 권한 및 상태 수정 (예: 활성/비활성, 관리자 설정 등)

- **📦 아이템(상품) 관리**
  - 아이템 목록 조회 및 분류별 정렬
  - 아이템 등록, 수정, 삭제
  - 이미지 업로드 기능 지원 (Firebase Storage 연동)
  - 카테고리별 필터링 및 상세정보 제공

- **🧾 주문 관리**
  - 주문 목록 및 상세 조회
  - 주문 상태 변경 (예: 결제완료, 배송중, 취소 등)
  - 사용자-주문 연동 정보 확인

- **🔐 인증 기능**
  - Firebase 기반 로그인 / 회원가입
  - 인증 상태 확인 및 인증된 사용자만 접근 가능한 관리자 페이지
  - JWT 또는 Firebase Token 기반 API 보호

- **🌐 API 라우팅**
  - Next.js App Router 기반의 서버 API 구성
  - RESTful API로 CRUD 기능 제공 (`/api/items`, `/api/orders` 등)
  - 각 API는 `route.ts`로 분리되어 관리

- **💾 전역 상태 관리**
  - Zustand를 이용한 사용자 정보, 테마 등 클라이언트 상태 관리

- **🧩 공통 컴포넌트 구성**
  - 버튼, 입력창, 테이블 등 재사용 가능한 UI 컴포넌트 다수 포함

- **🎨 스타일링**
  - Tailwind CSS를 이용한 반응형 레이아웃
  - 다크모드 지원 (설정 시)

- **📁 모듈화된 코드 구조**
  - `modules`, `services`, `stores`, `types` 폴더로 비즈니스 로직 및 API 요청 분리

---

## 📌 기타

- Firebase를 사용하므로 사전에 Firebase 콘솔에 프로젝트를 만들어야 합니다.
- 프로젝트 실행을 위해 `.env` 파일을 반드시 구성해주세요.
