FROM openjdk:17-slim
#FROM node:21-alpine3.19

LABEL author="ARDI"
VOLUME /tmp
ARG JAR
ARG JAR_FILE=server/build/libs/${JAR}.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
