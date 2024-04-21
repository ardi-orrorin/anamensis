FROM openjdk:17-slim
#FROM node:21-alpine3.19

RUN apt-get update && apt-get install -y curl
LABEL author="ARDI"
VOLUME /tmp
ARG JAR
ARG JAR_FILE=server/build/libs/${JAR}.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]