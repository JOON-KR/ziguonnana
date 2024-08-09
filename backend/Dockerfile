FROM openjdk:17-alpine
# FFmpeg와 FFprobe 설치
RUN apk add --no-cache ffmpeg

WORKDIR /app

ARG JAR_PATH=./build/libs

COPY ${JAR_PATH}/*-0.0.1-SNAPSHOT.jar app.jar

CMD ["java","-jar","./app.jar"]