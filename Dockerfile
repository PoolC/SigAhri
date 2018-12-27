FROM node:8-slim

# 앱 디렉터리 생성
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./dist .

RUN npm install -g serve

CMD ["serve", "-l", "3939"]
