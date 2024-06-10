FROM       openjdk:21-slim
RUN        apt-get update && apt-get install -y curl
LABEL      author="ARDI"
VOLUME     /tmp
ARG        JAR
ARG        JAR_FILE=server/build/libs/${JAR}.jar
COPY       ${JAR_FILE} app.jar
ENV        SPRING_CONFIG_LOCATION "/application.yml"
ENV        SPRING_PROFILES_ACTIVE "prod"
ENTRYPOINT ["java", "-Djava.net.preferIPv4Stack=true", "-jar", "/app.jar"]