# Step 1: Build the React application
FROM node:18 AS build

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치 및 애플리케이션 빌드
COPY package.json package-lock.json ./
RUN npm install
COPY . /app/
RUN npm run build

# Step 2: Serve the React app with Nginx
FROM nginx:alpine

# 빌드된 파일 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 설정 덮어쓰기
COPY default.conf /etc/nginx/conf.d/default.conf

# 컨테이너가 3000 포트를 열도록 설정
EXPOSE 3000

# Nginx 시작
CMD ["nginx", "-g", "daemon off;"]
