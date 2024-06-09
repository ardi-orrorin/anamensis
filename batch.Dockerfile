FROM       openjdk:17-slim
RUN        apt-get update && apt-get install -y curl
LABEL      author="ARDI"
VOLUME     /tmp
ARG        JAR
ARG        JAR_FILE=batch/build/libs/${JAR}.jar
COPY       ${JAR_FILE} app.jar
ENV        SPRING_CONFIG_LOCATION "/application.yml"
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "/app.jar"]