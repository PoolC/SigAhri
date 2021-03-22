# SigAhri
> Poolc 홈페이지 프론트엔드

URL : https://poolc.org/

## Prerequisites
 - npm 6.4.1
 - Docker

## 개발
### 설정
필요한 라이브러리를 설치 해 줍니다.
```
npm install
```
파이어베이스 설정에 필요한 환경 변수를 설정해줍니다.
```
cp .env.example .env
vi .env
```

### 실행
```
npm run start
```

### 배포
```
# Build react
npm run build

# Build docker image
docker build -t poolc/sigahri .

# Run docker container
docker run -p 8080:8080 poolc/sigahri
```
