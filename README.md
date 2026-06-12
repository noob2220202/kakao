# 카카오뱅크 클론 (학습용)

카카오뱅크 앱 UI를 따라 만드는 개인 학습용 클론 코딩 프로젝트입니다.
배포하지 않으며, 실제 API 연동 없이 더미 데이터로만 동작합니다.

## 기술 스택

- React Native 0.85 + TypeScript
- Expo SDK 56
- expo-router (파일 기반 라우팅)

## 실행

```bash
npm install
npm start        # Expo Dev Server (Expo Go로 QR 스캔)
npm run android  # 안드로이드
npm run typecheck
```

## 화면 / 라우팅 구조

| 화면 | 경로 | 파일 |
|---|---|---|
| 홈 (계좌 목록) | `/` | `app/(tabs)/index.tsx` |
| 이체 (받는 사람 선택) | `/transfer` | `app/transfer.tsx` |
| 계좌상세 | `/account/[id]` | `app/account/[id]/index.tsx` |
| 거래내역 전체 | `/account/[id]/transactions` | `app/account/[id]/transactions.tsx` |
| 거래상세 | `/transaction/[id]` | `app/transaction/[id].tsx` |

홈 화면은 하단 탭(홈 · 혜택 · AI · 투자 · 전체) 안에 있으며,
혜택/AI/투자/전체 탭은 플레이스홀더 상태입니다.

## 디렉터리

```
app/                  # expo-router 라우트
src/
  components/         # 공용 컴포넌트
  constants/theme.ts  # 컬러/폰트 상수
  data/dummy.ts       # 더미 데이터 (계좌, 거래내역, 이체 대상)
```

각 화면의 상세 UI는 스크린샷을 받아 하나씩 구현합니다.

## 참고

- 앱 아이콘/스플래시 이미지는 아직 없습니다 (Expo 기본값 사용). 추후 추가 예정.
- `package-lock.json`은 커밋하지 않습니다. `npm install` 시 자동 생성됩니다.
