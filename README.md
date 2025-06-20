# nextjs-devtools

![npm](https://img.shields.io/npm/v/nextjs-devtools)

`next.js` 개발을 위한 `devtools CLI`

## Features

- `typed-i18n-dictionaries`: `yaml`로 작성된 i18n 전용 딕셔너리 파일(`src/dictionaries.json`)을 생성
- `typed-next-routes`: `next.js` 타입세이프 라우트 파일(`src/app-path-types.ts`)을 생성

## Usage

프로덕션 빌드 전 실행

```bash
pnpx nextjs-devtools
```

개발 모드 실행

> 메모리 사용량이 늘어날 수 있습니다.

```bash
pnpx nextjs-devtools --watch
```

개발 모드 백그라운드에서 실행 (스크립트 추가)

```bash
pnpm pkg set scripts.predev="pnpx nextjs-devtools --watch"
pnpm dev
```