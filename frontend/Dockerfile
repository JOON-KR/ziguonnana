FROM node:latest AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# 빌드
RUN npm run build

# Nginx
FROM nginx:latest
# 빌드파일을 Nginx의 HTML 디렉토리로 복사
COPY --from=build /app/build /usr/share/nginx/html
# 80포트 오픈
EXPOSE 80
# nginx 실행
CMD ["nginx", "-g", "daemon off;"]
